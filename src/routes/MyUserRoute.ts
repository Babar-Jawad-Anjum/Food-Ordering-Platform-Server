import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middlewares/auth";
import { validateMyUserRequest } from "../middlewares/validation";

const router = express.Router();

router.post("/", jwtCheck, MyUserController.createCurrentUser);
router.put(
  "/",
  jwtCheck, // Check if Bearer token exist
  jwtParse, // Parse the jwt token
  validateMyUserRequest, // Schema validation middleware
  MyUserController.updateCurrentUser
);

export default router;
