import { Router } from "express";
import pool from "../database";

const categoriesRouter = Router();

categoriesRouter.get("/", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY name ASC";

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