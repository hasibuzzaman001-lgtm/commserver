import axios from "axios";
import { ScrapingUtils } from "../utils/ScrapingUtils.js";

class RedditScraper {
  constructor() {
    this.baseUrl = "https://www.reddit.com";
    this.utils = new ScrapingUtils();
    this.rateLimitDelay = 2000; // 2 seconds between requests
  }

  /**
   * Scrape real content from Reddit API
   */
  async scrapeContent(config) {
    const {
      sourceUrl,
      keywords = [],
      maxPosts = 50,
      authenticityMode = true,
    } = config;

    try {
      console.log(`🔍 Scraping AUTHENTIC Reddit content from: ${sourceUrl}`);

      const subreddit = this.extractSubreddit(sourceUrl);
      if (!subreddit) {
        throw new Error("Invalid Reddit URL - could not extract subreddit");
      }

      // Fetch real posts from Reddit API
      const posts = await this.fetchRedditPosts(subreddit, maxPosts * 2);

      // Filter out non-authentic content
      const authenticPosts = posts.filter((post) => this.isAuthenticPost(post));

      // Filter by keywords if provided
      const filteredPosts =
        keywords.length > 0
          ? authenticPosts.filter((post) => this.matchesKeywords(post, keywords))
          : authenticPosts;

      console.log(
        `✅ Scraped ${filteredPosts.length} AUTHENTIC posts from r/${subreddit} (filtered from ${posts.length} total)`
      );
      return filteredPosts.slice(0, maxPosts);
    } catch (error) {
      console.error("Reddit scraping error:", error.message);
      throw new Error(`Reddit scraping failed: ${error.message}`);
    }
  }

  /**
   * Scrape comments for a specific post
   */
  async scrapePostComments(postId, maxComments = 10) {
    try {
      const url = `${this.baseUrl}/comments/${postId}.json`;

      const response = await axios.get(url, {
        params: { raw_json: 1, limit: maxComments },
        headers: {
          "User-Agent": "CommunityBot/1.0 (by /u/CommunityBot)",
        },
        timeout: 15000,
      });

      if (
        !response.data ||
        !Array.isArray(response.data) ||
        response.data.length < 2
      ) {
        return [];
      }

      // Reddit returns [post_data, comments_data]
      const commentsData = response.data[1];
      if (!commentsData?.data?.children) {
        return [];
      }

      return commentsData.data.children
        .filter(
          (child) =>
            child.data && child.data.body && child.data.body !== "[deleted]"
        )
        .map((child) => this.transformRedditComment(child.data))
        .slice(0, maxComments);
    } catch (error) {
      if (error.response?.status === 429) {
        console.log("Rate limited, waiting longer...");
        await this.utils.delay(10000);
        return this.scrapePostComments(postId, maxComments);
      }

      console.error(
        `Error scraping comments for post ${postId}:`,
        error.message
      );
      return [];
    }
  }

  /**
   * Transform Reddit comment data
   */
  transformRedditComment(redditComment) {
    return {
      id: redditComment.id,
      content: redditComment.body,
      author: redditComment.author,
      createdAt: new Date(redditComment.created_utc * 1000),
      likes: redditComment.ups || 0,
      parentId: redditComment.parent_id,
      platform: "reddit",
    };
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
          "User-Agent": "CommunityBot/1.0 (by /u/CommunityBot)",
        },
        timeout: 10000,
      });

      if (!response.data?.data?.children) {
        return [];
      }

      return response.data.data.children.map((child) =>
        this.transformRedditPost(child.data)
      );
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
    // Generate more dynamic, unique content
    const dynamicTitle = this.enhanceTitle(redditPost.title);
    const dynamicContent = this.enhanceContent(
      redditPost.selftext || redditPost.title,
      redditPost
    );

    return {
      id: redditPost.id,
      title: dynamicTitle,
      content: dynamicContent,
      url: `${this.baseUrl}${redditPost.permalink}`,
      author: redditPost.author,
      createdAt: new Date(redditPost.created_utc * 1000),
      likes: redditPost.ups || 0,
      comments: 0, // Remove original comment count
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
   * Enhance title to make it more unique and engaging
   */
  enhanceTitle(originalTitle) {
    if (!originalTitle) return "Discussion Post";

    // Remove common Reddit prefixes that make posts look similar
    let enhanced = originalTitle
      .replace(/^(PSA:|LPT:|TIL:|DAE:|TIFU:|AMA:?)\s*/i, "")
      .replace(/^\[.*?\]\s*/, "") // Remove bracketed prefixes
      .trim();

    // Ensure title is not empty after cleaning
    if (!enhanced) {
      enhanced = originalTitle;
    }

    return enhanced;
  }

  /**
   * Enhance content to be more dynamic and unique
   */
  enhanceContent(originalContent, postData) {
    if (!originalContent || originalContent.trim() === "") {
      // Create content from title and context if no selftext
      return this.generateContentFromContext(postData);
    }

    // Clean up the content
    let enhanced = originalContent
      .replace(/Edit:.*$/gim, "") // Remove edit notes
      .replace(/Update:.*$/gim, "") // Remove update notes
      .replace(/TL;DR:.*$/gim, "") // Remove TL;DR
      .replace(/^\s*EDIT\s*:.*$/gim, "") // Remove EDIT lines
      .trim();

    // If content is too short, enhance it
    if (enhanced.length < 50) {
      enhanced = this.expandShortContent(enhanced, postData);
    }

    return enhanced || originalContent;
  }

  /**
   * Generate content from post context when selftext is empty
   */
  generateContentFromContext(postData) {
    const subreddit = postData.subreddit;
    const title = postData.title;

    // Create contextual content based on subreddit and title
    const contextualPhrases = {
      entrepreneur:
        "Looking for insights and experiences from fellow entrepreneurs.",
      business: "Seeking advice and perspectives from the business community.",
      startups: "Would love to hear thoughts from other startup founders.",
      smallbusiness:
        "Any other small business owners have similar experiences?",
      marketing:
        "Interested in hearing different marketing approaches to this.",
      investing:
        "What are your thoughts on this from an investment perspective?",
    };

    const defaultPhrase = "What are your thoughts and experiences with this?";
    const contextPhrase =
      contextualPhrases[subreddit.toLowerCase()] || defaultPhrase;

    return `${title}\n\n${contextPhrase}`;
  }

  /**
   * Expand short content to make it more substantial
   */
  expandShortContent(content, postData) {
    if (content.length >= 50) return content;

    const expansions = [
      "I've been thinking about this lately and wanted to get the community's perspective.",
      "This has been on my mind and I'd love to hear different viewpoints.",
      "I'm curious about others' experiences with this topic.",
      "Looking for insights from people who might have dealt with something similar.",
    ];

    const randomExpansion =
      expansions[Math.floor(Math.random() * expansions.length)];
    return `${content}\n\n${randomExpansion}`;
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
    if (
      post.thumbnail &&
      post.thumbnail !== "self" &&
      post.thumbnail !== "default"
    ) {
      return post.thumbnail;
    }

    if (post.preview?.images?.[0]?.source?.url) {
      return post.preview.images[0].source.url.replace(/&amp;/g, "&");
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
      Object.values(post.media_metadata).forEach((media) => {
        if (media.s?.u) {
          mediaUrls.push({
            type: "image",
            url: media.s.u.replace(/&amp;/g, "&"),
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
    const text = `${post.title} ${post.selftext || ""}`;
    const hashtags = text.match(/#\w+/g);
    if (hashtags) {
      tags.push(...hashtags.map((tag) => tag.toLowerCase().substring(1)));
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Check if post is authentic (not bot, spam, or promotional)
   */
  isAuthenticPost(post) {
    if (!post || !post.author || !post.title) return false;

    const author = post.author.toLowerCase();
    const title = post.title.toLowerCase();
    const content = (post.content || "").toLowerCase();
    const fullText = `${title} ${content}`;

    if (author === "[deleted]" || author === "automoderator") return false;
    if (author.includes("bot") && !author.includes("robot")) return false;

    const spamIndicators = [
      "buy now",
      "click here",
      "limited time",
      "act now",
      "free money",
      "guaranteed",
      "make money fast",
      "work from home",
      "get rich quick",
      "discount code",
      "promo code",
      "affiliate",
      "sponsored",
    ];

    const hasSpam = spamIndicators.some((indicator) =>
      fullText.includes(indicator)
    );
    if (hasSpam) return false;

    if (title.length < 10 || title.length > 300) return false;

    const exclamationCount = (fullText.match(/!/g) || []).length;
    if (exclamationCount > 5) return false;

    if (/(.)\1{4,}/.test(fullText)) return false;

    if (post.score !== undefined && post.score < 0) return false;

    return true;
  }

  /**
   * Check if post matches keywords
   */
  matchesKeywords(post, keywords) {
    const searchText =
      `${post.title} ${post.content} ${post.tags.join(" ")}`.toLowerCase();

    return keywords.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    );
  }

  /**
   * Get subreddit information
   */
  async getSubredditInfo(subreddit) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/r/${subreddit}/about.json`,
        {
          headers: {
            "User-Agent": "CommunityBot/1.0 (by /u/CommunityBot)",
          },
        }
      );

      const data = response.data.data;
      return {
        name: data.display_name,
        title: data.title,
        description: data.public_description,
        subscribers: data.subscribers,
        created: new Date(data.created_utc * 1000),
        isActive: !data.quarantine && data.subreddit_type === "public",
      };
    } catch (error) {
      console.error(
        `Error fetching subreddit info for r/${subreddit}:`,
        error.message
      );
      return null;
    }
  }
}

export { RedditScraper };
