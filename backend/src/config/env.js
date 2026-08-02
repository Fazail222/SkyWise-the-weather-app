import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: process.env.JWT_EXPIRES_IN,
  clientUrl: process.env.CLIENT_URL,
  weatherApiKey: process.env.WEATHER_API_KEY,
  openRouterApiKey: process.env.OPENROUTER_API_KEY,
};