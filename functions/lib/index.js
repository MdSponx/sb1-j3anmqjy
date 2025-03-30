"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailNotification = void 0;
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
exports.sendEmailNotification = functions
    .region("asia-southeast1")
    .https.onCall(async (data, context) => {
    try {
        const { type, userId } = data;
        // ดึงข้อมูลผู้ใช้
        const userDoc = await admin.firestore().collection("users").doc(userId).get();
        if (!userDoc.exists)
            throw new Error("ไม่พบผู้ใช้");
        const userData = userDoc.data() || {};
        // ดึงข้อมูลผู้ดูแลระบบ
        const adminSnapshot = await admin.firestore()
            .collection("users")
            .where("web_role", "==", "admin")
            .get();
        const adminEmails = adminSnapshot.docs.map((doc) => { var _a; return (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.email; }).filter(Boolean);
        let emailOptions;
        switch (type) {
            case "new_director_signup":
                emailOptions = {
                    to: adminEmails.join(","),
                    subject: "แจ้งเตือน: 📩 มีการสมัครใหม่จากผู้กำกับ",
                    html: `
              <h2>สวัสดี Admin,</h2>
              <p>มีการสมัครใหม่จากผู้กำกับที่ต้องการการตรวจสอบรายละเอียดดังนี้:</p>
              <ul>
                <li><strong>ชื่อ:</strong> ${userData.fullname_th || "N/A"}</li>
                <li><strong>อีเมล:</strong> ${userData.email || "N/A"}</li>
              </ul>
              <p>กรุณาตรวจสอบและดำเนินการตามความเหมาะสม โดยสามารถดูรายละเอียดเพิ่มเติมและจัดการการสมัครได้ที่ลิงก์ด้านล่าง:</p>
              <a href="https://thaifilmdirectors.com/admin/applications" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">จัดการการสมัคร</a>
              <p>ขอขอบคุณสำหรับความร่วมมือของคุณ</p>
              <p>ขอแสดงความนับถือ,</p>
              <p>ระบบแจ้งเตือนอัตโนมัติ</p>
            `
                };
                break;
            case "director_approved":
                emailOptions = {
                    to: userData.email || "",
                    subject: "ยินดีด้วย! 🎉 การสมัครของคุณได้รับการอนุมัติแล้ว",
                    html: `
              <h2>สวัสดีคุณ ${userData.fullname_th || "ผู้ใช้"},</h2>
              <p>ขอแสดงความยินดีด้วย! 🎬 การสมัครเป็นผู้กำกับของคุณได้รับการอนุมัติเรียบร้อยแล้ว ตอนนี้คุณสามารถเข้าถึงฟีเจอร์ต่าง ๆ สำหรับผู้กำกับบนแพลตฟอร์มของเราได้</p>
              <p>กรุณาอัปเดตโปรไฟล์ของคุณเพื่อให้ข้อมูลของคุณสมบูรณ์และแสดงต่อสาธารณะได้ที่ลิงก์ด้านล่าง:</p>
              <a href="https://thaifilmdirectors.com/edit-profile" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">อัปเดตโปรไฟล์ของคุณ</a>
              <p>หากคุณมีคำถามหรือข้อสงสัยเพิ่มเติม สามารถติดต่อเราที่ <a href="mailto:contact@thaifilmdirectors.com">contact@thaifilmdirectors.com</a></p>
              <p>ขอแสดงความนับถือ,</p>
              <p>สมาคมผู้กำกับภาพยนตร์ไทย</p>
            `
                };
                break;
            case "director_rejected":
                emailOptions = {
                    to: userData.email || "",
                    subject: "แจ้งสถานะการสมัครของคุณ",
                    html: `
              <h2>สวัสดีคุณ ${userData.fullname_th || "ผู้ใช้"},</h2>
              <p>เราขอแจ้งให้คุณทราบว่า การสมัครเป็นผู้กำกับของคุณไม่ผ่านการอนุมัติในขณะนี้</p>
              <p>หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติม กรุณาติดต่อเราที่:</p>
              <a href="mailto:contact@thaifilmdirectors.com" style="padding:10px 20px; background:#EF4444; color:#fff; text-decoration:none; border-radius:5px;">ติดต่อเรา</a>
              <p>ขอแสดงความนับถือ,</p>
              <p>สมาคมผู้กำกับภาพยนตร์ไทย</p>
            `
                };
                break;
            default:
                throw new Error("ประเภทการแจ้งเตือนไม่ถูกต้อง");
        }
        // ส่งอีเมล
        await transporter.sendMail(Object.assign({ from: '"สมาคมผู้กำกับภาพยนตร์ไทย" <admin@thaifilmdirectors.com>' }, emailOptions));
        return { success: true };
    }
    catch (error) {
        console.error("เกิดข้อผิดพลาดในการส่งอีเมลแจ้งเตือน:", error);
        throw new functions.https.HttpsError("internal", "ไม่สามารถส่งอีเมลแจ้งเตือนได้", error);
    }
});
//# sourceMappingURL=index.js.map