import nodemailer from 'nodemailer';
import ENVIROMENT from './enviroment.config.js';



const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: ENVIROMENT.GMAIL_USER,
            pass: ENVIROMENT.GMAIL_PASS
        }
    });
    
    export default transporter