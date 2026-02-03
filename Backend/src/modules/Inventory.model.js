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
      enum: ["initial", "sale", "restock", "adjustment", "return"],
      required: true
    },

    quantityChanged: {
      type: Number,
      required: true
      // +ve for add, -ve for reduce
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
