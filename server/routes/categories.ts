import { Router } from "express";
import pool from "../database";

const categoriesRouter = Router();

//all categories
categoriesRouter.get("/", (req, res) => {
  const sql = 'SELECT DISTINCT category->"$.id" AS "id", category->"$.name" AS "name", category->"$.image" AS "image" FROM products';

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
  
//single category
categoriesRouter.get("/:category", (req, res) => {
  const { column, lastSeen, lastSeenId, prev } = req.query;
  const { category } = req.params;

  let sql: string;

  if (column === "title") {
    if (!lastSeen) {
      sql = `SELECT * FROM products WHERE category->"$.name" = "${category}" ORDER BY ${column} ASC LIMIT 50`;
    } else {
      sql = `SELECT * FROM products WHERE category->"$.name" = "${category}" AND ${column} > "${lastSeen}" ORDER BY ${column} ASC LIMIT 50`
    }
  } else {
    if (!lastSeen) {
      sql = `SELECT * FROM products WHERE category->"$.name" = "${category}" ORDER BY ${column} DESC LIMIT 50`;
    } else {
        if (prev) {
          sql = `SELECT * FROM products WHERE category->"$.name" = "${category}" AND ${column} >= ${lastSeen} ORDER BY ${column} LIMIT 50`
        } else {
          sql = `SELECT * FROM products WHERE category->"$.name" = "${category}" AND ${column} <= ${lastSeen} AND productId > ${lastSeenId} ORDER BY ${column} DESC LIMIT 50`
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

export default categoriesRouter;