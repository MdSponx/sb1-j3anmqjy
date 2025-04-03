import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Initialize nodemailer with Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

const gmailAddress = functions.config().email.user;

// ฟังก์ชันกลางสำหรับส่งอีเมล
async function sendEmailNotificationHelper(type: string, userId: string, userData?: any) {
  try {
    let userDoc;
    let userData_final = userData;

    // ถ้าไม่มีข้อมูลผู้ใช้ส่งมา ให้ดึงจาก Firestore
    if (!userData_final) {
      userDoc = await admin.firestore().collection("users").doc(userId).get();
      if (!userDoc.exists) throw new Error("ไม่พบผู้ใช้");
      userData_final = userDoc.data() || {};
    }

    // ดึงข้อมูลผู้ดูแลระบบที่มี web_role เป็น admin
    const adminSnapshot = await admin.firestore()
      .collection("users")
      .where("web_role", "==", "admin")
      .get();

    let adminEmails = adminSnapshot.docs.map(doc => doc.data()?.email).filter(Boolean);
    
    // ถ้าไม่พบผู้ดูแลระบบจาก web_role ให้ลองค้นหาจากฟิลด์ role
    if (adminEmails.length === 0) {
      const altAdminSnapshot = await admin.firestore()
        .collection("users")
        .where("role", "==", "admin")
        .get();
      
      adminEmails = altAdminSnapshot.docs.map(doc => doc.data()?.email).filter(Boolean);
    }

    // ถ้ายังไม่พบผู้ดูแลระบบ ให้แจ้งเตือนความผิดพลาด
    if (adminEmails.length === 0) {
      throw new Error("ไม่พบอีเมลผู้ดูแลระบบ ไม่สามารถส่งการแจ้งเตือนได้");
    }

    // สร้างตัวเลือกสำหรับอีเมลตามประเภทการแจ้งเตือน
    let emailOptions;

    switch (type) {
      case "new_director_signup":
        emailOptions = {
          to: adminEmails.join(","),
          subject: "แจ้งเตือน: 📩 มีการสมัครใหม่จากผู้กำกับ",
          html: `
            <h2>สวัสดี Admin,</h2>
            <p>มีการสมัครใหม่จากผู้กำกับ:</p>
            <ul>
              <li><strong>ชื่อ:</strong> ${userData_final.fullname_th || userData_final.fullname || userData_final.name || "N/A"}</li>
              <li><strong>อีเมล:</strong> ${userData_final.email || "N/A"}</li>
              <li><strong>User ID:</strong> ${userId}</li>
            </ul>
            <a href="https://thaifilmdirectors.com/admin/applications" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">ตรวจสอบการสมัคร</a>
          `
        };
        break;

      case "director_approved":
        emailOptions = {
          to: userData_final.email || "",
          subject: "ยินดีด้วย! 🎉 การสมัครของคุณได้รับการอนุมัติแล้ว",
          html: `
            <h2>สวัสดีคุณ ${userData_final.fullname_th || userData_final.fullname || userData_final.name || "ผู้ใช้"},</h2>
            <p>การสมัครเป็นผู้กำกับของคุณได้รับการอนุมัติเรียบร้อยแล้ว</p>
            <a href="https://thaifilmdirectors.com/edit-profile" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">อัปเดตโปรไฟล์ของคุณ</a>
          `
        };
        break;

      case "director_rejected":
        emailOptions = {
          to: userData_final.email || "",
          subject: "แจ้งสถานะการสมัครของคุณ",
          html: `
            <h2>สวัสดีคุณ ${userData_final.fullname_th || userData_final.fullname || userData_final.name || "ผู้ใช้"},</h2>
            <p>ขอแจ้งว่า การสมัครของคุณยังไม่ผ่านการอนุมัติในขณะนี้</p>
            <a href="mailto:contact@thaifilmdirectors.com" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">ติดต่อเรา</a>
          `
        };
        break;

      default:
        throw new Error("ประเภทการแจ้งเตือนไม่ถูกต้อง");
    }

    // ตรวจสอบว่ามีผู้รับอีเมลหรือไม่
    if (!emailOptions.to || emailOptions.to.trim() === "") {
      throw new Error("ไม่พบอีเมลผู้รับ ไม่สามารถส่งการแจ้งเตือนได้");
    }

    // ส่งอีเมล
    await transporter.sendMail({
      from: `"สมาคมผู้กำกับภาพยนตร์ไทย" <${gmailAddress}>`,
      ...emailOptions,
      replyTo: "admin@thaifilmdirectors.com"
    });

    console.log(`✅ ส่งอีเมลสำเร็จ: ${type} -> ${emailOptions.to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ sendEmailNotificationHelper error:", error);
    // Enhance error with more context
    const enhancedError = error instanceof Error 
      ? new Error(`Email notification failed (${type}): ${error.message}`) 
      : new Error(`Email notification failed (${type}): ${String(error)}`);
    throw enhancedError;
  }
}

// ฟังก์ชัน Cloud Function ที่ทริกเกอร์เมื่อมีผู้ใช้ใหม่
export const onNewDirectorSignup = functions
  .region("asia-southeast1")
  .firestore.document("users/{userId}")
  .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    try {
      const userData = snapshot.data();
      
      console.log(`📝 New user created: ${userId}`);
      
      // ตรวจสอบว่าผู้ใช้เป็น director หรือไม่
      const isDirector = 
        userData.occupation === "director" || 
        userData.role === "director" || 
        userData.user_type === "director" ||
        userData.type === "director" ||
        userData.account_type === "director" ||
        (userData.roles && Array.isArray(userData.roles) && userData.roles.includes("director"));
      
      console.log(`📝 Is user a director? ${isDirector ? "YES" : "NO"}`);
      
      // ถ้าเป็น director ให้ส่งอีเมลแจ้งเตือนผู้ดูแลระบบ
      if (isDirector) {
        console.log(`📝 Sending email notification for new director: ${userId}`);
        await sendEmailNotificationHelper("new_director_signup", userId, userData);
        console.log(`✅ Email notification sent for new director: ${userId}`);
      } else {
        console.log(`📝 Not sending email - user is not a director: ${userId}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error in onNewDirectorSignup for user ${userId}: ${errorMessage}`, error);
    }
    return null;
  });

// ฟังก์ชัน Cloud Function ที่ทริกเกอร์เมื่อมีการอัปเดตสถานะของผู้กำกับ
export const onDirectorStatusChange = functions
  .region("asia-southeast1")
  .firestore.document("users/{userId}")
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    try {
      const before = change.before.data();
      const after = change.after.data();
      
      // ตรวจสอบว่าผู้ใช้เป็น director หรือไม่
      const isDirector = 
        after.occupation === "director" || 
        after.role === "director" || 
        after.user_type === "director" ||
        after.type === "director" ||
        after.account_type === "director" ||
        (after.roles && Array.isArray(after.roles) && after.roles.includes("director"));
      
      // ตรวจสอบการเปลี่ยนแปลงสถานะ
      const beforeStatus = before.verification_status || before.status || before.director_status;
      const afterStatus = after.verification_status || after.status || after.director_status;
      
      const statusChanged = beforeStatus !== afterStatus;
      
      console.log(`📝 User updated: ${userId}, Is director: ${isDirector}, Status changed: ${statusChanged} (${beforeStatus} -> ${afterStatus})`);
      
      if (isDirector && statusChanged) {
        if (afterStatus === "approved") {
          console.log(`📝 Sending approval email for director: ${userId}`);
          await sendEmailNotificationHelper("director_approved", userId, after);
          console.log(`✅ Approval email sent for director: ${userId}`);
        } else if (afterStatus === "rejected") {
          console.log(`📝 Sending rejection email for director: ${userId}`);
          await sendEmailNotificationHelper("director_rejected", userId, after);
          console.log(`✅ Rejection email sent for director: ${userId}`);
        } else {
          console.log(`📝 Status changed to ${afterStatus}, no email sent`);
        }
      } else {
        console.log(`📝 Not sending email - conditions not met: isDirector=${isDirector}, statusChanged=${statusChanged}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error in onDirectorStatusChange for user ${userId}: ${errorMessage}`, error);
    }
    return null;
  });

// สำหรับเรียกจาก client ถ้าต้องการส่งอีเมลโดยตรง
export const sendEmailNotification = functions
  .region("asia-southeast1")
  .https.onCall(async (data: { type: string; userId: string }, context) => {
    try {
      return await sendEmailNotificationHelper(data.type, data.userId);
    } catch (error) {
      console.error(`❌ Error in sendEmailNotification: ${error}`, error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new functions.https.HttpsError('internal', errorMessage);
    }
  });
