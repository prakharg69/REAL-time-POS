import { object } from "zod";
import redisClient from "../config/redis.js";
import Product from "../modules/Product.model.js";
const CART_TTL = 60 * 60 * 2;
export const cartAdd = async (req, res) => {
  try {
    console.log("came to this api ");

    const sku = req.query.sku;
    const shopId = req.query.shopId;
    console.log("sku this is :", sku);

    if (!sku || !shopId) {
      return res
        .status(400)
        .json({ success: false, message: "SKU and shopId are required" });
    }
    const product = await Product.findOne({
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
    const cartKey = `cart:${shopId}`;
    const existingCart = await redisClient.get(cartKey);
    let cart = existingCart ? JSON.parse(existingCart) : null;
    if (!cart) {
      cart = {
        shopId,
        items: {},
        totalQuantity: 0,
        totalAmount: 0,
      };
    }
    if (cart.items[sku]) {
      cart.items[sku].quantity += 1;
      cart.items[sku].lineTotal =
        cart.items[sku].quantity * cart.items[sku].price;
    } else {
      cart.items[sku] = {
        productId: product._id,
        sku: product.sku,
        name: product.name,
        price: product.sellingPrice,
        unit: product.unit,
        quantity: 1,
        lineTotal: product.sellingPrice,
      };
    }

    let totalQty = 0;
    let totalAmt = 0;

    Object.values(cart.items).forEach((items) => {
      totalQty += items.quantity;
      totalAmt += items.lineTotal;
    });
    cart.totalAmount = totalAmt;
    cart.totalQuantity = totalQty;

    await redisClient.set(cartKey, JSON.stringify(cart), "EX", CART_TTL);
    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error);
  }
};

export const getCart = async (req, res) => {
  try {
    console.log("enter in get carttt");

    const { shopId } = req.query;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "shopId is required",
      });
    }

    const cartKey = `cart:${shopId}`;

    const cartData = await redisClient.get(cartKey);

    if (!cartData) {
      return res.status(200).json({
        success: true,
        cart: {
          shopId,
          items: {},
          totalQuantity: 0,
          totalAmount: 0,
        },
      });
    }

    const cart = JSON.parse(cartData);

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { sku, shopId } = req.body;

    if (!sku || !shopId) {
      return res.status(400).json({
        success: false,
        message: "SKU and shopId are required",
      });
    }

    const cartKey = `cart:${shopId}`;
    let cart = await redisClient.get(cartKey);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart = JSON.parse(cart);

    if (!cart.items[sku]) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    delete cart.items[sku];

    let totalQuantity = 0;
    let totalAmount = 0;

    Object.values(cart.items).forEach((item) => {
      totalQuantity += item.quantity;
      totalAmount += item.lineTotal;
    });

    cart.totalQuantity = totalQuantity;
    cart.totalAmount = totalAmount;

    await redisClient.set(cartKey, JSON.stringify(cart));

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    console.error("Delete cart product error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const updateQuantity = async (req, res) => {
  try {
    const { sku, quantity, shopId } = req.body;
    console.log("update me agyaa ");
    

   
    if (!sku || quantity == null || !shopId) {
      return res.status(400).json({
        success: false,
        message: "sku, quantity and shopId are required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }
    const product = await Product.findOne({sku})
    
   
    const cartKey = `cart:${shopId}`;

   
    const cartData = await redisClient.get(cartKey);
    if (!cartData) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    let cart = JSON.parse(cartData);
     if(product.stockQuantity < quantity){
        return res.status(400).json({ success: false,
        message: "quwantity is less",cart})
    }


    
    if (!cart.items[sku]) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

   
    cart.items[sku].quantity = quantity;
    cart.items[sku].lineTotal =
      quantity * cart.items[sku].price;

    
    let totalQuantity = 0;
    let totalAmount = 0;

    Object.values(cart.items).forEach((item) => {
      totalQuantity += item.quantity;
      totalAmount += item.lineTotal;
    });

    cart.totalQuantity = totalQuantity;
    cart.totalAmount = totalAmount;

    
    await redisClient.set(
      cartKey,
      JSON.stringify(cart),
      "EX",
      60 * 60 * 2
    );

    
    return res.status(200).json({
      success: true,
      message: "Quantity updated",
      cart,
    });

  } catch (error) {
    console.error("Update quantity error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
