import cloudinary from "cloudinary";
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import mongoose from "mongoose";

const getMyRestaurant = async (req: Request, res: Response): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found!" });

    res.status(200).json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching restaurant!" });
  }
};

const createMyRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log("req.userId");
    console.log(req.userId);
    //* Check if user has already existing restaurant as user can create only one restaurant himself.
    const existingRestaurant = await Restaurant.findOne({ user: req.userId });
    if (existingRestaurant)
      return res
        .status(409)
        .json({ message: "User restaurant already exists!" });

    //* Image conversion from raw binary to base 64 encoded
    const image = req.file as Express.Multer.File; // get uploaded file object from Multer
    const base64Image = Buffer.from(image.buffer).toString("base64"); // converts the binary data to a Base64-encoded string
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //* Upload image file to cloudinary
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    console.log(req.body);

    //* Save in DB
    const restaurant = new Restaurant(req.body);
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.imageUrl = uploadResponse.url;
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export default {
  createMyRestaurant,
  getMyRestaurant,
};
