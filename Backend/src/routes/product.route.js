import express from "express"
import { Protected } from "../middleware/Protected.js"
import { AddProduct, getProduct } from "../controller/product.controller.js";



const ProductRouter= express.Router()

ProductRouter.post("/addproduct",Protected,AddProduct);
ProductRouter.get("/getproduct",Protected,getProduct);
export default ProductRouter;