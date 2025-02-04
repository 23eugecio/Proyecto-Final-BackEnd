import nodemailer from 'nodemailer';
import environment from './environment.config.js';



const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: environment.GMAIL_USER,
            pass: environment.GMAIL_PASS
        }
    });
    
    export default transporter