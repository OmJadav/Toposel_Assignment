import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDb from "./db/db.js";
import authRouter from "./routes/authRoutes.js";
import errorHandler from "./middleware/error.js";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

connectDb();

app.use("/api/auth", authRouter);

app.use(errorHandler);
app.get("/", (req, res) => {
  res.send("<h1>Hello World !</h1> <h1>Backend Server is running !</h1>");
});

app.listen(port, () => {
  console.log(`Server is runnning on port ${port}`);
});
