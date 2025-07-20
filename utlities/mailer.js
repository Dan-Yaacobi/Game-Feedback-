require('dotenv').config();
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth:{
        user: process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
})

async function sendEmail(to, subject, text){
    const mailOptions = {
        from: `Game Feedback Bot: <${process.env.SMTP_USER}>`,
        to,
        subject,
        text
    }
    try{
    const info = await transporter.sendMail(mailOptions)
    return info
    }
    catch(error){
        console.error("Error: ", error.message)
    }
}

module.exports = sendEmail