import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import cors from "cors";
import usersRouter from "./routes/users";
import cartRouter from "./routes/cart";
import categoriesRouter from "./routes/categories";
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://online-store-frontend-mocha.vercel.app', FRONTEND_URL],
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    credentials: true
}));
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));