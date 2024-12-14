import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV, { ENVIROMENT } from "../config/enviroment.config.js";
import User from "../models/user.model.js";
import UserRepository from "../repositories/user.repository.js";
import ResponseBuilder from "../utils/builders/responseBuilder.js";
import { sendEmail } from "../utils/mail.util.js";
import { responseBuilder } from "../utils/builders/responseBuilder.js";

export const registerUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existsUser = await UserRepository.getByEmail(email);

        if (existsUser) {
            return res.status(400).json(responseBuilder(false, 400, "BAD_REQUEST", { detail: "The email is used by another user" }));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = jwt.sign({ email: email }, ENV.JWT_SECRET, {
            expiresIn: ENV.JWT_TIME,
        });

        const url_verification = `http://localhost:${ENVIROMENT.PORT}/api/auth/verify/${verificationToken}`;

        const sentEmail = await sendEmail({
            to: email,
            subject: "Valida tu correo electronico",
            html: `
        <h1>Verificacion de correo electronico</h1>
        <p>Da click en el boton de abajo para verificar</p>
        <a 
            style='background-color: 'black'; color: 'white'; padding: 5px; border-radius: 5px;'
            href="${url_verification}"
        >Click aqui</a>
        `,
        });

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
        });

        await newUser.save();

        return res.status(201).json(responseBuilder(true, 201, "SUCCESS", { detail: newUser, message: "User created" }));
    } catch (err) {
        return res.status(400).json(responseBuilder(false, 400, "SERVER_ERROR", { detail: "Server error", error: err.message }));
    }
};

export const verifyMailValidationTokenController = async (req, res) => {
    try {
        const { verification_token } = req.params;

        if (!verification_token) {
            return res.status(400).json(responseBuilder(false, 400, "BAD_REQUEST", { detail: "Invalid verification token" }));
        }

        const decoded = jwt.verify(verification_token, ENV.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });

        if (!user) throw new Error("USER NOT FOUND");

        if (user.emailVerified) throw new Error("EMAIL ALREADY VERIFIED");

        user.emailVerified = true;

        await user.save();

        return res.status(200).json(responseBuilder(true, 200, "SUCCESS", { message: "Email verified successfully" }));
    } catch (err) {
        console.error(err.message);
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(responseBuilder(false, 400, "BAD_REQUEST", { detail: "Email and password are required" }));
        }
        const user = await UserRepository.getByEmail(email);

        if (!user) {
            return res.status(401).json(responseBuilder(false, 401, "USER_NOT_FOUND", { detail: "User is not registrated. Please SIGN UP" }));
        }

        if (!user.emailVerified) {
            return res
                .status(403)
                .json(responseBuilder(false, 403, "USER_NOT_VERIFIED", { detail: "User not verified. Please go to your email to verify your profile" }));
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json(responseBuilder(false, 401, "INVALID_PASSWORD", { detail: "The passwrod is not correct" }));
        }

        const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, ENV.JWT_SECRET, {
            expiresIn: ENV.JWT_TIME,
        });

        res.status(200).json(
            responseBuilder(true, 200, "Logged In", {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            })
        );
    } catch (err) {
        res.status(500).json(responseBuilder(false, 500, "INTERNAL_SERVER_ERROR", { detail: err.message }));
    }
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json(responseBuilder(false, 400, "BAD_REQUEST", { detail: "Email is required" }));
        }
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            return res.status(401).json(responseBuilder(false, 401, "USER_NOT_FOUND", { detail: "User is not registrated. Please SIGN UP" }));
        }

        const resetToken = jwt.sign({ email: user.email }, ENV.JWT_SECRET, {
            expiresIn: "1h",
        });

        const resetUrl = `${ENV.FRONT_URL}/reset-password/${resetToken}`;

        sendEmail({
            to: user.email,
            subject: "Restablish password",
            html: `
    <div>
        <h1>Reset password</h1>
        <p>Click here to reset your password: ${resetUrl}</p>
    </div>`,
        });

        const response = new ResponseBuilder()
            .setOk(true)
            .setStatus(200)
            .setMessage("SUCCESS")
            .setPayload({
                message: "Recovery password sent successfully",
            })
            .build();

        return res.status(200).json(response);
    } catch (err) { }
};

export const resetPasswordController = async (req, res) => {
    const { password } = req.body;
    const { reset_token } = req.params;

    const decoded = jwt.verify(reset_token, ENV.JWT_SECRET);

    if (!decoded) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage("INVALID_TOKEN")
            .setPayload({ detail: "The token is not valid" })
            .build();
        return res.status(401).json(response);
    }

    const user = await UserRepository.getByEmail(decoded.email);

    if (!user) {
        const response = new ResponseBuilder()
            .setOk(false)
            .setStatus(401)
            .setMessage("USER_NOT_FOUND")
            .setPayload({ detail: "User is not registrated. Please REGISTER" })
            .build();

        return res.status(401).json(response);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    const response = new ResponseBuilder()
        .setOk(true)
        .setStatus(200)
        .setMessage("SUCCESS")
        .setPayload({
            message: "Password reset successfully",
        })
        .build();

    res.status(200).json(response);
};