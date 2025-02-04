import express from 'express';
import ENVIRONMENT from './config/environment.config.js';
import configDb from "./db/config.js";
import cors from 'cors';

import authRouter from './routes/auth.router.js';
import contactRouter from './routes/contact.router.js';
import messageRouter from './routes/message.router.js';
import statusRouter from './routes/status.router.js';

const app = express();

// Configurar CORS
app.use(cors());

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas (sin autenticación)
app.use('/api/auth', authRouter);
app.use('/api/auth/verify/:token', authRouter);
// Rutas protegidas (requiere autenticación)
app.use('/api/contacts', contactRouter);
app.use('/api/messages', messageRouter);
app.use('/api/contacts/:contact_id', contactRouter);
app.use('/api/messages/:message_id', messageRouter);

app.use('/api/status', statusRouter);

app.listen(ENVIRONMENT.PORT, () => {
    console.log(`Server is running on port ${ENVIRONMENT.PORT}`);
});



