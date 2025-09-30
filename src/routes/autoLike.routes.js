import { Router } from "express";
import {
  assignInitialLikes,
  runAutoLikeIncrement,
  recalculatePostLikes,
  recalculateAllPostLikes,
  getAutoLikeStatus,
} from "../controllers/autoLike.controller.js";

const router = Router();

router.route("/status").get(getAutoLikeStatus);

router.route("/run-increment").post(runAutoLikeIncrement);

router.route("/assign-initial/:postId").post(assignInitialLikes);

router.route("/recalculate/:postId").post(recalculatePostLikes);

router.route("/recalculate-all").post(recalculateAllPostLikes);

export default router;