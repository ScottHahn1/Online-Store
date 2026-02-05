import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products";
import cors from "cors";
import usersRouter from "./routes/users";
import cartRouter from "./routes/cart";
import categoriesRouter from "./routes/categories";
import cookieParser from 'cookie-parser';
import paymentsRouter from "./routes/payments";

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;
const frontendUrl = process.env.NODE_ENV === "production" 
? "https://online-store-frontend-mocha.vercel.app" 
: "http://localhost:3000";

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "frontendUrl",
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    credentials: true
}));
app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/payments', paymentsRouter);

app.listen(port, () => console.log(`Server running on port ${port}`));