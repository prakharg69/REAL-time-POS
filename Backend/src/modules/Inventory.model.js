import mongoose from "mongoose";

const inventoryLogSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    changeType: {
      type: String,
      enum: ["add", "remove", "adjust"],
      required: true
    },

    quantityChanged: {
      type: Number,
      required: true
    },

    previousStock: {
      type: Number,
      required: true
    },

    newStock: {
      type: Number,
      required: true
    },

    reason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export default mongoose.model("InventoryLog", inventoryLogSchema);
