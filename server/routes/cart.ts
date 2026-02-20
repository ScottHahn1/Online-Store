import { Router } from "express";
import pool from "../database";
import authenticateToken, { CustomRequest } from "../middlewares/authToken";
import { RowDataPacket } from "mysql2";

const cartRouter = Router();

cartRouter.get('/', authenticateToken, async (req: CustomRequest, res) => {
    const userId = req.user?.userId;
    const sql = 'SELECT productId, title, price, image, COUNT(*) AS count FROM cart WHERE userId = ? GROUP BY productId, title, price, image';

    try {
        const [rows] = await pool.promise().query<RowDataPacket[]>(sql, [userId]);
        return res.status(200).json(rows);
    } catch {
        res.status(500).json({ message: "Failed to fetch cart items" });
    }
});

cartRouter.post('/add', authenticateToken, (req: CustomRequest, res) => {
    const userId = req.user?.userId;
    const { productId, title, brand, price, overview, image, rating, ratingCount } = req.body;
    const sql = 'INSERT INTO cart (userId, productId, title, brand, price, overview, image, rating, ratingCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    if (userId) {
        pool.getConnection((err: any, connection: any) => {
            if (err) {
                console.log(err);
                return;
            }

            connection.query(sql, [userId, productId, title, brand, price, overview, image, rating, ratingCount], (err: any, rows: any) => {
                if (err) {
                    console.log(err);
                    return;
                }

                res.send({
                    data: rows
                })

                connection.release();
            })
        })
    }
});

cartRouter.delete('/delete/:productId', authenticateToken, (req: CustomRequest, res) => {
    const userId = req.user?.userId;
    const { productId } = req.params;
    const sql = 'DELETE FROM cart WHERE userId = ? AND productId = ?';

    pool.getConnection((err: any, connection: any) => {
        if (err) {
            console.log(err);
            return;
        }

        connection.query(sql, [userId, productId], (err: any, rows: any) => {
            if (err) {
                console.log(err);
                return;
            }

            res.send({
                data: rows,
            });

            connection.release();
        });
    });
});

export default cartRouter;