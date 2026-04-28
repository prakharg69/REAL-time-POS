import express from "express"
import { Protected } from "../middleware/Protected.js";
import { salesOverview } from "../controller/stats.controller.js";
const statRoute = express.Router();

statRoute.get("/sales",Protected,salesOverview);

export default statRoute;