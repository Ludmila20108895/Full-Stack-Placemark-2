import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/explorer";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI); // Removed deprecated options
    console.log(" MongoDB connected successfully!");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    process.exit(1);
  }
};
