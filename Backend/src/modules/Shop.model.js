import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    shopName: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    businessType: {
      type: String,
      enum: ["wholesaler", "retailer","both"],
      required: true,
      default: "retailer"
    
    },

    category: {
      type: String,
      default: null
    
    },

    shopSize: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "small"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Shop", shopSchema);
