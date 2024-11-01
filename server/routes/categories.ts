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

export default categoriesRouter;