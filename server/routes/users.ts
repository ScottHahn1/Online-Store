import { Router } from "express";
import pool from "../database";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const salt = 10;

const usersRouter = Router();

//register 
usersRouter.post('/register', (req, res) => {
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const { username, password } = req.body;
    
    bcrypt.hash(password, salt, (err: any, hash: any) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            pool.query(sql, [username, hash], (err: any, result: any) => {
                if (err) {
                    return res.send(err)
                }
                return res.json({ registered: true, result });
            })
        }
    })
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