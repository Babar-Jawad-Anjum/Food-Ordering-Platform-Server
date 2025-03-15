import express from "express";
import {
  validateGetRestaurantRequest,
  validateRestaurantRequest,
} from "../middlewares/validation";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

router.get(
  "/search/:city",
  validateRestaurantRequest,
  RestaurantController.searchRestaurants
);

router.get(
  "/:restaurantId",
  validateGetRestaurantRequest,
  RestaurantController.getRestaurant
);
export default router;
