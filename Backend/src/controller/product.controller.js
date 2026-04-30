import { ZodError } from "zod";
import ProductModel from "../modules/Product.model.js";
import Shop from "../modules/Shop.model.js";
import { getNextCounterValue } from "../utils/getNextCounterValue.js";
import { generateQRCode } from "../utils/QrCodeGenrator.js";
import { SKUgenrator } from "../utils/SKUgenrator.js";
import { addProductSchema } from "../Validators/productvalidator.js";
import statsModel from "../modules/stats.model.js";

export const AddProduct = async (req, res) => {
  try {
    const { name, brand } = req.body;

    const parsedProduct = addProductSchema.parse(req.body);

    const shop = await Shop.findOne({ ownerId: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const existProduct = await ProductModel.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      brand: { $regex: `^${brand}$`, $options: "i" },
      shopId: shop._id,
    });

    if (existProduct) {
      return res.status(400).json({ message: "product already exist" });
    }

    const counterId = `product_${shop._id}`;
    const nextSeq = await getNextCounterValue(counterId);

    const SKU = SKUgenrator({
      name,
      brand,
      nextSeq,
    });

    parsedProduct.sku = SKU;

    const qrCode = await generateQRCode(SKU);
    parsedProduct.qrCode = qrCode;

    const newProduct = await ProductModel.create({
      ...parsedProduct,
      shopId: shop._id,
    });

    // 🔥 Update DashboardStats (FAST, no aggregation)
    await statsModel.updateOne(
      { shopId: shop._id },
      {
        $inc: {
          totalProducts: 1,
          totalActive: parsedProduct.isActive ? 1 : 0,
          totalOutOfStock: parsedProduct.stockQuantity === 0 ? 1 : 0,
          totalLowStock:
            parsedProduct.stockQuantity > 0 &&
            parsedProduct.stockQuantity <= parsedProduct.minimumStock
              ? 1
              : 0,
        },
      },
      { upsert: true }
    );

    return res.status(200).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        errors: error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
    }

    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    console.log("get my product entrrry hogyaaaaaa");

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const userId = req.userId;
    const shop = await Shop.findOne({ ownerId: userId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    const totalItems = await ProductModel.countDocuments({ shopId: shop._id });
    if (skip >= totalItems && totalItems !== 0) {
      return res.status(400).json({ message: "Page does not exist" });
    }
    const products = await ProductModel.find({ shopId: shop._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      data: products,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
