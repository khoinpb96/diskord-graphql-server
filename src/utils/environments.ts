import dotenv from "dotenv";

dotenv.config();

export default {
  MONGO_URI: process.env.MONGO_URI,
  SERVER_PATH: process.env.SERVER_PATH || "/graphql",
  JWT_SECRET: process.env.JWT_SECRET,
};
