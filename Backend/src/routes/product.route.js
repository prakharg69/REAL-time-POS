import express from "express"
import { Protected } from "../middleware/Protected.js"
import { addBulkProduct, AddProduct, getProduct } from "../controller/product.controller.js";



const ProductRouter= express.Router()

ProductRouter.post("/addproduct",Protected,AddProduct);
ProductRouter.get("/getproduct",Protected,getProduct);
ProductRouter.post("/addBulkProduct",addBulkProduct);
export default ProductRouter;