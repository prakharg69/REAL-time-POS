import mongoose from "mongoose";
import ordermodel from "../modules/ordermodel.js";
import userModel from "../modules/user.model.js";
import orderItemmodel from "../modules/orderItemmodel.js";
import ProductModel from "../modules/Product.model.js";

export const salesOverview = async (req, res) => {
  try {
    const { filter = "day" } = req.query;

    if (!["day", "month", "year"].includes(filter)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter value",
      });
    }

    // get logged-in user
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const shopId = user.activeShopId;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop not found",
      });
    }

    // date range builder
    const now = new Date();
    let startDate = new Date();

    if (filter === "day") {
      startDate.setHours(0, 0, 0, 0);
    }

    if (filter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (filter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // total sales + total orders
    const orderStats = await ordermodel.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          status: { $ne: "cancelled" },
          paymentStatus: "paid",
          createdAt: {
            $gte: startDate,
            $lte: now,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$totalAmount",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
    ]);

    // total products sold + total profit
    const itemStats = await orderItemmodel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "orderData",
        },
      },
      {
        $unwind: "$orderData",
      },
      {
        $match: {
          "orderData.shopId": new mongoose.Types.ObjectId(shopId),
          "orderData.status": { $ne: "cancelled" },
          "orderData.createdAt": {
            $gte: startDate,
            $lte: now,
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: "$productData",
      },
      {
        $group: {
          _id: null,

          totalProductsSold: {
            $sum: "$quantity",
          },

          totalProfit: {
            $sum: {
              $multiply: [
                {
                  $subtract: ["$price", "$productData.costPrice"],
                },
                "$quantity",
              ],
            },
          },
        },
      },
    ]);

    // final response
    const response = {
      totalSales: orderStats[0]?.totalSales || 0,
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalProductsSold: itemStats[0]?.totalProductsSold || 0,
      totalProfit: itemStats[0]?.totalProfit || 0,
    };

    return res.status(200).json({
      success: true,
      filter,
      data: response,
    });
  } catch (error) {
    console.log("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const topSellingProducts = async (req, res) => {
  try {
    const { filter = "day" } = req.query;

    // validate filter
    if (!["day", "month", "year"].includes(filter)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter value",
      });
    }

    // get logged-in user
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const shopId = user.activeShopId;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop not found",
      });
    }

    // date range builder
    const now = new Date();
    let startDate = new Date();

    if (filter === "day") {
      startDate.setHours(0, 0, 0, 0);
    }

    if (filter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (filter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const topProducts = await orderItemmodel.aggregate([
      // join with orders
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "orderData",
        },
      },

      {
        $unwind: "$orderData",
      },

      // filter shop + date + paid + not cancelled
      {
        $match: {
          "orderData.shopId": new mongoose.Types.ObjectId(shopId),
          "orderData.status": { $ne: "cancelled" },
          "orderData.createdAt": {
            $gte: startDate,
            $lte: now,
          },
        },
      },

      // join with products for costPrice
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData",
        },
      },

      {
        $unwind: "$productData",
      },

      // group by product
      {
        $group: {
          _id: "$productId",

          productName: {
            $first: "$name",
          },

          totalQuantitySold: {
            $sum: "$quantity",
          },

          totalRevenue: {
            $sum: "$lineTotal",
          },

          totalProfit: {
            $sum: {
              $multiply: [
                {
                  $subtract: ["$price", "$productData.costPrice"],
                },
                "$quantity",
              ],
            },
          },
        },
      },

      // sort highest selling first
      {
        $sort: {
          totalQuantitySold: -1,
        },
      },

      // top 10 only
      {
        $limit: 10,
      },

      // clean response
      {
        $project: {
          _id: 0,
          productName: 1,
          totalQuantitySold: 1,
          totalRevenue: 1,
          totalProfit: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      filter,
      data: topProducts,
    });
  } catch (error) {
    console.log("Top Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const lowStockAlert = async (req, res) => {
  try {
    // get logged-in user
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const shopId = user.activeShopId;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop not found",
      });
    }

    const lowStockProducts = await productModel.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          isActive: true,
        },
      },

      // stockQuantity <= minimumStock
      {
        $match: {
          $expr: {
            $lte: ["$stockQuantity", "$minimumStock"],
          },
        },
      },

      // add status field
      {
        $addFields: {
          status: {
            $cond: {
              if: { $eq: ["$stockQuantity", 0] },
              then: "Out of Stock",
              else: "Low Stock",
            },
          },
        },
      },

      // sort urgent first
      {
        $sort: {
          stockQuantity: 1,
        },
      },

      // top 10 only
      {
        $limit: 10,
      },

      // clean response
      {
        $project: {
          _id: 0,
          productName: "$name",
          sku: 1,
          currentStock: "$stockQuantity",
          minimumStock: 1,
          status: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: lowStockProducts,
    });
  } catch (error) {
    console.log("Low Stock Alert Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const SalesTrend = async (req, res) => {
  try {
    const { filter = "week" } = req.query;

    if (!["week", "month", "year"].includes(filter)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter value",
      });
    }

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const shopId = user.activeShopId;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop not found",
      });
    }

    const now = new Date();
    let startDate = new Date();
    let groupFormat;

    // week → last 7 days
    if (filter === "week") {
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 7,
      );

      groupFormat = "%Y-%m-%d";
    }

    // month → current month day-wise
    if (filter === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);

      groupFormat = "%Y-%m-%d";
    }

    // year → current year month-wise
    if (filter === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);

      groupFormat = "%Y-%m";
    }

    const salesTrend = await orderItemmodel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "orderData",
        },
      },

      {
        $unwind: "$orderData",
      },

      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "productData",
        },
      },

      {
        $unwind: "$productData",
      },

      {
        $match: {
          "orderData.shopId": new mongoose.Types.ObjectId(shopId),
          "orderData.status": "completed",
          "orderData.createdAt": {
            $gte: startDate,
            $lte: now,
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: "$orderData.createdAt",
            },
          },

          totalSales: {
            $sum: "$lineTotal",
          },

          totalProfit: {
            $sum: {
              $multiply: [
                {
                  $subtract: ["$price", "$productData.costPrice"],
                },
                "$quantity",
              ],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      filter,
      data: salesTrend,
    });
  } catch (error) {
    console.log("Sales Trend Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const productPerformance = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const shopId = user.activeShopId;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "Shop not found",
      });
    }

    const InventoryStats = await ProductModel.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
        },
      },
      {
        $group: {
          _id: null,

          totalProducts: {
            $sum: 1,
          },

          totalActive: {
            $sum: {
              $cond: [{ $eq: ["$isActive", true] }, 1, 0],
            },
          },

          totalOutOfStock: {
            $sum: {
              $cond: [{ $eq: ["$stockQuantity", 0] }, 1, 0],
            },
          },

          totalLowStock: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lte: ["$stockQuantity", "$minimumStock"] },
                    { $gt: ["$stockQuantity", 0] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = InventoryStats[0] || {
      totalProducts: 0,
      totalActive: 0,
      totalOutOfStock: 0,
      totalLowStock: 0,
    };

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.log("productPerformance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};