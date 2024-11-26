import transporter from "../config/transporter.config.js"



const sendEmail = async (options) => {
    try{
        let response = await transporter.sendMail(options)
        return response
    }
    catch(error){
        console.error('Error al enviar Email: ', error)
        throw error
    }
}

sendEmail({
    html: 'Hello from WhatsApp',
    subject: 'We are testing the connection',
    to: 'mariaeugeniaciotti8@gmail.com'})

export {sendEmail}