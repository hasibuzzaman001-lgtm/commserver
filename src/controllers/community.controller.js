import mongoose from "mongoose";
import { Community } from "../models/community.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCommunity = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  const iconLocalPath = req.file?.path;

  if (!iconLocalPath) {
    throw new ApiError(400, "Icon file is required");
  }
  const icon = await uploadOnCloudinary(iconLocalPath);
  if (!icon) {
    throw new ApiError(400, "Icon file is required");
  }

  if (!name?.trim()) {
    throw new ApiError(400, "Community name is required");
  }

  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const existingCommunity = await Community.findOne({ slug });
  if (existingCommunity) {
    throw new ApiError(400, "Community name already exists");
  }

  if (!description?.trim()) {
    throw new ApiError(400, "Community description is required");
  }

  if (!category?.trim()) {
    throw new ApiError(400, "Community category is required");
  }

  const community = await Community.create({
    name: name.trim(),
    slug: slug,
    icon: icon.url,
    description: description.trim(),
    category: category.trim(),
  });

  return res
    .status(201)
    .json(new ApiResponse(201, community, "Community created successfully"));
});

const gettAllCommunity = asyncHandler(async (req, res) => {
  const communities = await Community.find(
    {},
    { name: 1, slug: 1, description: 1, category: 1, lastUpdatedAt: 1, icon: 1 }
  ).sort({ lastUpdatedAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, communities, "Communities fetched successfully")
    );
});

const commynityBySlug = asyncHandler(async (req, res) => {
  const { communitySlug } = req.params;
  const pipeline = [
    {
      $match: { slug: { $regex: `^${communitySlug}$`, $options: "i" } },
    },
    {
      $lookup: {
        from: "posts",
        let: { communityId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$community", "$$communityId"] },
              status: "active",
            },
          },
          { $sort: { createdAt: -1 } }, // newest posts first
          {
            $lookup: {
              from: "communities",
              localField: "community",
              foreignField: "_id",
              as: "community",
              pipeline: [{ $project: { name: 1, category: 1, slug: 1 } }],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [{ $project: { username: 1, fullName: 1, avatar: 1 } }],
            },
          },
          {
            $addFields: {
              community: { $first: "$community" },
              owner: { $first: "$owner" },
            },
          },
        ],
        as: "posts",
      },
    },
  ];

  const communityAggregate = await Community.aggregate(pipeline);
  const community = communityAggregate[0];

  if (!community) {
    throw new ApiError(404, "Community not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, community, "Community fetched successfully"));
});

export { gettAllCommunity, createCommunity, commynityBySlug };
