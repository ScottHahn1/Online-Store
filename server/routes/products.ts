import { Router } from "express";
import pool from "../database";
import { RowDataPacket } from "mysql2";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const { category, sortBy } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = 50;
  const offset = (page - 1) * limit;

  let sql: string;

  if (!category) {
    if (sortBy === 'title') {
      sql = `SELECT * FROM products ORDER BY ${sortBy} ASC, productId LIMIT ? OFFSET ?`;
    } else {
      sql = `SELECT * FROM products ORDER BY ${sortBy} DESC, productId LIMIT ? OFFSET ?`;
    }
  } else {
    if (sortBy === 'title') {
      sql = `SELECT * FROM products WHERE category->"$.name" = ? ORDER BY ${sortBy} ASC, productId LIMIT ? OFFSET ?`;
    } else {
      sql = `SELECT * FROM products WHERE category->"$.name" = ? ORDER BY ${sortBy} DESC, productId LIMIT ? OFFSET ?`;
    }
  }

  try {
    const sqlQueryParams = category ? [category, limit, offset] : [limit, offset];
    const [rows] = await pool.promise().query(sql, sqlQueryParams);
    res.status(200).json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

productsRouter.get("/total", async (req, res) => {
  const { category } = req.query;

  let sql: string;

  if (category) {
    sql = `SELECT COUNT(*) AS count FROM products WHERE category->"$.name" = "${category}"`;
  } else {
    sql = "SELECT COUNT(*) AS count FROM products";
  }

  try {
    const [rows] = await pool.promise().query<RowDataPacket[]>(sql, []);
    res.status(200).json(rows[0]);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

productsRouter.get("/similar", (req, res) => {
  const { productId, category } = req.query;
  const sql = `SELECT DISTINCT productId, title, image, price FROM products WHERE category->"$.name" = "${category}" AND NOT productId = ${productId}`;

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      console.log(err);
      return;
    }

    connection.query(sql, [], (err: any, rows: any) => {
      if (err) {
        console.log(err);
        return;
      }

      res.send(rows);

      connection.release();
    });
  });
});

productsRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM products WHERE productId = ${id}`;

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      console.log(err);
      return;
    }

    connection.query(sql, [], (err: any, rows: any) => {
      if (err) {
        console.log(err);
        return;
      }

      res.send(rows[0]);

      connection.release();
    });
  });
});

export default productsRouter;