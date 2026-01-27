import express from "express"
import dotenv from "dotenv"
import AuthRoute from "./routes/auth.route.js"
const app = express();


app.use(express.json());
app.use("/api",AuthRoute);


export default app;
