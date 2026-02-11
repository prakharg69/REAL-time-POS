import InventoryModel from "../modules/Inventory.model.js";
import ProductModel from "../modules/Product.model.js";
import ShopModel from "../modules/Shop.model.js";

export const getProductDetail = async (req, res) => {
  try {
    const { sku } = req.query;
    if (!sku) {
      return res.status(400).json({
        success: false,
        message: "SKU is required",
      });
    }

    const product = await ProductModel.findOne({ sku });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: {
        productId: product._id,
        name: product.name,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
        unit: product.unit,
      },
    });
  } catch (error) {
    console.error("Get product detail error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const inventoryLog = async (req, res) => {
  try {
    const { sku, changeType, quantity, reason} = req.body;

    if (!sku || !changeType || quantity == null) {
      return res.status(400).json({
        success: false,
        message: "sku, changeType, quantity and shopId are required",
      });
    }
    const shopId = await ShopModel.findOne({ownerId: req.userId});

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const product = await ProductModel.findOne({
      sku,
      shopId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or inactive",
      });
    }

    const previousStock = product.stockQuantity;
    let newStock = previousStock;

    if (changeType === "add") {
      newStock = previousStock + quantity;
    } else if (changeType === "remove") {
      newStock = previousStock - quantity;

      if (newStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Insufficient stock",
        });
      }
    } else if (changeType === "adjust") {
      newStock = quantity;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid changeType",
      });
    }

    product.stockQuantity = newStock;
    await product.save();

    const log = await InventoryModel.create({
      shopId,
      productId: product._id,
      changeType,
      quantityChanged:
        changeType === "adjust"
          ? newStock - previousStock
          : changeType === "add"
            ? quantity
            : -quantity,
      previousStock,
      newStock,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Inventory updated successfully",
      product: {
        sku: product.sku,
        name: product.name,
        stockQuantity: product.stockQuantity,
        unit: product.unit,
      },
      log,
    });
  } catch (error) {
    console.error("Inventory log error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const getInventoryLog = async (req, res) => {
  try {

    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.userId;

   
    const shop = await ShopModel.findOne({ ownerId: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

   
    const totalLogs = await InventoryModel.countDocuments({
      shopId: shop._id,
    });

    
    if (skip >= totalLogs && totalLogs !== 0) {
      return res.status(400).json({ message: "Page does not exist" });
    }

   
    const inventoryLogs = await InventoryModel.find({
      shopId: shop._id,
    })
      .populate("productId","name brand sku ")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

   
    return res.status(200).json({
      success: true,
      data: inventoryLogs,
      pagination: {
        currentPage: page,
        limit,
        totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
        hasNextPage: page * limit < totalLogs,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Inventory log error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
