import { autoLikeService } from "../services/AutoLikeService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const assignInitialLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  try {
    const likesCount = await autoLikeService.assignInitialLikesToPost(postId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { postId, likesAdded: likesCount },
          `Successfully assigned ${likesCount} initial likes to post`
        )
      );
  } catch (error) {
    throw new ApiError(500, `Failed to assign initial likes: ${error.message}`);
  }
});

const runAutoLikeIncrement = asyncHandler(async (req, res) => {
  try {
    const result = await autoLikeService.incrementLikesForRecentPosts();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          `Auto-like increment completed: ${result.totalLikesAdded} likes added to ${result.postsUpdated} posts`
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Auto-like increment failed: ${error.message}`
    );
  }
});

const recalculatePostLikes = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    throw new ApiError(400, "Post ID is required");
  }

  try {
    const likeCount = await autoLikeService.recalculatePostLikes(postId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { postId, totalLikes: likeCount },
          `Post likes recalculated successfully`
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to recalculate post likes: ${error.message}`
    );
  }
});

const recalculateAllPostLikes = asyncHandler(async (req, res) => {
  try {
    const result = await autoLikeService.recalculateAllPostLikes();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          `Successfully recalculated likes for all posts`
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to recalculate all post likes: ${error.message}`
    );
  }
});

const getAutoLikeStatus = asyncHandler(async (req, res) => {
  try {
    const status = {
      enabled: true,
      minLikes: autoLikeService.minLikes,
      maxLikes: autoLikeService.maxLikes,
      cronSchedule: "Every 5 minutes",
      targetPosts: "Last 100 posts",
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, status, "Auto-like status fetched successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      `Failed to fetch auto-like status: ${error.message}`
    );
  }
});

export {
  assignInitialLikes,
  runAutoLikeIncrement,
  recalculatePostLikes,
  recalculateAllPostLikes,
  getAutoLikeStatus,
};