import express from "express";
import { Protected } from "../middleware/Protected.js";
import {
  categoryPerformance,
  lowStockAlert,
  productPerformance,
  salesOverview,
  SalesTrend,
  topSellingProducts,
} from "../controller/stats.controller.js";
const statRoute = express.Router();

statRoute.get("/sales-overview", Protected, salesOverview);
statRoute.get("/top-selling-products", Protected, topSellingProducts);
statRoute.get("/low-stock-alert", Protected, lowStockAlert);
statRoute.get("/sales-trend", Protected, SalesTrend);
statRoute.get("/product-performance",Protected,productPerformance);
statRoute.get("/category-performance",Protected,categoryPerformance);

export default statRoute;
