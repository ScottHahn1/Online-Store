import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,           
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
})

export default pool;