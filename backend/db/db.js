import mongoose from "mongoose";

const connectDb = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected ✅");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
