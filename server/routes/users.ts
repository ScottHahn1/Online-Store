import { Router } from "express";
import pool from "../database";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const usersRouter = Router();
const salt = 10;

//register 
usersRouter.post('/register', async (req, res) => {
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const { username, password } = req.body;

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

//login
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
                    return res.status(200).json('Error logging in');
                }

                if (response) {
                    const userId = result[0].userId;
                    const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 3600 });
                    return res.status(200).json({ success: true, login: true, token, userId, username });
                } else {
                    return res.status(401).json({ success: false, message: 'Invalid username or password' });
                }
            })
        } else {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

    })
})

export default usersRouter;