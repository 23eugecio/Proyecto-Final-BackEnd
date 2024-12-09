import transporter from "../config/transporter.config.js";

export const sendEmail = async (options) => {
    try {
        let response = await transporter.sendMail(options);
        return response;
    } catch (error) {
        console.error('Error al enviar el correo electrónico: ', error);
        throw error;
    }
};


export const sendLoginEmail = async (userEmail) => {
    const mailOptions = {
        html: 'Hello from WhatsApp',  
        subject: 'We are testing the connection', 
        to: userEmail  
    };

    try {
        const response = await sendEmail(mailOptions);
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending Login Email:', error);
    }
};

const simulateLogin = async () => {
    const userEmail = 'mariaeugeniaciotti8@gmail.com';  
    await sendLoginEmail(userEmail);
};


simulateLogin();

export default sendEmail 
