<<<<<<< HEAD
import axios from "axios";
import { User } from "../models/user.model.js";
import { ScrapingUtils } from "../scrapers/utils/ScrapingUtils.js";
=======
import axios from 'axios';
import { User } from '../models/user.model.js';
import { ScrapingUtils } from '../scrapers/utils/ScrapingUtils.js';
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

class UserScraperService {
  constructor() {
    this.utils = new ScrapingUtils();
    this.rateLimitDelay = 2000; // 2 seconds between requests
    this.userPrefixes = [
<<<<<<< HEAD
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
=======
      'real_', 'pro_', 'biz_', 'tech_', 'smart_', 'cool_', 'new_', 'top_',
      'best_', 'fast_', 'good_', 'nice_', 'big_', 'old_', 'young_', 'fresh_'
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD

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
=======
      
      // Get users from multiple subreddits to ensure diversity
      const subreddits = [
        'entrepreneur', 'business', 'startups', 'smallbusiness',
        'marketing', 'sales', 'investing', 'personalfinance'
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      ];

      let attempts = 0;
      const maxAttempts = subreddits.length * 3; // Try each subreddit up to 3 times

      while (users.length < count && attempts < maxAttempts) {
        const subreddit = subreddits[attempts % subreddits.length];
<<<<<<< HEAD

        try {
          const subredditUsers = await this.scrapeUsersFromSubreddit(
            subreddit,
            25
          );

          for (const userData of subredditUsers) {
            if (users.length >= count) break;

=======
        
        try {
          const subredditUsers = await this.scrapeUsersFromSubreddit(subreddit, 25);
          
          for (const userData of subredditUsers) {
            if (users.length >= count) break;
            
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
            // Check for duplicates
            if (!processedUsernames.has(userData.originalUsername)) {
              processedUsernames.add(userData.originalUsername);
              users.push(userData);
            }
          }

          attempts++;
<<<<<<< HEAD

=======
          
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
          // Rate limiting
          await this.utils.delay(this.rateLimitDelay);
        } catch (error) {
          console.error(`Error scraping from r/${subreddit}:`, error.message);
          attempts++;
        }
      }

      console.log(`✅ Scraped ${users.length} unique users from Reddit`);
      return users.slice(0, count);
<<<<<<< HEAD
    } catch (error) {
      console.error("Error scraping Reddit users:", error.message);
=======

    } catch (error) {
      console.error('Error scraping Reddit users:', error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      throw error;
    }
  }

  /**
   * Scrape users from a specific subreddit
   */
  async scrapeUsersFromSubreddit(subreddit, limit = 25) {
    try {
      const url = `https://www.reddit.com/r/${subreddit}/hot.json`;
<<<<<<< HEAD

      const response = await axios.get(url, {
        params: {
          limit: limit,
          raw_json: 1,
        },
        headers: {
          "User-Agent": "UserScraper/1.0 (by /u/UserScraper)",
        },
        timeout: 10000,
=======
      
      const response = await axios.get(url, {
        params: {
          limit: limit,
          raw_json: 1
        },
        headers: {
          'User-Agent': 'UserScraper/1.0 (by /u/UserScraper)',
        },
        timeout: 10000
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      });

      if (!response.data?.data?.children) {
        return [];
      }

      const users = [];
      const processedAuthors = new Set();

      for (const post of response.data.data.children) {
        const author = post.data.author;
<<<<<<< HEAD

        // Skip deleted/removed authors and duplicates
        if (!author || author === "[deleted]" || processedAuthors.has(author)) {
=======
        
        // Skip deleted/removed authors and duplicates
        if (!author || author === '[deleted]' || processedAuthors.has(author)) {
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD
          console.error(
            `Error fetching profile for u/${author}:`,
            error.message
          );
=======
          console.error(`Error fetching profile for u/${author}:`, error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
          // Continue with other users
        }
      }

      return users;
    } catch (error) {
      if (error.response?.status === 429) {
<<<<<<< HEAD
        console.log("Reddit rate limited, waiting longer...");
=======
        console.log('Reddit rate limited, waiting longer...');
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD

      const response = await axios.get(url, {
        headers: {
          "User-Agent": "UserScraper/1.0 (by /u/UserScraper)",
        },
        timeout: 8000,
=======
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'UserScraper/1.0 (by /u/UserScraper)',
        },
        timeout: 8000
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      });

      const userData = response.data?.data;
      if (!userData) {
        return null;
      }

      // Generate unique username with prefix
      const prefix = this.getRandomPrefix();
      const uniqueUsername = `${prefix}${username.toLowerCase()}`;

      // Get avatar URL or use default
<<<<<<< HEAD
      const avatarUrl =
        userData.icon_img ||
        userData.snoovatar_img ||
        this.generateDefaultAvatar(username);
=======
      const avatarUrl = userData.icon_img || 
                       userData.snoovatar_img || 
                       this.generateDefaultAvatar(username);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

      return {
        originalUsername: username,
        username: uniqueUsername,
        fullName: this.generateFullName(username),
        avatar: avatarUrl,
<<<<<<< HEAD
        userType: "platform",
=======
        userType: 'platform',
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        redditData: {
          karma: userData.total_karma || 0,
          accountCreated: new Date(userData.created_utc * 1000),
          isVerified: userData.verified || false,
<<<<<<< HEAD
          hasGold: userData.is_gold || false,
        },
      };
=======
          hasGold: userData.is_gold || false
        }
      };

>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD
    return this.userPrefixes[
      Math.floor(Math.random() * this.userPrefixes.length)
    ];
=======
    return this.userPrefixes[Math.floor(Math.random() * this.userPrefixes.length)];
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
  }

  /**
   * Generate realistic full name from username
   */
  generateFullName(username) {
    const firstNames = [
<<<<<<< HEAD
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
=======
      'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
      'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Hayden', 'Jamie'
    ];
    
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas'
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
<<<<<<< HEAD

=======
    
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD
            { email: `${userData.username}@example.com` },
          ],
=======
            { email: `${userData.username}@example.com` }
          ]
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD
          password: "defaultpassword123", // This will be hashed by the pre-save hook
=======
          password: 'defaultpassword123' // This will be hashed by the pre-save hook
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        });

        savedUsers.push(user);
        console.log(`✅ Saved user: ${userData.username}`);
<<<<<<< HEAD
=======

>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      } catch (error) {
        console.error(`Error saving user ${userData.username}:`, error.message);
        errors.push({
          username: userData.username,
<<<<<<< HEAD
          error: error.message,
=======
          error: error.message
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        });
      }
    }

    return {
      savedUsers,
      errors,
      totalSaved: savedUsers.length,
<<<<<<< HEAD
      totalErrors: errors.length,
=======
      totalErrors: errors.length
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
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
<<<<<<< HEAD

      if (scrapedUsers.length === 0) {
        throw new Error("No users were scraped");
=======
      
      if (scrapedUsers.length === 0) {
        throw new Error('No users were scraped');
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      }

      // Save to database
      const result = await this.saveUsersToDatabase(scrapedUsers);

<<<<<<< HEAD
      console.log(
        `✅ User scraping completed: ${result.totalSaved} saved, ${result.totalErrors} errors`
      );

=======
      console.log(`✅ User scraping completed: ${result.totalSaved} saved, ${result.totalErrors} errors`);
      
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      return {
        success: true,
        totalScraped: scrapedUsers.length,
        totalSaved: result.totalSaved,
        totalErrors: result.totalErrors,
<<<<<<< HEAD
        errors: result.errors,
      };
    } catch (error) {
      console.error("Error in scrape and save users process:", error.message);
=======
        errors: result.errors
      };

    } catch (error) {
      console.error('Error in scrape and save users process:', error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      throw error;
    }
  }
}

<<<<<<< HEAD
export { UserScraperService };
=======
export { UserScraperService };
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
