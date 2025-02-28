import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

// MONGO_DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to Mongo!"));

const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
