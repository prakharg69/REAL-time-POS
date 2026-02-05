import express from "express"
import { Protected } from "../middleware/Protected.js";
import { cartAdd, deleteProduct, getCart, updateQuantity } from "../controller/cart.controller.js";

const CartRoute = express.Router();

CartRoute.post("/cartadd",Protected,cartAdd);
CartRoute.get("/getcart",Protected,getCart);
CartRoute.delete("/deleteproduct",Protected,deleteProduct);
CartRoute.post("/updatequantity",Protected,updateQuantity);
export default CartRoute;
