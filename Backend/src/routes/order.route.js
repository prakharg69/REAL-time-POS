import express from "express"
import { Protected } from "../middleware/Protected.js";
import { orderCreate } from "../controller/order.controller.js";

const orderRoute = express.Router();


orderRoute.post("/orderscreate",Protected,orderCreate);

export default orderRoute;