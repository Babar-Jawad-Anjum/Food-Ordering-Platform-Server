import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middlewares/auth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"), // will embed file in req object which can be accessed by req.file
  MyRestaurantController.createMyRestaurant
);

export default router;
