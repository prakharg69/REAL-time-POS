import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    brand: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true
    },

    barcode: {
      type: String,
      default: null
    },

    qrCode: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: null
    },

    // 💰 Pricing
    sellingPrice: {
      type: Number,
      required: true
    },

    costPrice: {
      type: Number,
      required: true
    },

    mrp: {
      type: Number,
      required: true
    },

   
    unit: {
      type: String, 
      required: true
    },

    stockQuantity: {
      type: Number,
      required: true
    },

    minimumStock: {
      type: Number,
      default: 0
    },

   
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


productSchema.index(
  { shopId: 1, sku: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
