import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },

    
    customerName: {
      type: String,
      trim: true,
      default: null,
    },

    customerEmail: {
      type: String,
      trim: true,
      default: null,
    },

    totalQuantity: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash" ,"upi"],
      required: true,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["completed", "cancelled"],
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
