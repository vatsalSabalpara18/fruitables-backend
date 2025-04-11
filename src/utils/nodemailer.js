
const nodemailer = require('nodemailer');


const sendMail = async (email, title, message) => {
    try {

        var transporter = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'vatsalsabalpara18@gmail.com',
                pass: 'jxlx eamn fiba ckty'
            },

            tls: {
                rejectUnauthorized: false
            }

        });

        var mailOptions = {
            from: 'vatsalsabalpara18@gmail.com',
            to: email,
            subject: title,
            text: message
        };
        
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;