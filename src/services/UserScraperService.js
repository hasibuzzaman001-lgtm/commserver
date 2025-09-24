import axios from "axios";
import { User } from "../models/user.model.js";
import { ScrapingUtils } from "../scrapers/utils/ScrapingUtils.js";

class UserScraperService {
  constructor() {
    this.utils = new ScrapingUtils();
    this.rateLimitDelay = 2000; // 2 seconds between requests
    this.userPrefixes = [
      "real_",
      "pro_",
      "biz_",
      "tech_",
      "smart_",
      "cool_",
      "new_",
      "top_",
      "best_",
      "fast_",
      "good_",
      "nice_",
      "big_",
      "old_",
      "young_",
      "fresh_",
    ];
  }

  /**
   * Scrape Reddit users from US
   */
  async scrapeRedditUsers(count = 100) {
    try {
      console.log(`🔍 Starting to scrape ${count} Reddit users from US...`);

      const users = [];
      const processedUsernames = new Set();

      // Get users from multiple subreddits to ensure diversity
      const subreddits = [
        "entrepreneur",
        "business",
        "startups",
        "smallbusiness",
        "marketing",
        "sales",
        "investing",
        "personalfinance",
      ];

      let attempts = 0;
      const maxAttempts = subreddits.length * 3; // Try each subreddit up to 3 times

      while (users.length < count && attempts < maxAttempts) {
        const subreddit = subreddits[attempts % subreddits.length];

        try {
          const subredditUsers = await this.scrapeUsersFromSubreddit(
            subreddit,
            25
          );

          for (const userData of subredditUsers) {
            if (users.length >= count) break;

            // Check for duplicates
            if (!processedUsernames.has(userData.originalUsername)) {
              processedUsernames.add(userData.originalUsername);
              users.push(userData);
            }
          }

          attempts++;

          // Rate limiting
          await this.utils.delay(this.rateLimitDelay);
        } catch (error) {
          console.error(`Error scraping from r/${subreddit}:`, error.message);
          attempts++;
        }
      }

      console.log(`✅ Scraped ${users.length} unique users from Reddit`);
      return users.slice(0, count);
    } catch (error) {
      console.error("Error scraping Reddit users:", error.message);
      throw error;
    }
  }

  /**
   * Scrape users from a specific subreddit
   */
  async scrapeUsersFromSubreddit(subreddit, limit = 25) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/hot.json`;

      const response = await axios.get(url, {
        params: {
          limit: limit,
          raw_json: 1,
        },
        headers: {
          "User-Agent": "UserScraper/1.0 (by /u/UserScraper)",
        },
        timeout: 10000,
      });

      if (!response.data?.data?.children) {
        return [];
      }

      const users = [];
      const processedAuthors = new Set();

      for (const post of response.data.data.children) {
        const author = post.data.author;

        // Skip deleted/removed authors and duplicates
        if (!author || author === "[deleted]" || processedAuthors.has(author)) {
          continue;
        }

        processedAuthors.add(author);

        try {
          const userProfile = await this.fetchRedditUserProfile(author);
          if (userProfile) {
            users.push(userProfile);
          }

          // Rate limiting between user profile requests
          await this.utils.delay(500);
        } catch (error) {
          console.error(
            `Error fetching profile for u/${author}:`,
            error.message
          );
          // Continue with other users
        }
      }

      return users;
    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Reddit rate limited, waiting longer...");
        await this.utils.delay(10000);
        throw error;
      }
      throw error;
    }
  }

  /**
   * Fetch individual Reddit user profile
   */
  async fetchRedditUserProfile(username) {
    try {
      const url = `https://www.reddit.com/user/${username}/about.json`;

      const response = await axios.get(url, {
        headers: {
          "User-Agent": "UserScraper/1.0 (by /u/UserScraper)",
        },
        timeout: 8000,
      });

      const userData = response.data?.data;
      if (!userData) {
        return null;
      }

      // Generate unique username with prefix
      const prefix = this.getRandomPrefix();
      const uniqueUsername = `${prefix}${username.toLowerCase()}`;

      // Get avatar URL or use default
      const avatarUrl =
        userData.icon_img ||
        userData.snoovatar_img ||
        this.generateDefaultAvatar(username);

      return {
        originalUsername: username,
        username: uniqueUsername,
        fullName: this.generateFullName(username),
        avatar: avatarUrl,
        userType: "platform",
        redditData: {
          karma: userData.total_karma || 0,
          accountCreated: new Date(userData.created_utc * 1000),
          isVerified: userData.verified || false,
          hasGold: userData.is_gold || false,
        },
      };
    } catch (error) {
      if (error.response?.status === 404) {
        // User not found or suspended
        return null;
      }
      throw error;
    }
  }

  /**
   * Get random prefix for username
   */
  getRandomPrefix() {
    return this.userPrefixes[
      Math.floor(Math.random() * this.userPrefixes.length)
    ];
  }

  /**
   * Generate realistic full name from username
   */
  generateFullName(username) {
    const firstNames = [
      "Alex",
      "Jordan",
      "Taylor",
      "Casey",
      "Morgan",
      "Riley",
      "Avery",
      "Quinn",
      "Blake",
      "Cameron",
      "Drew",
      "Emery",
      "Finley",
      "Harper",
      "Hayden",
      "Jamie",
    ];

    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  /**
   * Generate default avatar URL
   */
  generateDefaultAvatar(username) {
    // Use a service that generates avatars based on username
    const seed = username.toLowerCase();
    return `https://api.dicebear.com/7.x/avataaars/png?seed=${seed}&size=200`;
  }

  /**
   * Save scraped users to database
   */
  async saveUsersToDatabase(users) {
    const savedUsers = [];
    const errors = [];

    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({
          $or: [
            { username: userData.username },
            { email: `${userData.username}@example.com` },
          ],
        });

        if (existingUser) {
          console.log(`User ${userData.username} already exists, skipping...`);
          continue;
        }

        // Create user with default password
        const user = await User.create({
          username: userData.username,
          email: `${userData.username}@example.com`,
          fullName: userData.fullName,
          avatar: userData.avatar,
          userType: userData.userType,
          password: "defaultpassword123", // This will be hashed by the pre-save hook
        });

        savedUsers.push(user);
        console.log(`✅ Saved user: ${userData.username}`);
      } catch (error) {
        console.error(`Error saving user ${userData.username}:`, error.message);
        errors.push({
          username: userData.username,
          error: error.message,
        });
      }
    }

    return {
      savedUsers,
      errors,
      totalSaved: savedUsers.length,
      totalErrors: errors.length,
    };
  }

  /**
   * Main function to scrape and save users
   */
  async scrapeAndSaveUsers(count = 100) {
    try {
      console.log(`🚀 Starting user scraping process for ${count} users...`);

      // Scrape users
      const scrapedUsers = await this.scrapeRedditUsers(count);

      if (scrapedUsers.length === 0) {
        throw new Error("No users were scraped");
      }

      // Save to database
      const result = await this.saveUsersToDatabase(scrapedUsers);

      console.log(
        `✅ User scraping completed: ${result.totalSaved} saved, ${result.totalErrors} errors`
      );

      return {
        success: true,
        totalScraped: scrapedUsers.length,
        totalSaved: result.totalSaved,
        totalErrors: result.totalErrors,
        errors: result.errors,
      };
    } catch (error) {
      console.error("Error in scrape and save users process:", error.message);
      throw error;
    }
  }
}

export { UserScraperService };
