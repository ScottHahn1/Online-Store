import { Response, Router } from "express";
import pool from "../database";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import authenticateToken, { CustomRequest } from "../middlewares/authToken";

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

        pool.query(sql, [email, username, hash], (error, result) => {
            if (error && error.code === 'ER_DUP_ENTRY') {
                if (error.message.includes('@email')) {
return                 res.status(400).json({ error: 'Email already exists' })
                } else if (error.message.includes('username')) {
                    return res.status(400).json({ error: 'Username already exists' });
}
            } else {
                return res.status(201).json({ registered: true, result })
            }
        })
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error!' });
    }
})

usersRouter.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE username = ?';
    const { username, password } = req.body;

    pool.query(sql, [username], (err: any, result: any) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error!' })
        }

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err: any, response: any) => {
                if (err) {
                    return res.status(500).json('Error logging in');
                }

                if (response) {
                    const userId = result[0].userId;

                    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });
                    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });

                    res.cookie('refreshToken', refreshToken,
                        { 
                            httpOnly: true, 
                            secure: process.env.REACT_APP_NODE_ENV === 'production',
                            sameSite: process.env.REACT_APP_NODE_ENV === 'production' ? 'none' : 'lax',
                            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                        }
                    );
                    return res.status(200).json({ success: true, login: true, message: 'Login Successful!', token: accessToken, userId, username });
                } else {
                    return res.status(401).json({ success: false, message: 'Invalid username or password' });
                }
            })
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

    })
})

interface CustomJwtPayload extends JwtPayload {
    userId: number;
    username: string;
}

interface CustomRequest extends Request {
    user?: CustomJwtPayload;
}

usersRouter.get('/me', authenticateToken, (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    const sql = 'SELECT userId, username FROM users WHERE userId = ?';
    const { userId } = req.user;

    pool.query(sql, [userId], (error, result: any) => {
        if (error) {
            res.status(500).json({ error: 'Internal server error!' });
        } 

        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(result[0]);
    });
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

        const newAccessToken = jwt.sign({ userId: user.userId}, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.REACT_APP_NODE_ENV === 'production',
            sameSite: process.env.REACT_APP_NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.json({ message: 'New access token issued'});
    });
});

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