import express from "express";
import redisClient from "../config/redis.js";

const router = express.Router();

router.get("/set", async (req, res) => {
  await redisClient.set("user", "playboy");
  res.json({ message: "Data saved in Redis" });
});

router.get("/get", async (req, res) => {
  const data = await redisClient.get("user");
  res.json({ data });
});

export default router;
