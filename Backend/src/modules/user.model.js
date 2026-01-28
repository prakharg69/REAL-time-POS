import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
   
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    emailVerified:{
      type:Boolean,
      default:false
    },

    profilePhoto: {
      type: String
    },

    authProvider: {
      type: String,
      enum: ["google"],
      default: "google"
    },

  
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },

    subscriptionStatus: {
      type: String,
      enum: ["active", "trial", "expired"],
      default: "active"
    },

    subscriptionExpiry: {
      type: Date,
      default: null
    },

    trialUsed: {
      type: Boolean,
      default: false
    },

   
    phoneNumber: {
      type: String,
      default: null
    },

    supportEmail: {
      type: String,
      default: null
    },

   
    refreshTokenVersion: {
      type: Number,
      default: 0
    },

    lastLoginAt: {
      type: Date
    },

    lastLogoutAt: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: true
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    
    activeShopId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },
  },
  {
    timestamps: true 
  }
);

export default mongoose.model("User", userSchema);

