import express, { Request, Response } from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import "dotenv/config";

import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";

// MONGO_DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to Mongo!"));

// CLOUDINARY_SETUP
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// simple endpoint to check if server is up & running properly
app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
