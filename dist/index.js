"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
//import session from "express-session";
//import flash from "connect-flash";
const router_1 = __importDefault(require("./routes/router"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//import flash_midd from "./middlewares/middle";
//import pool from "./db/db"; // Importing to extend the session data type
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("tiny"));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
//app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
//app.set("views", path.join(__dirname, "/views"));
app.use(router_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server running on http://localhost:${process.env.PORT}`);
});
