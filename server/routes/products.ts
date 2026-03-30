import { Router } from "express";
import pool from "../database";
import { RowDataPacket } from "mysql2";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const { categoryId, sortBy } = req.query;
  const page = parseInt(req.query.page as string);
  const limit = 50;
  const offset = (page - 1) * limit;

  let sql: string;

  if (!categoryId) {
    if (sortBy === "title") {
      sql = `SELECT * FROM products ORDER BY ${sortBy} ASC, productId LIMIT ? OFFSET ?`;
    } else {
      sql = `SELECT * FROM products ORDER BY ${sortBy} DESC, productId LIMIT ? OFFSET ?`;
    }
  } else {
    if (sortBy === "title") {
      sql = `SELECT p.*
FROM products p
              JOIN product_categories pc ON p.productId = pc.product_id
WHERE pc.category_id = ?
ORDER BY ${sortBy} ASC
LIMIT ? OFFSET ?
`;
    } else {
      sql = `SELECT p.*
FROM products p
              JOIN product_categories pc ON p.productId = pc.product_id
WHERE pc.category_id = ?
ORDER BY ${sortBy} DESC, p.productId ASC
LIMIT ? OFFSET ?
`;
    }
  }

  try {
    const sqlQueryParams = categoryId ? [categoryId, limit, offset] : [limit, offset];
    const [rows] = await pool.promise().query(sql, sqlQueryParams);
    res.status(200).json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

productsRouter.get("/total", async (req, res) => {
  const { categoryId } = req.query;

  let sql: string;

  if (categoryId) {
    sql = `SELECT COUNT(*) AS count
FROM products p
            JOIN product_categories pc ON p.productId = pc.product_id
            WHERE pc.category_id = ?
`;
  } else {
    sql = "SELECT COUNT(*) AS count FROM products";
  }

  try {
const sqlQueryParams = categoryId ? [categoryId] : [];
    const [rows] = await pool.promise().query<RowDataPacket[]>(sql, sqlQueryParams);
    res.status(200).json(rows[0]);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

productsRouter.get("/similar", async (req, res) => {
  const { categoryId } = req.query;
  const limit = 8;

  const sql = `SELECT p.*
              FROM products p
              JOIN product_categories pc ON p.productId = pc.product_id
              WHERE pc.category_id = ?
              LIMIT ?
              `

  try {
    const sqlQueryParams = [categoryId, limit];
    const [rows] = await pool.promise().query<RowDataPacket[]>(sql, sqlQueryParams);
    res.status(200).json(rows);
  } catch {
    res.status(500).json({ message: "Internal server error"     });
  }
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