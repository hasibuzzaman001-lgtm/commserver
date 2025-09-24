<<<<<<< HEAD
import { Router } from "express";
import {
  scrapeRedditUsers,
  getScrapingStats,
} from "../controllers/userScraper.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
=======
import { Router } from 'express';
import {
  scrapeRedditUsers,
  getScrapingStats
} from '../controllers/userScraper.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

const router = Router();

// All user scraper routes require authentication
router.use(verifyJWT);

// Scrape Reddit users
<<<<<<< HEAD
router.route("/scrape-reddit-users").post(scrapeRedditUsers);

// Get scraping statistics
router.route("/stats").get(getScrapingStats);

export default router;
=======
router.route('/scrape-reddit-users').post(scrapeRedditUsers);

// Get scraping statistics
router.route('/stats').get(getScrapingStats);

export default router;
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
