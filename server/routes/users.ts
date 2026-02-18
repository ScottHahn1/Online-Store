import { Response, Router } from "express";
import pool from "../database";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import authenticateToken, { CustomRequest } from "../middlewares/authToken";
import { RowDataPacket } from "mysql2";

const usersRouter = Router();
const salt = 10;

usersRouter.post('/register', async (req, res) => {
    const sql = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Email, username and password are required.' });
    }

    try {
        const hash = await bcrypt.hash(password, salt);
        const [result] = await pool.promise().query<RowDataPacket[]>(sql, [email, username, hash]);
        return res.status(201).json({ registered: true, result });
    } catch (error: any) {
        if (error.code === "ER_DUP_ENTRY") {
            if (error.sqlMessage.endsWith("'users.email'")) {
                return res.status(400).json({ message: "Email already exists" });
            } else if (error.sqlMessage.endsWith("'users.username'")) {
                return res.status(400).json({ message: "Username already exists" });
            }
        }
        return res.status(500).json({ error: "Internal server error" });
    }
})

usersRouter.post('/login', async (req, res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND username = ?";
    const { email, username, password } = req.body;

    try {
        const [result] = await pool.promise().query<RowDataPacket[]>(sql, [email, username]);

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, response) => {
                if (err) {
                    return res.status(500).json({ message: "Error logging in" });
                }

                if (response) {
                    const userId = result[0].userId;

                    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
                    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });

                    res.cookie("refreshToken", refreshToken,
                        {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                            maxAge: 7 * 24 * 60 * 60 * 1000
                        }
                    );
                    return res.status(200).json({
                        success: true,
                        login: true,
                        message: "Login Successful!",
                        token: accessToken,
                        email: email,
                        userId,
                        username,
                    });
                } else {
                    return res.status(401).json({ success: false, message: "Incorrect password" });
                }
            })
        } else {
            return res.status(401).json({ success: false, message: "Invalid Email/Username" });
        }
    } catch {
        return res.status(500).json({ message: "Internal server error" });
    }
})

usersRouter.post('/refresh-token', (req: CustomRequest, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided.' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token.' });
        }

        const newAccessToken = jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });

        res.json({ accessToken: newAccessToken, message: 'New access token issued' });
    });
});

usersRouter.get('/me', authenticateToken, async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required." });
    }

    const sql = "SELECT email, userId, username FROM users WHERE userId = ?";
    const { userId } = req.user;

    try {
        const [rows] = await pool.promise().query<RowDataPacket[]>(sql, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(rows[0]);
    } catch {
        res.status(500).json({ error: "Internal server error!" });
    }
})

usersRouter.post('/logout', (req, res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.REACT_APP_NODE_ENV === 'production',
        sameSite: process.env.REACT_APP_NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.REACT_APP_NODE_ENV === 'production',
        sameSite: process.env.REACT_APP_NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

export default usersRouter;