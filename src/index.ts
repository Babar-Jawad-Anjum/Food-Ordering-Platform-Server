import express, { Request, Response } from "express";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import "dotenv/config";

import myUserRoute from "./routes/MyUserRoute";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

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

app.use(cors());

// Ding this for validation and security reasons
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

// simple endpoint to check if server is up & running properly
app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
