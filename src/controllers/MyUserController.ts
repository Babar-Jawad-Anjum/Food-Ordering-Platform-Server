import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { auth0Id } = req.body;

    // 1: Check if the user exists
    const existingUser = await User.findOne({ auth0Id });
    if (existingUser) return res.status(200).send();

    // 2: Create the user if it doesn't exist
    const newUser = new User(req.body);
    await newUser.save();

    // 3: Return the user object back to the calling client
    return res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Creating User" });
  }
};

export default {
  createCurrentUser,
};
