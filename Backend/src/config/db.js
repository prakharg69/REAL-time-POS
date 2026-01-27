import mongoose from "mongoose";
import { env } from "./env.js";

export const ConnectDb = async () => {
  try {
    await mongoose.connect(env.MONGO_URL);
    console.log(" MongoDB connected");
    console.log(" Host:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
