import { Router } from "express";
import pool from "../database";

const productsRouter = Router();

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

//all products
productsRouter.get("/", (req, res) => {
  const { column, lastSeen, lastSeenId, prev } = req.query;
  
  let sql: string;

  if (column === "title") {
    if (!lastSeen) {
      sql = `SELECT * FROM products ORDER BY ${column}, productId ASC LIMIT 50`;
    } else {
      if (prev) {
        sql = `SELECT * FROM products WHERE (${column} = "${lastSeen}" AND productId < ${lastSeenId}) OR ${column} < "${lastSeen}" ORDER BY ${column} DESC, productId DESC LIMIT 50`;
      } else {
        sql = `SELECT * FROM products WHERE (${column} = "${lastSeen}" AND productId > ${lastSeenId}) OR ${column} > "${lastSeen}" ORDER BY ${column} ASC, productId ASC LIMIT 50`;
      }
    }
  } else {
    if (!lastSeen) {
      sql = `SELECT * FROM products ORDER BY ${column} DESC, productId ASC LIMIT 50`;
    } else {
        if (prev) {
          sql = `SELECT * FROM products WHERE (${column} = ${lastSeen} AND productId < ${lastSeenId}) OR ${column} > ${lastSeen} ORDER BY ${column} ASC, productId DESC LIMIT 50`;
        } else {
          sql = `SELECT * FROM products WHERE (${column} = ${lastSeen} AND productId > ${lastSeenId}) OR ${column} < ${lastSeen} ORDER BY ${column} DESC, productId ASC LIMIT 50`;
        }
    }
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

      res.send(rows);

      connection.release();
    });
  });
});

//similar
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