import mongoose from "mongoose";

const dashboardStatsSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      unique: true,
      index: true,
    },

    // 🔹 SALES STATS
    totalSales: {
      type: Number,
      default: 0,
    },

    totalOrders: {
      type: Number,
      default: 0,
    },

    totalProductsSold: {
      type: Number,
      default: 0,
    },

    totalProfit: {
      type: Number,
      default: 0,
    },

    // 🔹 PRODUCT STATS
    totalProducts: {
      type: Number,
      default: 0,
    },

    totalActive: {
      type: Number,
      default: 0,
    },

    totalOutOfStock: {
      type: Number,
      default: 0,
    },

    totalLowStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DashboardStats", dashboardStatsSchema);