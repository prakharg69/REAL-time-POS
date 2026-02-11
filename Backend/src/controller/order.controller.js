import redisClient from "../config/redis.js";
import OrderItem from "../modules/orderItemmodel.js";
import Order from "../modules/ordermodel.js";
import ProductModel from "../modules/Product.model.js";

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
