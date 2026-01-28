import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const Protected = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
 req.userId = decoded.userId; 
     next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
