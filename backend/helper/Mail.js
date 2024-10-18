const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'sandiptoiitjee@gmail.com', 
        pass: 'oqjm gfih iigv txlj' 
    }
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'sandiptoiitjee@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendEmail;