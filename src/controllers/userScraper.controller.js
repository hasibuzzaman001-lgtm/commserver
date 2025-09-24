<<<<<<< HEAD
import { UserScraperService } from "../services/UserScraperService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
=======
import { UserScraperService } from '../services/UserScraperService.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

const userScraperService = new UserScraperService();

/**
 * Scrape Reddit users and save to database
 */
const scrapeRedditUsers = asyncHandler(async (req, res) => {
  const { count = 100 } = req.body;

  // Validate count
  if (!Number.isInteger(count) || count < 1 || count > 500) {
<<<<<<< HEAD
    throw new ApiError(400, "Count must be an integer between 1 and 500");
=======
    throw new ApiError(400, 'Count must be an integer between 1 and 500');
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
  }

  try {
    console.log(`🔄 Starting Reddit user scraping for ${count} users...`);

    const result = await userScraperService.scrapeAndSaveUsers(count);

<<<<<<< HEAD
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
=======
    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        `Successfully scraped and saved ${result.totalSaved} users`
      )
    );

  } catch (error) {
    console.error('Reddit user scraping failed:', error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
    throw new ApiError(500, `User scraping failed: ${error.message}`);
  }
});

/**
 * Get scraping statistics
 */
const getScrapingStats = asyncHandler(async (req, res) => {
  try {
<<<<<<< HEAD
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
=======
    const { User } = await import('../models/user.model.js');
    
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const platformUsers = await User.countDocuments({ userType: 'platform' });
    const realUsers = await User.countDocuments({ userType: 'real' });
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

    const result = {
      totalUsers,
      platformUsers,
      realUsers,
      breakdown: stats,
<<<<<<< HEAD
      lastUpdated: new Date(),
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, result, "User scraping stats fetched successfully")
      );
=======
      lastUpdated: new Date()
    };

    return res.status(200).json(
      new ApiResponse(200, result, 'User scraping stats fetched successfully')
    );

>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
  } catch (error) {
    throw new ApiError(500, `Failed to fetch scraping stats: ${error.message}`);
  }
});

<<<<<<< HEAD
export { scrapeRedditUsers, getScrapingStats };
=======
export {
  scrapeRedditUsers,
  getScrapingStats
};
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
