import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  getPostByUser,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllPosts)
  .post(verifyJWT, createPost);
router
  .route("/:postId")
  .get(getPostById)
  .delete(verifyJWT, deletePost);

router.use(verifyJWT);
router.route("/user/:userId").get(getPostByUser);

export default router;
