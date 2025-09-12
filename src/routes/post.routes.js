import { Router } from "express";
import { getAllPosts, getPostById } from "../controllers/post.controller.js";
import { autoScrapeMiddleware } from "../middlewares/scraping.middleware.js";

const router = Router();

// Apply auto-scraping middleware to GET all posts route
router.route("/").get(autoScrapeMiddleware, getAllPosts);
router.route("/:postId").get(getPostById);

export default router;
