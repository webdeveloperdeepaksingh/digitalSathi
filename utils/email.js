const nodemailer = require('nodemailer');

const sendEmail = async (option) => {
//Using transporter service to send email.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })
//Defining email options
    const emailOptions = {
        from: 'support@cineflix.com',
        to: option.email,
        subject: option.subject,
        text:option.message
    }
    await transporter.sendMail(emailOptions);
}
export default sendEmail; 