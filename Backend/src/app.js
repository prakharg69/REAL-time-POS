import express from "express"
import dotenv from "dotenv"
import AuthRoute from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));



app.use("/api/auth",AuthRoute);


export default app;
