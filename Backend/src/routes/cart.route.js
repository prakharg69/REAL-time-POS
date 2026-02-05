import express from "express"
import { Protected } from "../middleware/Protected.js";
import { cartAdd, deleteProduct, getCart } from "../controller/cart.controller.js";

const CartRoute = express.Router();

CartRoute.post("/cartadd",Protected,cartAdd);
CartRoute.get("/getcart",Protected,getCart);
CartRoute.delete("/deleteproduct",Protected,deleteProduct);
export default CartRoute;
