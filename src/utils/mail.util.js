import transporter from "../config/transporter.config.js";

// envio de emails
const sendEmail = async (options) => {
    try {
        let response = await transporter.sendMail(options);
        return response
    } catch (error) {
        console.error('Error to send email: ', error);
        throw error;
    }
};
export { sendEmail }


