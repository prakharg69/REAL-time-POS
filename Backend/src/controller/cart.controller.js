import redisClient from "../config/redis.js";
import Product from "../modules/Product.model.js";
const CART_TTL = 60 * 60 * 2; 
export const cartAdd = async (req, res) => {
  try {
    console.log("came to this api ");

    const sku = req.query.sku;
    const shopId = req.query.shopId;
    console.log("sku this is :",sku);
    
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

    Object.values(cart.items).forEach((items)=>{
            totalQty+=items.quantity
            totalAmt+=items.lineTotal
    });
    cart.totalAmount = totalAmt;
    cart.totalQuantity = totalQty;

    await redisClient.set(cartKey ,JSON.stringify(cart),"EX", CART_TTL);
    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error);
  }
};
