import { Router } from "express";
import pool from "../database";

const productsRouter = Router();

//all products
productsRouter.get("/", (req, res) => {
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

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      console.log(err);
      return;
    }

    const sqlQueryParams = category ? [category, limit, offset] : [limit, offset];

    connection.query(sql, sqlQueryParams, (err: any, rows: any) => {
      if (err) {
        console.log(err);
        return;
      }

      res.send(rows);
      connection.release();
    });
  });
});

//total amount of products
productsRouter.get("/total", (req, res) => {
  const { category } = req.query;

  let sql: string;

  if (category) {
    sql = `SELECT COUNT(*) AS count FROM products WHERE category->"$.name" = "${category}"`;
  } else {
    sql = "SELECT COUNT(*) AS count FROM products";
  }

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

//similar products
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

//single product
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