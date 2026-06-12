//package sendgrid


require('dotenv').config();
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { name } = require('ejs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let myCustomMethod = async (ctx) => {
    let cmd = await ctx.sendCommand(
        'AUTH PLAIN ' +
        Buffer.from(
            '\u0000' + ctx.auth.credentials.user + '\u0000' + ctx.auth.credentials.pass,
            'utf-8'
        ).toString('base64')
    );

    if (cmd.status < 200 || cmd.status >= 300) {
        throw new Error('Failed to authenticate user: ' + cmd.text);
    }
}


let sendSimpleEmail = async (dataSend) => {
    try {

        const msg = {
            to: dataSend.receiverEmail,
            from: {
                email: process.env.EMAIL_APP,
                name: "HealthCare Team"
            },
            subject: "Thông tin đặt lịch khám bệnh",
            html: getBodyHTMLEmail(dataSend),
        };

        const result = await sgMail.send(msg);
        console.log("SEND EMAIL TO:", dataSend.receiverEmail);
        console.log("EMAIL SENT RESULT:", result);

        return result;
    } catch (e) {
        console.log("EMAIL ERROR:", e.response?.body || e.message);
        throw e;
    }
};

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
<table width="100%" cellpadding="0" cellspacing="0"
style="
background:#f8fafc;
padding:40px 20px;
font-family:Arial,sans-serif;
">

<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:24px;
padding:50px;
">

<tr>
<td align="center">
 <div style="
 display:inline-block;
 padding:10px 18px;
 background:#ecfdf5;
 color:#059669;
 border-radius:999px;
 font-size:13px;
 font-weight:600;
 ">
 ✓ APPOINTMENT COMPLETED
 </div>



<p style="
color:#6b7280;
font-size:16px;
line-height:28px;
margin-top:20px;
">
Your medical appointment has been successfully scheduled.
</p>

</td>
</tr>

<tr>
<td>

<p style="
font-size:17px;
color:#111827;
margin-top:40px;
">
Xin chào <strong>${dataSend.patientName}</strong>,
</p>

<p style="
color:#4b5563;
line-height:30px;
font-size:16px;
">
Cảm ơn bạn đã sử dụng dịch vụ của HealthCare.
Chúng tôi đã ghi nhận yêu cầu đặt lịch khám của bạn.
Vui lòng xác nhận lịch hẹn để hoàn tất quy trình.
</p>

</td>
</tr>

<tr>
<td>

<div style="
margin:35px 0;
padding:28px;
background:#fafafa;
border:1px solid #e5e7eb;
border-radius:18px;
">

<div style="
font-size:12px;
font-weight:600;
letter-spacing:1px;
color:#9ca3af;
margin-bottom:8px;
">
DOCTOR
</div>

<div style="
font-size:20px;
font-weight:600;
color:#111827;
margin-bottom:24px;
">
👨‍⚕️ ${dataSend.doctorName}
</div>

<div style="
font-size:12px;
font-weight:600;
letter-spacing:1px;
color:#9ca3af;
margin-bottom:8px;
">
APPOINTMENT TIME
</div>

<div style="
font-size:20px;
font-weight:600;
color:#111827;
">
🕒 ${dataSend.time}
</div>

</div>

</td>
</tr>

<tr>
<td align="center">

<a
href="${dataSend.redirectLink}"
target="_blank"
style="
display:inline-block;
background:#111827;
color:white;
padding:16px 32px;
border-radius:999px;
text-decoration:none;
font-size:15px;
font-weight:600;
"
>
Confirm Appointment
</a>

</td>
</tr>


<tr>
<td>

<hr style="
border:none;
border-top:1px solid #f1f5f9;
margin:40px 0;
"/>

<p style="
font-size:14px;
color:#9ca3af;
text-align:center;
margin:0;
">
HealthCare Team
</p>

<p style="
font-size:12px;
color:#c0c4cc;
text-align:center;
margin-top:10px;
">
This is an automated email. Please do not reply.
</p>

</td>
</tr>

</table>

</td>
</tr>

</table>
`;
    }
    if (dataSend.language === 'en') {
        result = result = `
        <h3>Dear, ${dataSend.patientName} !</h3>
        <p>You received this email because you booked an online medical appointment on the booking care website</p>
        <p>Information on making an appointment </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        
        <p>If you have confirmed the above registration information is correct
        Then click on the link below to confirm completion of the appointment booking procedure
        </p>

        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Click here</a>
        </div>

        <div>
        Sincerely thank
        </div>
        `

    }
    return result;
}

let sendAttachment = async (dataSend) => {
    try {
        const msg = {
            to: dataSend.email,
            from: {
                email: process.env.EMAIL_APP,
                name: "Healthcare Team"
            },
            subject: "Thông tin đặt lịch khám bệnh",
            html: getBodyHTMLEmailRemedy(dataSend),
            attachments: [
                {
                    filename: dataSend.fileName,
                    content: dataSend.imgBase64.split("base64,")[1],
                    encoding: 'base64'
                }
            ]
        };

        await sgMail.send(msg);

        console.log("ATTACHMENT EMAIL SENT");
    } catch (e) {
        console.log("ATTACHMENT EMAIL ERROR:", e.response?.body || e.message);
        throw e;
    }
};


let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    console.log('DEBUG EMAIL DATA:', dataSend);
    if (dataSend.language === 'vi') {

        result = `
<table width="100%" cellspacing="0" cellpadding="0" style="background:#f6f9fc;padding:60px 20px;font-family:Inter,Segoe UI,Arial,sans-serif;">
<tr>
<td align="center">

<table width="680" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:32px;overflow:hidden;">

<tr>
<td style="padding:60px 60px 20px;">

<div style="
font-size:12px;
font-weight:600;
letter-spacing:2px;
text-transform:uppercase;
color:#4f46e5;
">
HealthCare
</div>

<h1 style="
margin:16px 0 0;
font-size:42px;
font-weight:700;
line-height:1.2;
color:#111827;
">
Kết quả khám bệnh<br>
đã sẵn sàng.
</h1>

</td>
</tr>

<tr>
<td style="padding:20px 60px 0;">

<p style="
font-size:18px;
line-height:34px;
color:#4b5563;
margin:0;
">
Xin chào <strong>${dataSend.patientName}</strong>,
</p>

<p style="
font-size:18px;
line-height:34px;
color:#4b5563;
margin-top:20px;
">
Bác sĩ đã hoàn tất buổi khám của bạn.
Đơn thuốc và hướng dẫn điều trị được đính kèm trong email này.
</p>

</td>
</tr>

<tr>
<td style="padding:40px 60px;">

<table width="100%" style="
background:#fafafa;
border-radius:20px;
padding:10px;
">

<tr>
<td style="padding:18px 24px;">
<div style="font-size:13px;color:#9ca3af;">
TRẠNG THÁI
</div>
<div style="font-size:18px;color:#111827;font-weight:600;">
Hoàn thành khám bệnh
</div>
</td>
</tr>

<tr>
<td style="padding:18px 24px;">
<div style="font-size:13px;color:#9ca3af;">
EMAIL NHẬN KẾT QUẢ
</div>
<div style="font-size:18px;color:#111827;font-weight:600;">
${dataSend.email}
</div>
</td>
</tr>

</table>

</td>
</tr>

<tr>
<td style="padding:0 60px 60px;">

<p style="
font-size:16px;
line-height:30px;
color:#6b7280;
">
Nếu bạn có thắc mắc về đơn thuốc hoặc cần tư vấn thêm,
hãy liên hệ với bác sĩ hoặc đội ngũ hỗ trợ của HealthCare.
</p>

<p style="
margin-top:40px;
font-size:16px;
color:#111827;
font-weight:600;
">
HealthCare Team
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>


    `;
    }
    if (dataSend.language === 'en') {
        result = result = `
        <h3>Dear, ${dataSend.patientName}!</h3>
        <p>You received this email because you booked an online medical appointment on the booking care website</p>
        
       
        <div>
        Sincerely thank
        </div>
        `

    }
    return result;
}


module.exports = {
    sendSimpleEmail, getBodyHTMLEmail,
    sendAttachment, getBodyHTMLEmailRemedy,
    myCustomMethod: myCustomMethod
}