import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

// MONGO_DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to Mongo!"));

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
