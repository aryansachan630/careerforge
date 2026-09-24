import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    console.log("MongoDB URI not configured — running in demo memory mode.");
    return false;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed. Falling back to demo memory mode.");
    return false;
  }
}
