import express from "express"
import { Protected } from "../middleware/Protected.js"
import { getMyShop, Shopcreated } from "../controller/shop.controller.js"


const ShopRouter= express.Router()

ShopRouter.post("/Shopcreated",Protected,Shopcreated);

ShopRouter.get("/getmyshop",Protected,getMyShop);
export default ShopRouter;