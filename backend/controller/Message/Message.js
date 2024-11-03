const sendEmail = require('./../../helper/Mail')

const MessageController = async (req, res) => {
    try {
        const { Name, Phone, Email, Message } = req.body;

        const message = `Name: ${Name}\nPhone: ${Phone}\nEmail: ${Email}\nMessage: ${Message}`;
        
        // Send email notifications
        await sendEmail(Email, 'Enquiry', 'Your Enquiry has been received. We will get back to you soon.');
        await sendEmail('sriramakrishnasikshaniketan@gmail.com', 'Enquiry', message); 

        res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (err) {
        console.error('Error in MessageController:', err); 
        res.status(500).json({ success: false, message: 'An error occurred while sending the message', error: err.message });
    }
}

module.exports = MessageController;
