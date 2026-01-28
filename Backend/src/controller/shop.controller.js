import Shop from "../modules/Shop.model.js";
import User from "../modules/user.model.js";

export const Shopcreated = async (req, res) => {
  try {
    console.log("dataaa");
    
    const { shopName, city, businessType, category, shopSize } = req.body;

    if (!shopName || !city || !businessType || !category || !shopSize) {
      return res.status(400).json({ message: "Missing details" });
    }

    const userId = req.userId;

    let shop = await Shop.findOne({ ownerId: userId });
    if (shop) {
      return res.status(409).json({ message: "Store already created" });
    }

    shop = await Shop.create({
      ownerId: userId,
      shopName,
      city,
      businessType,
      category,
      shopSize,
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { activeShopId: shop._id },
      { new: true }
    );

 
    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      emailVerified: user.emailVerified,
      profilePhoto: user.profilePhoto,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionStatus: user.subscriptionStatus,
      activeShopId: user.activeShopId,
    };

    res.status(201).json({
      message: "Shop created",
      shop,
      user: safeUser,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
