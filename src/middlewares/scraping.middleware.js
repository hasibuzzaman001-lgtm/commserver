import { ScraperManager } from "../scrapers/ScraperManager.js";
import { Community } from "../models/community.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const scraperManager = new ScraperManager();

/**
 * Middleware to trigger scraping when GET /posts is called
 * Scrapes 2 new pieces of content from each supported platform
 */
export const autoScrapeMiddleware = asyncHandler(async (req, res, next) => {
  try {
    console.log("🔄 Auto-scraping middleware triggered");
    
    // Run scraping asynchronously to not delay the response
    setImmediate(async () => {
      try {
        await performAutoScraping();
      } catch (error) {
        console.error("❌ Auto-scraping failed:", error.message);
      }
    });
    
    // Continue to the next middleware/route handler immediately
    next();
  } catch (error) {
    console.error("❌ Auto-scraping middleware error:", error.message);
    // Don't block the request even if scraping fails
    next();
  }
});

/**
 * Perform automatic scraping for all active communities
 */
async function performAutoScraping() {
  try {
    const activeCommunities = await Community.find({ 
      isActive: true,
      "scrapingPlatforms.isActive": true 
    }).limit(5); // Limit to 5 communities to avoid overwhelming

    console.log(`🎯 Auto-scraping for ${activeCommunities.length} communities`);

    const scrapingPromises = activeCommunities.map(async (community) => {
      try {
        // Scrape 2 posts per platform for this community
        const result = await scraperManager.scrapeAuthenticContent(community._id, 2);
        console.log(`✅ Auto-scraped ${result.totalPosts} posts for ${community.name}`);
        return result;
      } catch (error) {
        console.error(`❌ Auto-scraping failed for ${community.name}:`, error.message);
        return { communityId: community._id, error: error.message };
      }
    });

    // Execute all scraping operations in parallel
    const results = await Promise.allSettled(scrapingPromises);
    
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`🎯 Auto-scraping completed: ${successful} successful, ${failed} failed`);
  } catch (error) {
    console.error("❌ Auto-scraping process failed:", error.message);
  }
}