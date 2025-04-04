"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailNotification = exports.onDirectorStatusChange = exports.onNewUserSignup = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
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
async function sendEmailNotificationHelper(type, userId, userData) {
    try {
        let userDoc;
        let userData_final = userData;
        // ถ้าไม่มีข้อมูลผู้ใช้ส่งมา ให้ดึงจาก Firestore
        if (!userData_final) {
            userDoc = await admin.firestore().collection("users").doc(userId).get();
            if (!userDoc.exists)
                throw new Error("ไม่พบผู้ใช้");
            userData_final = userDoc.data() || {};
        }
        // กำหนดอีเมลผู้ดูแลระบบแบบตายตัว (hardcoded) เพื่อให้แน่ใจว่าจะส่งได้เสมอ
        const defaultAdminEmails = ['jmdsponx@gmail.com', 'admin@thaifilmdirectors.com'];
        // เริ่มด้วยอีเมลที่กำหนดไว้แบบตายตัว
        let adminEmails = [...defaultAdminEmails];
        try {
            // ดึงข้อมูลผู้ดูแลระบบที่มี web_role เป็น admin (เพิ่มเติมจากที่กำหนดไว้แล้ว)
            const adminSnapshot = await admin.firestore()
                .collection("users")
                .where("web_role", "==", "admin")
                .get();
            // เพิ่มอีเมลที่พบจากฐานข้อมูลเข้าไปในรายการ
            const dbAdminEmails = adminSnapshot.docs.map(doc => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.email; }).filter(Boolean);
            adminEmails = [...new Set([...adminEmails, ...dbAdminEmails])]; // ใช้ Set เพื่อกำจัดค่าซ้ำ
            // ถ้าไม่พบผู้ดูแลระบบจาก web_role ให้ลองค้นหาจากฟิลด์ role
            if (dbAdminEmails.length === 0) {
                const altAdminSnapshot = await admin.firestore()
                    .collection("users")
                    .where("role", "==", "admin")
                    .get();
                const altDbAdminEmails = altAdminSnapshot.docs.map(doc => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.email; }).filter(Boolean);
                adminEmails = [...new Set([...adminEmails, ...altDbAdminEmails])]; // ใช้ Set เพื่อกำจัดค่าซ้ำ
            }
        }
        catch (dbError) {
            // หากมีข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล ให้บันทึกข้อผิดพลาดแต่ยังคงใช้อีเมลที่กำหนดไว้แบบตายตัว
            console.warn(`⚠️ ไม่สามารถดึงข้อมูลผู้ดูแลระบบจากฐานข้อมูลได้: ${dbError}. ใช้อีเมลที่กำหนดไว้แบบตายตัวแทน.`);
        }
        // สร้างตัวเลือกสำหรับอีเมลตามประเภทการแจ้งเตือน
        let emailOptions;
        switch (type) {
            case "new_user_signup":
            case "new_director_signup":
                const userType = userData_final.occupation || "N/A";
                const isDirector = userType === "director" ||
                    userData_final.role === "director" ||
                    userData_final.user_type === "director" ||
                    userData_final.type === "director" ||
                    userData_final.account_type === "director" ||
                    (userData_final.roles && Array.isArray(userData_final.roles) && userData_final.roles.includes("director"));
                emailOptions = {
                    to: adminEmails.join(","),
                    subject: isDirector
                        ? "แจ้งเตือน: 📩 มีการสมัครใหม่จากผู้กำกับ"
                        : "แจ้งเตือน: 📩 มีการสมัครใหม่จากสมาชิก",
                    html: `
            <h2>สวัสดี Admin,</h2>
            <p>มีการสมัครใหม่${isDirector ? 'จากผู้กำกับ' : ''}:</p>
            <ul>
              <li><strong>ชื่อ:</strong> ${userData_final.fullname_th || userData_final.fullname_TH || userData_final.fullname || userData_final.name || "N/A"}</li>
              <li><strong>อีเมล:</strong> ${userData_final.email || userData_final.login_email || "N/A"}</li>
              <li><strong>ประเภท:</strong> ${userType}</li>
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
        // Log all admin emails that will receive the notification
        console.log(`📧 Sending email to: ${emailOptions.to}`);
        // Convert comma-separated emails to array for individual sending
        const emailList = emailOptions.to.split(',').map((email) => email.trim()).filter(Boolean);
        console.log(`📧 Email list (${emailList.length} recipients):`, emailList);
        // Send individual emails to each recipient to ensure delivery
        for (const recipientEmail of emailList) {
            try {
                // ส่งอีเมลแยกให้แต่ละคน
                await transporter.sendMail(Object.assign(Object.assign({ from: `"สมาคมผู้กำกับภาพยนตร์ไทย" <${gmailAddress}>` }, emailOptions), { to: recipientEmail, replyTo: "admin@thaifilmdirectors.com" }));
                console.log(`✅ Email sent successfully to: ${recipientEmail}`);
            }
            catch (emailError) {
                console.error(`❌ Failed to send email to ${recipientEmail}:`, emailError);
                // Continue with other recipients even if one fails
            }
        }
        console.log(`✅ ส่งอีเมลสำเร็จ: ${type} -> ${emailOptions.to}`);
        return { success: true };
    }
    catch (error) {
        console.error("❌ sendEmailNotificationHelper error:", error);
        // Enhance error with more context
        const enhancedError = error instanceof Error
            ? new Error(`Email notification failed (${type}): ${error.message}`)
            : new Error(`Email notification failed (${type}): ${String(error)}`);
        throw enhancedError;
    }
}
// ฟังก์ชัน Cloud Function ที่ทริกเกอร์เมื่อมีผู้ใช้ใหม่
exports.onNewUserSignup = functions
    .region("asia-southeast1")
    .firestore.document("users/{userId}")
    .onCreate(async (snapshot, context) => {
    const userId = context.params.userId;
    try {
        const userData = snapshot.data();
        console.log(`📝 New user created: ${userId}`);
        // ตรวจสอบว่าผู้ใช้เป็น director หรือไม่
        const isDirector = userData.occupation === "director" ||
            userData.role === "director" ||
            userData.user_type === "director" ||
            userData.type === "director" ||
            userData.account_type === "director" ||
            (userData.roles && Array.isArray(userData.roles) && userData.roles.includes("director"));
        console.log(`📝 User type: ${userData.occupation || "unknown"}, Is director? ${isDirector ? "YES" : "NO"}`);
        // ส่งอีเมลแจ้งเตือนผู้ดูแลระบบสำหรับทุกการสมัคร
        console.log(`📝 Sending email notification for new user: ${userId}`);
        await sendEmailNotificationHelper("new_user_signup", userId, userData);
        console.log(`✅ Email notification sent for new user: ${userId}`);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error in onNewDirectorSignup for user ${userId}: ${errorMessage}`, error);
    }
    return null;
});
// ฟังก์ชัน Cloud Function ที่ทริกเกอร์เมื่อมีการอัปเดตสถานะของผู้กำกับ
exports.onDirectorStatusChange = functions
    .region("asia-southeast1")
    .firestore.document("users/{userId}")
    .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    try {
        const before = change.before.data();
        const after = change.after.data();
        // ตรวจสอบว่าผู้ใช้เป็น director หรือไม่
        const isDirector = after.occupation === "director" ||
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
            }
            else if (afterStatus === "rejected") {
                console.log(`📝 Sending rejection email for director: ${userId}`);
                await sendEmailNotificationHelper("director_rejected", userId, after);
                console.log(`✅ Rejection email sent for director: ${userId}`);
            }
            else {
                console.log(`📝 Status changed to ${afterStatus}, no email sent`);
            }
        }
        else {
            console.log(`📝 Not sending email - conditions not met: isDirector=${isDirector}, statusChanged=${statusChanged}`);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Error in onDirectorStatusChange for user ${userId}: ${errorMessage}`, error);
    }
    return null;
});
// สำหรับเรียกจาก client ถ้าต้องการส่งอีเมลโดยตรง
exports.sendEmailNotification = functions
    .region("asia-southeast1")
    .https.onCall(async (data, context) => {
    try {
        return await sendEmailNotificationHelper(data.type, data.userId);
    }
    catch (error) {
        console.error(`❌ Error in sendEmailNotification: ${error}`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new functions.https.HttpsError('internal', errorMessage);
    }
});
//# sourceMappingURL=index.js.map