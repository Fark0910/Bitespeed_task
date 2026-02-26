import dotenv from "dotenv";
dotenv.config();
import mysql,  { Pool, PoolOptions }  from "mysql2/promise";

const pooloption:PoolOptions = {
    host: process.env.sqlDB_HOST,                                                                         
    user: process.env.sqlDB_USER, 
    password: process.env.sqlDB_PASS, 
    database: process.env.sqlDB_NAME,
    port:Number(process.env.sqlDB_port),
    ssl:{rejectUnauthorized:false},
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
}

export const pool:Pool = mysql.createPool(pooloption);