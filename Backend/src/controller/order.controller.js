import redisClient from "../config/redis.js";
import OrderItem from "../modules/orderItemmodel.js";
import Order from "../modules/ordermodel.js";
import ProductModel from "../modules/Product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ message: "shopId required" });
    }

    const cartKey = `cart:${shopId}`;
    const cartData = await redisClient.get(cartKey);

    if (!cartData) {
      return res.status(400).json({ message: "Cart not found" });
    }

    const cart = JSON.parse(cartData);

    if (!cart.totalQuantity || cart.totalQuantity === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: cart.totalAmount * 100, // paise
      currency: "INR",
    });

    res.json({ razorpayOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Razorpay order creation failed" });
  }
};


export const orderCreate = async (req, res) => {
  try {
    const { shopId, customerEmail, customerName, paymentMethod } = req.body;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "shopId is required",
      });
    }

    const cartKey = `cart:${shopId}`;

   
    const cartData = await redisClient.get(cartKey);

    if (!cartData) {
      return res.status(400).json({
        success: false,
        message: "Cart already processed or expired",
      });
    }

    const cart = JSON.parse(cartData);

    if (!cart.totalQuantity || cart.totalQuantity === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    
    const itemsArray = Object.values(cart.items);

    for (const item of itemsArray) {
      const product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }
    }

    
    const order = await Order.create({
      shopId,
      customerName,
      customerEmail,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount,
      paymentMethod,
      status: "completed",
    });

    
    for (const item of itemsArray) {
      await OrderItem.create({
        orderId: order._id,
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        unit: item.unit,
      });

      
      await ProductModel.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    
    await redisClient.del(cartKey);

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order._id,
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shopId,
      customerName,
      customerEmail,
    } = req.body;

    // 🔐 Signature Verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const cartKey = `cart:${shopId}`;
    const cartData = await redisClient.get(cartKey);

    if (!cartData) {
      return res.status(400).json({ message: "Cart already processed" });
    }

    const cart = JSON.parse(cartData);
    const itemsArray = Object.values(cart.items);

    
    for (const item of itemsArray) {
      const product = await ProductModel.findById(item.productId);

      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product?.name || "product"}`,
        });
      }
    }

    
    const order = await Order.create({
      shopId,
      customerName,
      customerEmail,
      totalQuantity: cart.totalQuantity,
      totalAmount: cart.totalAmount,
      paymentMethod: "upi",
      status: "completed",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    
    for (const item of itemsArray) {
      await OrderItem.create({
        orderId: order._id,
        productId: item.productId,
        name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
        unit: item.unit,
      });

      await ProductModel.updateOne(
        { _id: item.productId },
        { $inc: { stockQuantity: -item.quantity } }
      );
    }

    
    await redisClient.del(cartKey);

    res.json({ success: true, orderId: order._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};