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

// ✅ ฟังก์ชันกลางสำหรับส่งอีเมล
async function sendEmailNotificationHelper(type: string, userId: string) {
  try {
    // Default user data in case we can't fetch it
    let userData: any = {
      fullname_th: "ผู้ใช้",
      email: ""
    };
    
    try {
      // Try to get user data, but don't fail if we can't
      const userDoc = await admin.firestore().collection("users").doc(userId).get();
      if (userDoc.exists) {
        userData = userDoc.data() || userData;
        console.log(`✅ Successfully fetched user data for ${userId}`);
      } else {
        console.warn(`⚠️ User document not found for ${userId}, using default values`);
      }
    } catch (userError) {
      console.error(`❌ Error fetching user data: ${userError}`);
      // Continue with default userData
    }

    // Default admin emails
    let adminEmails = ["jmdsponx@gmail.com", "admin@thaifilmdirectors.com"];
    
    try {
      // Try to get admin users, but don't fail if we can't
      const adminSnapshot = await admin.firestore()
        .collection("users")
        .where("web_role", "==", "admin")
        .get();

      // Extract admin emails, filter out any undefined/null values
      const fetchedAdminEmails = adminSnapshot.docs.map(doc => doc.data()?.email).filter(Boolean);
      
      // Only use fetched emails if we found some
      if (fetchedAdminEmails.length > 0) {
        adminEmails = fetchedAdminEmails;
        console.log(`✅ Successfully fetched ${adminEmails.length} admin emails`);
      } else {
        console.warn("⚠️ No admin users found in database, using fallback email addresses");
      }
    } catch (adminError) {
      console.error(`❌ Error fetching admin users: ${adminError}`);
      console.warn("⚠️ Using fallback admin email addresses due to error");
      // Continue with default adminEmails
    }
    
    console.log(`📝 Admin emails for notification: ${adminEmails.join(", ")}`);

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
              <li><strong>ชื่อ:</strong> ${userData.fullname_th || "N/A"}</li>
              <li><strong>อีเมล:</strong> ${userData.email || "N/A"}</li>
            </ul>
            <a href="https://thaifilmdirectors.com/admin/applications" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">ตรวจสอบการสมัคร</a>
          `
        };
        break;

      case "director_approved":
        emailOptions = {
          to: userData.email || "",
          subject: "ยินดีด้วย! 🎉 การสมัครของคุณได้รับการอนุมัติแล้ว",
          html: `
            <h2>สวัสดีคุณ ${userData.fullname_th || "ผู้ใช้"},</h2>
            <p>การสมัครเป็นผู้กำกับของคุณได้รับการอนุมัติเรียบร้อยแล้ว</p>
            <a href="https://thaifilmdirectors.com/edit-profile" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">อัปเดตโปรไฟล์ของคุณ</a>
          `
        };
        break;

      case "director_rejected":
        emailOptions = {
          to: userData.email || "",
          subject: "แจ้งสถานะการสมัครของคุณ",
          html: `
            <h2>สวัสดีคุณ ${userData.fullname_th || "ผู้ใช้"},</h2>
            <p>ขอแจ้งว่า การสมัครของคุณยังไม่ผ่านการอนุมัติในขณะนี้</p>
            <a href="mailto:contact@thaifilmdirectors.com" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">ติดต่อเรา</a>
          `
        };
        break;

      default:
        throw new Error("ประเภทการแจ้งเตือนไม่ถูกต้อง");
    }

    await transporter.sendMail({
      from: `"สมาคมผู้กำกับภาพยนตร์ไทย" <${gmailAddress}>`,
      ...emailOptions,
      replyTo: "admin@thaifilmdirectors.com"
    });

    console.log(`✅ ส่งอีเมลสำเร็จ: ${type} -> ${emailOptions.to}`);
    return { success: true };
  } catch (error) {
    console.error("❌ sendEmailNotificationHelper error:", error);
    throw error;
  }
}

export const onNewDirectorSignup = functions
  .region("asia-southeast1")
  .firestore.document("users/{userId}")
  .onCreate(async (snapshot, context) => {
    try {
      const userData = snapshot.data();
      const userId = context.params.userId;
      
      console.log(`📝 New user created: ${userId}`, userData);
      
      // Check for different possible field names that might indicate a director
      const isDirector = 
        userData.occupation === "director" || 
        userData.role === "director" || 
        userData.user_type === "director" ||
        (userData.roles && userData.roles.includes("director"));
      
      console.log(`📝 Is user a director? ${isDirector ? "YES" : "NO"}`);
      
      if (isDirector) {
        console.log(`📝 Sending email notification for new director: ${userId}`);
        await sendEmailNotificationHelper("new_director_signup", userId);
        console.log(`✅ Email notification sent for new director: ${userId}`);
      } else {
        console.log(`📝 Not sending email - user is not a director: ${userId}`);
      }
    } catch (error) {
      console.error(`❌ Error in onNewDirectorSignup: ${error}`);
    }
    return null;
  });

export const onDirectorStatusChange = functions
  .region("asia-southeast1")
  .firestore.document("users/{userId}")
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();
      const userId = context.params.userId;
      
      console.log(`📝 User updated: ${userId}`, { before, after });
      
      // Check for different possible field names that might indicate a director
      const isDirector = 
        after.occupation === "director" || 
        after.role === "director" || 
        after.user_type === "director" ||
        (after.roles && after.roles.includes("director"));
      
      // Check for different possible status field names
      const beforeStatus = before.verification_status || before.status || before.director_status;
      const afterStatus = after.verification_status || after.status || after.director_status;
      
      const statusChanged = beforeStatus !== afterStatus;
      
      console.log(`📝 Is user a director? ${isDirector ? "YES" : "NO"}`);
      console.log(`📝 Status changed? ${statusChanged ? "YES" : "NO"} (${beforeStatus} -> ${afterStatus})`);
      
      if (isDirector && statusChanged) {
        if (afterStatus === "approved") {
          console.log(`📝 Sending approval email for director: ${userId}`);
          await sendEmailNotificationHelper("director_approved", userId);
          console.log(`✅ Approval email sent for director: ${userId}`);
        } else if (afterStatus === "rejected") {
          console.log(`📝 Sending rejection email for director: ${userId}`);
          await sendEmailNotificationHelper("director_rejected", userId);
          console.log(`✅ Rejection email sent for director: ${userId}`);
        } else {
          console.log(`📝 Status changed to ${afterStatus}, no email sent`);
        }
      } else {
        console.log(`📝 Not sending email - conditions not met: isDirector=${isDirector}, statusChanged=${statusChanged}`);
      }
    } catch (error) {
      console.error(`❌ Error in onDirectorStatusChange: ${error}`);
    }
    return null;
  });

// สำหรับเรียกจาก client ถ้าต้องการ
export const sendEmailNotification = functions
  .region("asia-southeast1")
  .https.onCall(async (data: { type: string; userId: string }, context) => {
    return await sendEmailNotificationHelper(data.type, data.userId);
  });
