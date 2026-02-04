import express from "express"
import { Protected } from "../middleware/Protected.js";
import { cartAdd } from "../controller/cart.controller.js";

const CartRoute = express.Router();

CartRoute.post("/cartadd",Protected,cartAdd);

export default CartRoute;
