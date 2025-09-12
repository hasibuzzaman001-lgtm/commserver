import axios from "axios";
import { ScrapingUtils } from "../utils/ScrapingUtils.js";

class RedditScraper {
  constructor() {
    this.baseUrl = "https://www.reddit.com";
    this.utils = new ScrapingUtils();
    this.rateLimitDelay = 2000; // 2 seconds between requests
  }

  /**
   * Scrape authentic content from Reddit with enhanced validation
   */
  async scrapeAuthenticContent(config) {
    const { sourceUrl, keywords = [], maxPosts = 50, authenticityMode = true } = config;
    
    try {
      console.log(`🔍 Scraping authentic Reddit content: ${sourceUrl}`);
      
      const subreddit = this.extractSubreddit(sourceUrl);
      if (!subreddit) {
        throw new Error("Invalid Reddit URL - could not extract subreddit");
      }

      const posts = [];
      let after = null;
      let fetchedCount = 0;

      // Fetch posts with authenticity focus
      while (fetchedCount < maxPosts * 2) { // Get more to filter for authenticity
        const batchSize = Math.min(25, maxPosts * 2 - fetchedCount);
        const batchPosts = await this.fetchAuthenticRedditPosts(subreddit, batchSize, after);
        
        if (batchPosts.length === 0) break;

        // Filter for authentic content
        const authenticPosts = batchPosts.filter(post => this.isAuthenticRedditPost(post));
        
        // Apply keyword filtering if provided
        const filteredPosts = keywords.length > 0 
          ? authenticPosts.filter(post => this.matchesKeywords(post, keywords))
          : authenticPosts;

        posts.push(...filteredPosts);
        fetchedCount += batchPosts.length;
        
        after = batchPosts[batchPosts.length - 1]?.name;
        
        // Stop if we have enough authentic posts
        if (posts.length >= maxPosts) break;
        
        await this.utils.delay(this.rateLimitDelay);
      }

      console.log(`✅ Scraped ${posts.length} authentic posts from r/${subreddit}`);
      return posts.slice(0, maxPosts);

    } catch (error) {
      console.error("Reddit authentic scraping error:", error.message);
      throw new Error(`Reddit authentic scraping failed: ${error.message}`);
    }
  }

  /**
   * Fetch authentic Reddit posts with enhanced filtering
   */
  async fetchAuthenticRedditPosts(subreddit, limit = 25, after = null) {
    try {
      const url = `${this.baseUrl}/r/${subreddit}/hot.json`;
      const params = {
        limit,
        raw_json: 1,
      };
      
      if (after) {
        params.after = after;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'User-Agent': 'AuthenticContentBot/2.0 (by /u/CommunityBot)',
        },
        timeout: 15000,
      });

      if (!response.data?.data?.children) {
        return [];
      }

      return response.data.data.children
        .map(child => this.transformRedditPost(child.data))
        .filter(post => post !== null);

    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Rate limited, waiting longer...");
        await this.utils.delay(10000);
        return this.fetchAuthenticRedditPosts(subreddit, limit, after);
      }
      
      throw error;
    }
  }

  /**
   * Check if Reddit post is authentic
   */
  isAuthenticRedditPost(post) {
    // Filter out deleted/removed posts
    if (post.author === '[deleted]' || post.content === '[removed]' || post.content === '[deleted]') {
      return false;
    }

    // Filter out posts with suspicious patterns
    if (post.title.includes('[removed]') || post.title.includes('[deleted]')) {
      return false;
    }

    // Filter out very low effort posts
    if (post.title.length < 10 || (post.content && post.content.length < 20)) {
      return false;
    }

    // Filter out posts with suspicious engagement (too perfect ratios)
    if (post.likes > 1000 && post.comments === 0) {
      return false;
    }

    // Filter out obvious spam/promotional content
    const spamIndicators = ['buy now', 'click here', 'limited time', 'free money', 'guaranteed'];
    const fullText = `${post.title} ${post.content}`.toLowerCase();
    
    if (spamIndicators.some(indicator => fullText.includes(indicator))) {
      return false;
    }

    // Check for minimum engagement to ensure it's not a bot post
    if (post.likes < 2 && post.comments === 0) {
      return false;
    }

    return true;
  }

  /**
   * Scrape content from Reddit
   */
  async scrapeContent(config) {
    const { sourceUrl, keywords = [], maxPosts = 50 } = config;
    
    try {
      console.log(`Scraping Reddit: ${sourceUrl}`);
      
      // Extract subreddit from URL
      const subreddit = this.extractSubreddit(sourceUrl);
      if (!subreddit) {
        throw new Error("Invalid Reddit URL - could not extract subreddit");
      }

      const posts = [];
      let after = null;
      let fetchedCount = 0;

      // Fetch posts in batches
      while (fetchedCount < maxPosts) {
        const batchSize = Math.min(25, maxPosts - fetchedCount);
        const batchPosts = await this.fetchRedditPosts(subreddit, batchSize, after);
        
        if (batchPosts.length === 0) break;

        // Filter posts by keywords if provided
        const filteredPosts = keywords.length > 0 
          ? batchPosts.filter(post => this.matchesKeywords(post, keywords))
          : batchPosts;

        posts.push(...filteredPosts);
        fetchedCount += batchPosts.length;
        
        // Get pagination token
        after = batchPosts[batchPosts.length - 1]?.name;
        
        // Rate limiting
        await this.utils.delay(this.rateLimitDelay);
      }

      console.log(`Scraped ${posts.length} posts from r/${subreddit}`);
      return posts.slice(0, maxPosts);

    } catch (error) {
      console.error("Reddit scraping error:", error.message);
      throw new Error(`Reddit scraping failed: ${error.message}`);
    }
  }

  /**
   * Fetch posts from Reddit API
   */
  async fetchRedditPosts(subreddit, limit = 25, after = null) {
    try {
      const url = `${this.baseUrl}/r/${subreddit}/hot.json`;
      const params = {
        limit,
        raw_json: 1,
      };
      
      if (after) {
        params.after = after;
      }

      const response = await axios.get(url, {
        params,
        headers: {
          'User-Agent': 'CommunityBot/1.0 (by /u/CommunityBot)',
        },
        timeout: 10000,
      });

      if (!response.data?.data?.children) {
        return [];
      }

      return response.data.data.children.map(child => this.transformRedditPost(child.data));

    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Rate limited, waiting longer...");
        await this.utils.delay(5000);
        return this.fetchRedditPosts(subreddit, limit, after);
      }
      
      throw error;
    }
  }

  /**
   * Transform Reddit post data to our standard format
   */
  transformRedditPost(redditPost) {
    return {
      id: redditPost.id,
      title: redditPost.title,
      content: redditPost.selftext || redditPost.title,
      url: `${this.baseUrl}${redditPost.permalink}`,
      author: redditPost.author,
      createdAt: new Date(redditPost.created_utc * 1000),
      likes: redditPost.ups || 0,
      comments: redditPost.num_comments || 0,
      shares: redditPost.num_crossposts || 0,
      views: 0, // Reddit doesn't provide view counts
      thumbnail: this.extractThumbnail(redditPost),
      mediaUrls: this.extractMediaUrls(redditPost),
      tags: this.extractTags(redditPost),
      platform: "reddit",
      subreddit: redditPost.subreddit,
      score: redditPost.score || 0,
      upvoteRatio: redditPost.upvote_ratio || 0,
    };
  }

  /**
   * Extract subreddit name from URL
   */
  extractSubreddit(url) {
    const match = url.match(/\/r\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  /**
   * Extract thumbnail URL
   */
  extractThumbnail(post) {
    if (post.thumbnail && post.thumbnail !== "self" && post.thumbnail !== "default") {
      return post.thumbnail;
    }
    
    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    
    return null;
  }

  /**
   * Extract media URLs
   */
  extractMediaUrls(post) {
    const mediaUrls = [];
    
    // Image posts
    if (post.url && this.utils.isImageUrl(post.url)) {
      mediaUrls.push({
        type: "image",
        url: post.url,
      });
    }
    
    // Video posts
    if (post.is_video && post.media?.reddit_video?.fallback_url) {
      mediaUrls.push({
        type: "video",
        url: post.media.reddit_video.fallback_url,
      });
    }
    
    // Gallery posts
    if (post.is_gallery && post.media_metadata) {
      Object.values(post.media_metadata).forEach(media => {
        if (media.s?.u) {
          mediaUrls.push({
            type: "image",
            url: media.s.u.replace(/&amp;/g, '&'),
          });
        }
      });
    }
    
    return mediaUrls;
  }

  /**
   * Extract tags from post
   */
  extractTags(post) {
    const tags = [];
    
    // Add subreddit as tag
    if (post.subreddit) {
      tags.push(post.subreddit.toLowerCase());
    }
    
    // Add flair as tag
    if (post.link_flair_text) {
      tags.push(post.link_flair_text.toLowerCase());
    }
    
    // Extract hashtags from title and content
    const text = `${post.title} ${post.selftext || ''}`;
    const hashtags = text.match(/#\w+/g);
    if (hashtags) {
      tags.push(...hashtags.map(tag => tag.toLowerCase().substring(1)));
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Check if post matches keywords
   */
  matchesKeywords(post, keywords) {
    const searchText = `${post.title} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
    
    return keywords.some(keyword => 
      searchText.includes(keyword.toLowerCase())
    );
  }

  /**
   * Get subreddit information
   */
  async getSubredditInfo(subreddit) {
    try {
      const response = await axios.get(`${this.baseUrl}/r/${subreddit}/about.json`, {
        headers: {
          'User-Agent': 'CommunityBot/1.0 (by /u/CommunityBot)',
        },
      });

      const data = response.data.data;
      return {
        name: data.display_name,
        title: data.title,
        description: data.public_description,
        subscribers: data.subscribers,
        created: new Date(data.created_utc * 1000),
        isActive: !data.quarantine && data.subreddit_type === 'public',
      };
    } catch (error) {
      console.error(`Error fetching subreddit info for r/${subreddit}:`, error.message);
      return null;
    }
  }
}

export { RedditScraper };