import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(process.env.DB_URI as string);
    return;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectDB;
