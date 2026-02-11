import express from "express"
import { Protected } from "../middleware/Protected.js";
import { getInventoryLog, getProductDetail, inventoryLog } from "../controller/inventorylogs.controller.js";

const inventoryRoute = express.Router();

inventoryRoute.get("/getproductdetail",Protected,getProductDetail);
inventoryRoute.get("/getlogs",Protected,getInventoryLog);
inventoryRoute.post("/createlog",Protected,inventoryLog);


export default inventoryRoute ;