import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import weatherRoutes from "./routes/weatherRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import mapRoutes from "./routes/mapRoutes.js"; // 👈 1. Import map routes

// Middleware Imports
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";

const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(helmet({
  crossOriginResourcePolicy: false, // 💡 Essential so frontend can load proxy image tiles cross-origin
}));

app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use(limiter);

// Health Check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Weather AI API is running",
  });
});

// Register API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/weather", weatherRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/history", historyRoutes);
app.use("/api/v1/map", mapRoutes); // 👈 2. Mount map routes here

// Global Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;