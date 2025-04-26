
// const nodemailer = require('nodemailer');
const { Resend } = require('resend');

// const sendMail = async (email, title, message) => {
//     try {

//         var transporter = await nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'vatsalsabalpara18@gmail.com',
//                 pass: 'jxlx eamn fiba ckty'
//             },

//             tls: {
//                 rejectUnauthorized: false
//             }

//         });

//         var mailOptions = {
//             from: 'vatsalsabalpara18@gmail.com',
//             to: email,
//             subject: title,
//             text: message
//         };
        
//         await transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log('Email sent: ' + info.response);
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// }

const sendMail = async (email, title, message) => {
    try {        
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: title,
            html: `<p>${message}</p>`
        });
        return true;
    } catch (error) {
        throw new Error("Error in Sending Email", error.message);
    }
}

module.exports = sendMail;