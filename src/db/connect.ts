import mongoose, { HydratedDocument } from "mongoose";
import { DB_URI } from "../utils/loadEnvirontment";

async function connectDB()  {
  try {
    await mongoose.connect(DB_URI)
    console.log('database connected....');

  } catch (error) {
    console.log('fail to connecting database!!......');
  }
}

export { connectDB };