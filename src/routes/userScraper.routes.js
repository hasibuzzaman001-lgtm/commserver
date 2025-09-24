import { Router } from 'express';
import {
  scrapeRedditUsers,
  getScrapingStats
} from '../controllers/userScraper.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// All user scraper routes require authentication
router.use(verifyJWT);

// Scrape Reddit users
router.route('/scrape-reddit-users').post(scrapeRedditUsers);

// Get scraping statistics
router.route('/stats').get(getScrapingStats);

export default router;