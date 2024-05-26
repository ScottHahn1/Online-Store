import { Router } from "express";
import pool from "../database";

const cartRouter = Router();

cartRouter.get("/", (req, res) => {
  const userId: number = parseInt(req.query.userId as string);
  const sql = "SELECT productId, title, price, image, COUNT(*) AS count FROM cart WHERE userId = ? GROUP BY productId, title, price, image";

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

cartRouter.get("/getSingle", (req, res) => {
  const sql = "SELECT * FROM cart WHERE userId = ? AND productId = ?";

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      console.log(err);
      return;
    }

    connection.query(sql, [req.query.userId, req.query.productId], (err: any, rows: any) => {
      if (err) {
        console.log(err);
        return;
      }

      res.send(rows);

      connection.release();
    });
  });
});

cartRouter.post("/add", (req, res) => {
  const sql = 'INSERT INTO cart (userId, productId, title, brand, price, overview, image, rating, ratingCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const { userId, productId, title, brand, price, overview, image, rating, ratingCount } = req.body;
  
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

cartRouter.delete("/delete/:userId/:productId", (req, res) => {
  const sql = 'DELETE FROM cart WHERE userId = ? AND productId = ?';
  const { userId, productId } = req.params;

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