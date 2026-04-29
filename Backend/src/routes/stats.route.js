import express from "express";
import { Protected } from "../middleware/Protected.js";
import {
  lowStockAlert,
  salesOverview,
  SalesTrend,
  topSellingProducts,
} from "../controller/stats.controller.js";
const statRoute = express.Router();

statRoute.get("/sales-overview", Protected, salesOverview);
statRoute.get("/top-selling-products", Protected, topSellingProducts);
statRoute.get("/low-stock-alert", Protected, lowStockAlert);
statRoute.get("/sales-trend", Protected, SalesTrend);
export default statRoute;
