import express from "express"
import dotenv from "dotenv"
import AuthRoute from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser";
import ShopRouter from "./routes/shop.route.js";
import UserRouter from "./routes/user.route.js";
import ProductRouter from "./routes/product.route.js";
import testRoutes from "./routes/test.routes.js";
import CartRoute from "./routes/cart.route.js";
import inventoryRoute from "./routes/inventory.route.js";
import orderRoute from "./routes/order.route.js";
import statRoute from "./routes/stats.route.js";
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));



app.use("/api/auth",AuthRoute);
app.use("/api",ShopRouter);
app.use("/api",UserRouter);
app.use("/api",ProductRouter);
app.use("/redis", testRoutes);
app.use("/api",CartRoute);
app.use("/api",inventoryRoute);
app.use("/api",orderRoute);
app.use("/api/dashboard", statRoute);

export default app;
