import mongoose from "mongoose";
import ordermodel from "../modules/ordermodel.js";
import userModel from "../modules/user.model.js";
import orderItemmodel from "../modules/orderItemmodel.js";

export const salesOverview = async (req, res) => {
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
          "orderData.paymentStatus": "paid",
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
                  $subtract: [
                    "$price",
                    "$productData.costPrice",
                  ],
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
