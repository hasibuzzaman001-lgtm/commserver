import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";
import { UserScraperService } from "../services/UserScraperService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const userScraperService = new UserScraperService();

/**
 * Scrape Reddit users and save to database
 */
const scrapeRedditUsers = asyncHandler(async (req, res) => {
  const { count = 100 } = req.body;

  // Validate count
  if (!Number.isInteger(count) || count < 1 || count > 500) {
    throw new ApiError(400, "Count must be an integer between 1 and 500");
  }

  try {
    console.log(`🔄 Starting Reddit user scraping for ${count} users...`);

    const result = await userScraperService.scrapeAndSaveUsers(count);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          `Successfully scraped and saved ${result.totalSaved} users`
        )
      );
  } catch (error) {
    console.error("Reddit user scraping failed:", error.message);
    throw new ApiError(500, `User scraping failed: ${error.message}`);
  }
});

/**
 * Get scraping statistics
 */
const getScrapingStats = asyncHandler(async (req, res) => {
  try {
    const { User } = await import("../models/user.model.js");

    const stats = await User.aggregate([
      {
        $group: {
          _id: "$userType",
          count: { $sum: 1 },
        },
      },
    ]);

    const totalUsers = await User.countDocuments();
    const platformUsers = await User.countDocuments({ userType: "platform" });
    const realUsers = await User.countDocuments({ userType: "real" });

    const result = {
      totalUsers,
      platformUsers,
      realUsers,
      breakdown: stats,
      lastUpdated: new Date(),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, result, "User scraping stats fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, `Failed to fetch scraping stats: ${error.message}`);
  }
});
async function shuffleFollow() {
  try {
    console.log("🔄 Starting shuffleFollow process...");

    // Get all platform users
    const allUsers = await User.find({ userType: "platform" });

    if (allUsers.length < 2) {
      console.log("❌ Not enough users to create follows");
      return { error: "Need at least 2 users" };
    }

    let totalFollowsAdded = 0;
    let usersUpdated = 0;

    for (const user of allUsers) {
      try {
        // Check existing followers for this user
        const existingFollows = await Follow.countDocuments({
          following: user._id,
        });

        // Random follow count between 40-120
        const followCount = Math.floor(Math.random() * 81) + 40;

        // Get random users excluding current user
        const randomUsers = await User.aggregate([
          {
            $match: {
              userType: "platform",
              _id: { $ne: user._id },
            },
          },
          { $sample: { size: followCount } },
          { $project: { _id: 1 } },
        ]);

        const randomUserIds = randomUsers.map((u) => u._id);
        let followsCreated = 0;

        // Create follows
        for (const followerId of randomUserIds) {
          try {
            // Check if follow already exists
            const existingFollow = await Follow.findOne({
              follower: followerId,
              following: user._id,
            });

            if (existingFollow) {
              continue;
            }

            // Create new follow
            await Follow.create({
              follower: followerId,
              following: user._id,
            });

            followsCreated++;
          } catch (error) {
            // Handle duplicate key error
            if (error.code === 11000) {
              continue;
            } else {
              console.error(
                `Error creating follow for user ${followerId}:`,
                error.message
              );
            }
          }
        }

        if (followsCreated > 0) {
          totalFollowsAdded += followsCreated;
          usersUpdated++;

          console.log(
            `✅ Added ${followsCreated} followers to user "${user.username}" (Total: ${existingFollows + followsCreated})`
          );
        }
      } catch (userError) {
        console.error(`Error processing user ${user._id}:`, userError.message);
      }
    }

    const result = {
      totalUsers: allUsers.length,
      totalFollowsAdded,
      usersUpdated,
      timestamp: new Date(),
    };

    console.log(
      `✅ Shuffle follow completed: ${totalFollowsAdded} follows added to ${usersUpdated} users`
    );

    return result;
  } catch (error) {
    console.error("Error in shuffle follow process:", error.message);
    throw error;
  }
}

export { scrapeRedditUsers, getScrapingStats, shuffleFollow };
