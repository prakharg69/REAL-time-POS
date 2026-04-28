import express from "express"
import { Protected } from "../middleware/Protected.js";
import { createRazorpayOrder, orderCreate, verifyRazorpayPayment } from "../controller/order.controller.js";

const orderRoute = express.Router();


orderRoute.post("/orderscreate",Protected,orderCreate);
orderRoute.post("/razorpaycreateorder",Protected,createRazorpayOrder);
orderRoute.post("/verifypayemnt",Protected,verifyRazorpayPayment);
export default orderRoute;