import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  getPostByUser,
} from "../controllers/post.controller.js";
import { autoScrapeMiddleware } from "../middlewares/scraping.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(autoScrapeMiddleware, getAllPosts);
router.route("/:postId").get(getPostById);

router.use(verifyJWT);
router.route("/user/:userId").get(getPostByUser);

export default router;
