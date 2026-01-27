import app from "./app.js";
import { ConnectDb } from "./config/db.js";
import { env } from "./config/env.js";
const startServer = async () => {
    await ConnectDb();
  app.listen(env.PORT, () => {
    console.log(`Server running at http://localhost:${env.PORT}`);
  });
};

startServer();