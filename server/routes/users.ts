import { Response, Router } from "express";
import pool from "../database";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";
import authenticateToken from "../middlewares/authToken";
import { Request } from "express";

const usersRouter = Router();
const salt = 10;

usersRouter.post('/register', async (req, res) => {
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const hash = await bcrypt.hash(password, salt);

        pool.query(sql, [username, hash], (error, result) => {
            if (error) {
                res.status(500).json({ error: 'Internal server error!' });
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
                    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '1h' });
                    res.cookie('authToken', token,
                        { 
                            httpOnly: true, 
                            secure: process.env.REACT_APP_NODE_ENV === 'production', // check if app is in production or development
                            sameSite: process.env.REACT_APP_NODE_ENV === 'production' ? 'strict' : 'lax',
                            maxAge: 1 * 60 * 60 * 1000 // 1 hour
                        }
                    );
                    return res.status(200).json({ success: true, login: true, message: 'Login Successful!', token, userId, username });
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

usersRouter.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.REACT_APP_NODE_ENV === 'production',
    sameSite: process.env.REACT_APP_NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default usersRouter;