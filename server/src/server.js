import "dotenv/config";
import express from "express";
import cors from "cors";
import crypto from "crypto";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applications.js";

global.crypto = crypto;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ status: "ok", app: "CareerForge" }));
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
await connectDB();
app.listen(PORT, () => console.log(`CareerForge API running on http://localhost:${PORT}`));
