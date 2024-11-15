import { Router } from "express";
import pool from "../database";
import authenticateToken from "../middlewares/authToken";

const cartRouter = Router();

cartRouter.get('/', authenticateToken, (req, res) => {
  const userId: number = parseInt(req.query.userId as string);
  const sql = 'SELECT productId, title, price, image, COUNT(*) AS count FROM cart WHERE userId = ? GROUP BY productId, title, price, image';

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      console.log(err);
      return;
    }

    connection.query(sql, [userId], (err: any, rows: any) => {
      if (err) {
        console.log(err);
        return;
      }
   
      res.send(rows);

      connection.release();
    });
  });
});

cartRouter.post('/add', authenticateToken, (req, res) => {
  const { userId, productId, title, brand, price, overview, image, rating, ratingCount } = req.body;
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

cartRouter.delete('/delete/:userId/:productId', authenticateToken, (req, res) => {
  const { userId, productId } = req.params;
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
        data: rows
      })

      connection.release();
    })
  })
});

export default cartRouter;