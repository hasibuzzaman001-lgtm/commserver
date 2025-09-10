import { Router } from "express";
import {
  createCommunity,
  gettAllCommunity,
} from "../controllers/community.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

//Public Routes
router.route("/").get(gettAllCommunity);

// Protected Routes
router.route("/create").post(verifyJWT, upload.single("icon"), createCommunity);
export default router;
