import app from "./app.js";
import { ConnectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { connectRedis } from "./config/redis.js";
const startServer = async () => {
    await ConnectDb();
    await connectRedis();
  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`);
  });
};

startServer();