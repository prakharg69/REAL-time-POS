import express from "express"
import { Protected } from "../middleware/Protected.js"
import { AddProduct } from "../controller/product.controller.js";



const ProductRouter= express.Router()

ProductRouter.post("/addproduct",Protected,AddProduct);


export default ProductRouter;