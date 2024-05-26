import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import cors from "cors";
import usersRouter from "./routes/users";
import cartRouter from "./routes/cart";
import categoriesRouter from "./routes/categories";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));
