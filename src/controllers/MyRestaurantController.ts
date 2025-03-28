import cloudinary from "cloudinary";
import { Request, Response } from "express";
import Restaurant from "../models/restaurant";
import mongoose from "mongoose";
import Order from "../models/Order";

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

    // Upload file to cloudinary
    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    //* Save in DB
    const restaurant = new Restaurant(req.body);
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.imageUrl = imageUrl;
    restaurant.lastUpdated = new Date();
    await restaurant.save();

    res.status(201).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const getMyRestaurantOrders = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateMyRestaurant = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const restaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found!" });

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      // Upload file to cloudinary
      const imageUrl = await uploadImage(req.file as Express.Multer.File);

      restaurant.imageUrl = imageUrl;
    }

    await restaurant.save();

    return res.status(200).send(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    // The order of restaurant belongs to user's restaurant or not who logged in
    if (restaurant?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update order status" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  //* Image conversion from raw binary to base 64 encoded
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64"); // converts the binary data to a Base64-encoded string
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  //* Upload image file to cloudinary
  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
  getMyRestaurantOrders,
  updateOrderStatus,
};
