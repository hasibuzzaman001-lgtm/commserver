import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  getPostByUser,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(getAllPosts);
router.route("/:postId").get(getPostById);

router.use(verifyJWT);
router.route("/user/:userId").get(getPostByUser);

export default router;
