import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import ENVIRONMENT from '../config/environment.config.js';
import { sendEmail } from '../utils/mail.util.js';
import ResponseBuilder from '../utils/Builders/responseBuilder.js';

// Registrar un nuevo usuario
export const handleRegister = async (req, res) => {
try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage("Bad request")
            .setPayload({ detail: "All fields are required!" })
            .build();
        return res.status(400).json(response);
    }

    // Verificar si el usuario ya está registrado
    const existentUser = await User.findOne({ email });

    if (existentUser) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage("Bad request")
            .setPayload({ detail: "Email is already registered!" })
            .build();
        return res.status(400).json(response);
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = jwt.sign(
        { email },
        ENVIRONMENT.JWT_SECRET, 
        { expiresIn: "1d" }
    );

    const url_verification = `${ENVIRONMENT.URL_FRONT}/api/auth/verify/${verificationToken}`;

    // Enviar email de verificación
    await sendEmail({
        to: email,
        subject: "Verify your email",
        html: `
            <h1>Verify your email</h1>
            <p>Click the button below to verify your email</p>
            <a 
                style="background-color: green; color: white; padding: 5px; border-radius: 5px;"
                href="${url_verification}"
            >Verify!</a>
        `,
    });

    // Guardar usuario en la base de datos
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        emailVerified: false,
    });

    await newUser.save();

    const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(201)
        .setMessage("User created")
        .setPayload({ user: { name, email } })
        .build();
    return res.status(201).json(response);

} catch (error) {
    console.error("Error registering user:", error);

    if (error.code === 11000) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(400)
            .setMessage("Bad request")
            .setPayload({ detail: "Email is already registered!" })
            .build();
        return res.status(400).json(response);
    }

    const response = new ResponseBuilder()
        .setOk(false)
        .setStatus(500)
        .setMessage("Internal server error")
        .setPayload({ detail: error.message })
        .build();
    return res.status(500).json(response);
}
}

// Controlador de verificación de email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params; // Obtiene el token de la URL
        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET); 

        // Busca al usuario en la base de datos
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.redirect(`${ENVIRONMENT.URL_FRONT}/verification-failed`); // Redirige en caso de error
        }

        if (user.emailVerified) {
            return res.redirect(`${ENVIRONMENT.URL_FRONT}/already-verified`);
        }

        // Actualiza el estado del usuario
        user.emailVerified = true;
        user.verificationToken = null; // Elimina el token después de verificar
        await user.save();

        return res.redirect(`${ENVIRONMENT.URL_FRONT}/verification-success`); // Redirige en caso de éxito
    } catch (error) {
        return res.redirect(`${ENVIRONMENT.URL_FRONT}/verification-failed`);
    }
};


// Controlador de login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!user.emailVerified) {
            return res.status(403).json({ message: 'Email no verificado', detail: 'Por favor, verifica tu email' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas', detail: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, ENVIRONMENT.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ message: 'Login exitoso', payload: { token, user: { id: user._id, name: user.name, email: user.email } } });
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', detail: error.message });
    }
};

// Controlador de forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required', detail: 'Please provide a valid email address' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found', detail: 'No registered user with this email' });
        }
        const resetToken = jwt.sign({ email: user.email }, ENVIRONMENT.JWT_SECRET, { expiresIn: '1h' });
        user.resetToken = resetToken;
        await user.save();
        const resetUrl = `${ENVIRONMENT.URL_FRONT}/reset-password/${resetToken}`;
        await sendEmail({ to: user.email, subject: 'Password Reset', html: `<a href='${resetUrl}'>Reset Password</a>` });
        return res.status(200).json({ message: 'Email sent successfully', detail: 'Email sent successfully.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};

// Controlador de reset password
export const resetTokenController = async (req, res) => {
    try {
        const { password } = req.body;
        const { reset_token } = req.params;
        if (!password) {
            return res.status(400).json({ message: 'New password is required', detail: 'Missing new password' });
        }
        if (!reset_token) {
            return res.status(400).json({ message: 'Wrong token', detail: 'Reset token not found' });
        }
        const decoded = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: 'Wrong token', detail: 'Invalid token' });
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', detail: 'User not found' });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password reset successfully', detail: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', detail: error.message });
    }
};
