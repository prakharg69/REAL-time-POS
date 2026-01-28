import dotenv from "dotenv"
dotenv.config();

export const env = {
    PORT:process.env.PORT|| 4001,
    MONGO_URL:process.env.MONGO_URL,
    GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    JWT_SECRET:process.env.JWT_SECRET
}