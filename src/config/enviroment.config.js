
import dotenv from "dotenv";

dotenv.config();

export const ENVIROMENT = {
    PORT: process.env.PORT, 
    DB_URL: process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GMAIL_PASS: process.env.GMAIL_PASS,
    GMAIL_USER: process.env.GMAIL_USER,
    URL_FRONT: process.env.URL_FRONT,  
    API_KEY_INTERN: process.env.API_KEY_INTERN,
    URL_BACK: process.env.URL_BACK


};

export default ENVIROMENT;