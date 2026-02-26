"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promise_1 = __importDefault(require("mysql2/promise"));
const pooloption = {
    host: process.env.sqlDB_HOST,
    user: process.env.sqlDB_USER,
    password: process.env.sqlDB_PASS,
    database: process.env.sqlDB_NAME,
    port: Number(process.env.sqlDB_port),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};
exports.pool = promise_1.default.createPool(pooloption);
