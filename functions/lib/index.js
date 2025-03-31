"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailNotification = exports.onDirectorStatusChange = exports.onNewDirectorSignup = void 0;
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
// ✅ ฟังก์ชันกลางสำหรับส่งอีเมล
async function sendEmailNotificationHelper(type, userId) {
    try {
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists)
            throw new Error("ไม่พบผู้ใช้");
        const userData = userDoc.data() || {};
        const adminSnapshot = await admin.firestore()
            .collection("users")
            .where("web_role", "==", "admin")
            .get();
        const adminEmails = adminSnapshot.docs.map(doc => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.email; }).filter(Boolean);
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
        await transporter.sendMail(Object.assign(Object.assign({ from: `"สมาคมผู้กำกับภาพยนตร์ไทย" <${gmailAddress}>` }, emailOptions), { replyTo: "admin@thaifilmdirectors.com" }));
        console.log(`✅ ส่งอีเมลสำเร็จ: ${type} -> ${emailOptions.to}`);
        return { success: true };
    }
    catch (error) {
        console.error("❌ sendEmailNotificationHelper error:", error);
        throw error;
    }
}
exports.onNewDirectorSignup = functions
    .region("asia-southeast1")
    .firestore.document("users/{userId}")
    .onCreate(async (snapshot, context) => {
    try {
        const userData = snapshot.data();
        const userId = context.params.userId;
        console.log(`📝 New user created: ${userId}`, JSON.stringify(userData, null, 2));
        // Always send notification for new users to ensure we don't miss any directors
        // This is a temporary measure to debug the issue
        console.log(`📝 Sending email notification for new user: ${userId}`);
        // Get admin users directly here to ensure we have their emails
        const adminSnapshot = await admin.firestore()
            .collection("users")
            .where("web_role", "==", "admin")
            .get();
        console.log(`📝 Found ${adminSnapshot.size} admin users`);
        // Log each admin user for debugging
        adminSnapshot.forEach(doc => {
            console.log(`📝 Admin user: ${doc.id}`, JSON.stringify(doc.data(), null, 2));
        });
        const adminEmails = adminSnapshot.docs
            .map(doc => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.email; })
            .filter(Boolean);
        console.log(`📝 Admin emails: ${adminEmails.join(", ")}`);
        if (adminEmails.length === 0) {
            console.log(`⚠️ No admin emails found, checking for alternative admin fields`);
            // Try alternative admin queries if the first one didn't work
            const altAdminSnapshot = await admin.firestore()
                .collection("users")
                .where("role", "==", "admin")
                .get();
            if (altAdminSnapshot.size > 0) {
                console.log(`📝 Found ${altAdminSnapshot.size} admin users with role field`);
                adminEmails.push(...altAdminSnapshot.docs
                    .map(doc => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.email; })
                    .filter(Boolean));
            }
        }
        if (adminEmails.length === 0) {
            console.error(`❌ No admin emails found, cannot send notification`);
            return null;
        }
        // Check for different possible field names that might indicate a director
        const isDirector = userData.occupation === "director" ||
            userData.role === "director" ||
            userData.user_type === "director" ||
            userData.type === "director" ||
            userData.account_type === "director" ||
            (userData.roles && userData.roles.includes("director"));
        console.log(`📝 Is user a director? ${isDirector ? "YES" : "NO"}`);
        // Send email directly without using the helper function to ensure it works
        if (isDirector) {
            console.log(`📝 Preparing email for new director: ${userId}`);
            const emailOptions = {
                to: adminEmails.join(","),
                subject: "แจ้งเตือน: 📩 มีการสมัครใหม่จากผู้กำกับ",
                html: `
            <h2>สวัสดี Admin,</h2>
            <p>มีการสมัครใหม่จากผู้กำกับ:</p>
            <ul>
              <li><strong>ชื่อ:</strong> ${userData.fullname_th || userData.fullname || userData.name || "N/A"}</li>
              <li><strong>อีเมล:</strong> ${userData.email || "N/A"}</li>
              <li><strong>User ID:</strong> ${userId}</li>
            </ul>
            <p>รายละเอียดผู้ใช้:</p>
            <pre>${JSON.stringify(userData, null, 2)}</pre>
            <a href="https://thaifilmdirectors.com/admin/applications" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">ตรวจสอบการสมัคร</a>
          `
            };
            try {
                await transporter.sendMail(Object.assign(Object.assign({ from: `"สมาคมผู้กำกับภาพยนตร์ไทย" <${gmailAddress}>` }, emailOptions), { replyTo: "admin@thaifilmdirectors.com" }));
                console.log(`✅ Email notification sent for new director: ${userId} to ${adminEmails.join(", ")}`);
            }
            catch (emailError) {
                console.error(`❌ Error sending email: ${emailError}`);
            }
        }
        else {
            console.log(`📝 Not sending email - user is not a director: ${userId}`);
        }
    }
    catch (error) {
        console.error(`❌ Error in onNewDirectorSignup: ${error}`);
    }
    return null;
});
exports.onDirectorStatusChange = functions
    .region("asia-southeast1")
    .firestore.document("users/{userId}")
    .onUpdate(async (change, context) => {
    try {
        const before = change.before.data();
        const after = change.after.data();
        const userId = context.params.userId;
        console.log(`📝 User updated: ${userId}`, { before, after });
        // Check for different possible field names that might indicate a director
        const isDirector = after.occupation === "director" ||
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
            }
            else if (afterStatus === "rejected") {
                console.log(`📝 Sending rejection email for director: ${userId}`);
                await sendEmailNotificationHelper("director_rejected", userId);
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
        console.error(`❌ Error in onDirectorStatusChange: ${error}`);
    }
    return null;
});
// สำหรับเรียกจาก client ถ้าต้องการ
exports.sendEmailNotification = functions
    .region("asia-southeast1")
    .https.onCall(async (data, context) => {
    return await sendEmailNotificationHelper(data.type, data.userId);
});
//# sourceMappingURL=index.js.map