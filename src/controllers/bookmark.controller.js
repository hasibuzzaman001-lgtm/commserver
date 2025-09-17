import mongoose, { isValidObjectId } from "mongoose";
import { Bookmark } from "../models/bookmark.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleBookmark = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { collection = "default" } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.status !== "active") {
    throw new ApiError(400, "Cannot bookmark inactive post");
  }

  // Check if already bookmarked in this collection
  const existingBookmark = await Bookmark.findOne({
    user: userId,
    post: postId,
    collection: collection,
  });

  if (existingBookmark) {
    // Remove bookmark
    await Bookmark.findByIdAndDelete(existingBookmark._id);

    // Update post bookmark count
    await Post.findByIdAndUpdate(postId, {
      $inc: { "localEngagement.bookmarks": -1 },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { bookmarked: false },
          "Post unbookmarked successfully"
        )
      );
  } else {
    // Add bookmark
    await Bookmark.create({
      user: userId,
      post: postId,
      collection: collection,
    });

    // Update post bookmark count
    await Post.findByIdAndUpdate(postId, {
      $inc: { "localEngagement.bookmarks": 1 },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { bookmarked: true },
          "Post bookmarked successfully"
        )
      );
  }
});

const getUserBookmarks = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    collection,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;
  const userId = req.user._id;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const pipeline = [
    // Match bookmarks for current user
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        ...(collection ? { collection } : {}),
      },
    },

    // Lookup post details
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
        pipeline: [
          { $match: { status: "active" } },

          // populate owner
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
            },
          },
          { $unwind: "$owner" },

          // populate community
          {
            $lookup: {
              from: "communities",
              localField: "community",
              foreignField: "_id",
              as: "community",
              pipeline: [{ $project: { name: 1, category: 1 } }],
            },
          },
          { $unwind: { path: "$community", preserveNullAndEmptyArrays: true } },
        ],
      },
    },

    // Ensure post exists
    { $match: { "post.0": { $exists: true } } },
    { $addFields: { post: { $first: "$post" } } },

    // Sort by bookmark fields (createdAt etc.)
    { $sort: { [sortBy]: sortType === "asc" ? 1 : -1 } },

    // Pagination
    { $skip: skip },
    { $limit: parseInt(limit) },
  ];

  const docs = await Bookmark.aggregate(pipeline);

  // Count for pagination
  const totalDocs = await Bookmark.countDocuments({
    user: userId,
    ...(collection ? { collection } : {}),
  });

  return res.status(200).json({
    success: true,
    docs, // contains {_id, collection, createdAt, post: {...}}
    totalDocs,
    limit: parseInt(limit),
    page: parseInt(page),
    totalPages: Math.ceil(totalDocs / limit),
  });
});

const getUserBookmarkCollections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const collections = await Bookmark.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$collection",
        count: { $sum: 1 },
        lastUpdated: { $max: "$createdAt" },
      },
    },
    {
      $project: {
        collection: "$_id",
        count: 1,
        lastUpdated: 1,
        _id: 0,
      },
    },
    {
      $sort: { lastUpdated: -1 },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collections,
        "Bookmark collections fetched successfully"
      )
    );
});

const createBookmarkCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id;

  if (!name?.trim()) {
    throw new ApiError(400, "Collection name is required");
  }

  const collectionName = name.trim().toLowerCase().replace(/\s+/g, "-");

  // Check if collection already exists for user
  const existingCollection = await Bookmark.findOne({
    user: userId,
    collection: collectionName,
  });

  if (existingCollection) {
    throw new ApiError(400, "Collection with this name already exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { collection: collectionName },
        "Collection name validated"
      )
    );
});

const deleteBookmarkCollection = asyncHandler(async (req, res) => {
  const { collection } = req.params;
  const userId = req.user._id;

  if (collection === "default") {
    throw new ApiError(400, "Cannot delete default collection");
  }

  const result = await Bookmark.deleteMany({
    user: userId,
    collection: collection,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedCount: result.deletedCount },
        "Collection deleted successfully"
      )
    );
});

const moveBookmark = asyncHandler(async (req, res) => {
  const { bookmarkId } = req.params;
  const { collection } = req.body;
  const userId = req.user._id;

  if (!collection?.trim()) {
    throw new ApiError(400, "Collection name is required");
  }

  if (!isValidObjectId(bookmarkId)) {
    throw new ApiError(400, "Invalid bookmark ID");
  }

  const bookmark = await Bookmark.findById(bookmarkId);
  if (!bookmark) {
    throw new ApiError(404, "Bookmark not found");
  }

  if (!bookmark.user.equals(userId)) {
    throw new ApiError(403, "You can only move your own bookmarks");
  }

  const updatedBookmark = await Bookmark.findByIdAndUpdate(
    bookmarkId,
    { collection: collection.trim().toLowerCase().replace(/\s+/g, "-") },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedBookmark, "Bookmark moved successfully"));
});

const checkBookmarkStatus = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const bookmarks = await Bookmark.find({
    user: userId,
    post: postId,
  }).select("collection");

  const collections = bookmarks.map((bookmark) => bookmark.collection);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isBookmarked: bookmarks.length > 0,
        collections: collections,
      },
      "Bookmark status checked"
    )
  );
});

export {
  toggleBookmark,
  getUserBookmarks,
  getUserBookmarkCollections,
  createBookmarkCollection,
  deleteBookmarkCollection,
  moveBookmark,
  checkBookmarkStatus,
};
