import express from "express"
import { Protected } from "../middleware/Protected.js"
import { Shopcreated } from "../controller/shop.controller.js"


const ShopRouter= express.Router()

ShopRouter.post("/Shopcreated",Protected,Shopcreated);

export default ShopRouter;