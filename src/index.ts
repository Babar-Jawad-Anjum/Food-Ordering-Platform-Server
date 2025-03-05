import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";

// MONGO_DB CONNECTION
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Connected to Mongo!"));

const app = express();

// simple endpoint to check if server is up & running properly
app.get("/health", (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use(express.json());
app.use(cors());

app.use("/api/my/user", myUserRoute);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
