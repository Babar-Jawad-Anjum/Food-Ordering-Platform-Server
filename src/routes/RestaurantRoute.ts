import express from "express";
import { validateRestaurantRequest } from "../middlewares/validation";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  validateRestaurantRequest,
  RestaurantController.searchRestaurants
);

export default router;
