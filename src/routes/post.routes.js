import { Router } from "express";
import { getAllPosts, getPostById } from "../controllers/post.controller.js";

const router = Router();

router.route("/").get(getAllPosts);
router.route("/:postId").get(getPostById);

export default router;
