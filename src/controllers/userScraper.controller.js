import { UserScraperService } from '../services/UserScraperService.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const userScraperService = new UserScraperService();

/**
 * Scrape Reddit users and save to database
 */
const scrapeRedditUsers = asyncHandler(async (req, res) => {
  const { count = 100 } = req.body;

  // Validate count
  if (!Number.isInteger(count) || count < 1 || count > 500) {
    throw new ApiError(400, 'Count must be an integer between 1 and 500');
  }

  try {
    console.log(`🔄 Starting Reddit user scraping for ${count} users...`);

    const result = await userScraperService.scrapeAndSaveUsers(count);

    return res.status(200).json(
      new ApiResponse(
        200,
        result,
        `Successfully scraped and saved ${result.totalSaved} users`
      )
    );

  } catch (error) {
    console.error('Reddit user scraping failed:', error.message);
    throw new ApiError(500, `User scraping failed: ${error.message}`);
  }
});

/**
 * Get scraping statistics
 */
const getScrapingStats = asyncHandler(async (req, res) => {
  try {
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

    const result = {
      totalUsers,
      platformUsers,
      realUsers,
      breakdown: stats,
      lastUpdated: new Date()
    };

    return res.status(200).json(
      new ApiResponse(200, result, 'User scraping stats fetched successfully')
    );

  } catch (error) {
    throw new ApiError(500, `Failed to fetch scraping stats: ${error.message}`);
  }
});

export {
  scrapeRedditUsers,
  getScrapingStats
};