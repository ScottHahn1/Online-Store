import { Router } from "express";
import pool from "../database";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const salt = 10;

const usersRouter = Router();

// get user by username
usersRouter.get('/:username', async (req, res) => {
    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.log(err);
            res.send({
                success: false,
                statusCode: 500,
                message: 'Error encountered during connection'
            })
            return;
        }
        connection.query('SELECT * FROM users WHERE username=?', [req.params.username], (err: any, rows: any) => {
            if (err) {
                connection.release();
                return res.send({
                    success: false,
                    statusCode: 400
                })
            }

            res.send({
                message: 'Success',
                statusCode: 200,
                data: rows[0]
            })

            connection.release();
        })
    }) 
})

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
            return res.json({ Message: 'ERROR in Node' })
        }

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err: any, response: any) => {
                if (err) {
                    console.log('Error');
                    return res.json('Error logging in');
                }

                if (response) {
                    const id = result[0].userId;
                    const token = jwt.sign({ id }, 'jwtSecretKey', { expiresIn: 3600 });
                    return res.json({ login: true, token, result, id, username });
                } else {
                    return res.json('Error logging in. Please make sure your username/password combination is correct.');
                }
            })
        } else {
            return res.json('Error logging in. Please make sure your username/password combination is correct.');
        }

    })
})

export default usersRouter;