import express from "express";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import OrderController from "../controllers/OrderController";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  jwtCheck, // Check if Bearer token exist
  jwtParse, // Parse the jwt token
  OrderController.createCheckoutSession
);

export default router;
