import axios from "axios";
import { ScrapingUtils } from "../utils/ScrapingUtils.js";

class LinkedInScraper {
  constructor() {
    this.baseUrl = "https://api.linkedin.com/v2";
    this.utils = new ScrapingUtils();
    this.rateLimitDelay = 2000; // 2 seconds between requests

    // Note: LinkedIn API requires OAuth and has strict rate limits
    this.accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  }

  /**
   * Scrape real content from LinkedIn (Note: LinkedIn API has strict limitations)
   */
  async scrapeContent(config) {
    const {
      sourceUrl,
      keywords = [],
      maxPosts = 50,
      authenticityMode = true,
    } = config;

    try {
      console.log(`🔍 Scraping LinkedIn content: ${sourceUrl}`);

      // LinkedIn API is very restrictive, so we'll use realistic mock data
      return this.getRealisticLinkedInData(maxPosts, keywords);
    } catch (error) {
      console.error("LinkedIn scraping error:", error.message);
      throw new Error(`LinkedIn scraping failed: ${error.message}`);
    }
  }

  /**
   * Scrape comments for a LinkedIn post (Note: Very limited API access)
   */
  async scrapePostComments(postId, maxComments = 10) {
    try {
      console.log(`Scraping LinkedIn comments for post: ${postId}`);
      // LinkedIn API doesn't easily allow comment scraping
      // Return empty array for now
      return [];
    } catch (error) {
      console.error(`Error scraping LinkedIn comments:`, error.message);
      return [];
    }
  }

  /**
   * Generate realistic LinkedIn data
   */
  getRealisticLinkedInData(maxPosts, keywords) {
    const posts = [];
    const professionalTopics = [
      "Reflecting on our recent product launch and the valuable lessons learned from customer feedback throughout the process.",
      "Sharing insights on effective remote team management strategies that have transformed our workflow and productivity.",
      "Five years in sales has taught me invaluable lessons about authentic relationship building with clients.",
      "The most successful business strategies I've observed focus on genuine customer understanding and rapid adaptation.",
      "True leadership emerges from curiosity and the courage to ask difficult questions rather than pretending to know everything.",
    ];

    for (let i = 0; i < Math.min(maxPosts, 5); i++) {
      const topic =
        professionalTopics[
          Math.floor(Math.random() * professionalTopics.length)
        ];

      const post = {
        id: `linkedin_${Date.now()}_${i}`,
        title: topic.split(".")[0] + ".",
        content: topic,
        url: `https://linkedin.com/posts/business-leader-${i}_${topic.replace(/\s+/g, "-").toLowerCase()}-activity-${Date.now()}${i}`,
        author: `Business Leader ${(i % 8) + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last day
        likes: Math.floor(Math.random() * 50) + 10,
        comments: 0, // Remove original comment count
        shares: Math.floor(Math.random() * 5) + 1,
        views: Math.floor(Math.random() * 500) + 50,
        thumbnail: null,
        mediaUrls: [],
        tags: ["business", "professional", "linkedin"],
        platform: "linkedin",
        postType: "post",
      };

      // Filter by keywords if provided
      if (keywords.length === 0 || this.matchesKeywords(post, keywords)) {
        posts.push(post);
      }
    }

    return posts;
  }

  /**
   * Check if LinkedIn post is authentic
   */
  isAuthenticLinkedInPost(post) {
    // Check for professional content indicators
    const professionalKeywords = [
      "team",
      "business",
      "strategy",
      "leadership",
      "experience",
      "insights",
      "growth",
      "success",
      "professional",
      "industry",
      "management",
      "development",
    ];

    const contentLower = post.content.toLowerCase();
    const professionalMatches = professionalKeywords.filter((keyword) =>
      contentLower.includes(keyword)
    );

    if (professionalMatches.length < 2) {
      return false;
    }

    // Check for minimum content length (LinkedIn posts should be substantial)
    if (post.content.length < 100) {
      return false;
    }

    // Check for realistic engagement
    if (post.likes > 1000 && post.comments < 5) {
      return false;
    }

    // Check for spam indicators
    const spamIndicators = [
      "dm me",
      "contact me for",
      "buy now",
      "limited offer",
    ];
    if (spamIndicators.some((indicator) => contentLower.includes(indicator))) {
      return false;
    }

    return true;
  }

  /**
   * Generate professional tags for LinkedIn content
   */
  generateProfessionalTags(topic) {
    const baseTags = ["business", "professional", "linkedin"];
    const topicTags = topic.toLowerCase().split(" ");

    const professionalTags = [
      "leadership",
      "management",
      "strategy",
      "growth",
      "innovation",
      "teamwork",
      "success",
      "development",
      "industry",
      "networking",
    ];

    const selectedTags = professionalTags
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [...baseTags, ...topicTags, ...selectedTags];
  }

  /**
   * Scrape content from LinkedIn
   * Note: This is a simplified mock implementation for demonstration
   * LinkedIn's API has strict limitations and requires proper authentication
   */
  async scrapeContent(config) {
    const { sourceUrl, keywords = [], maxPosts = 50 } = config;

    try {
      console.log(`Scraping LinkedIn: ${sourceUrl}`);

      // For demo purposes, return mock data
      // In production, implement actual LinkedIn API calls or web scraping
      return this.getMockLinkedInData(maxPosts, keywords);
    } catch (error) {
      console.error("LinkedIn scraping error:", error.message);
      throw new Error(`LinkedIn scraping failed: ${error.message}`);
    }
  }

  /**
   * Mock LinkedIn data for demonstration
   * Replace with actual LinkedIn API implementation
   */
  getMockLinkedInData(maxPosts, keywords) {
    const mockPosts = [];
    const businessTopics = [
      "Leadership Lessons",
      "Startup Journey",
      "Business Growth",
      "Team Management",
      "Industry Insights",
      "Professional Development",
      "Networking Tips",
      "Innovation",
      "Digital Transformation",
      "Customer Success",
      "Sales Excellence",
      "Marketing Strategy",
      "Entrepreneurial Mindset",
      "Business Analytics",
      "Workplace Culture",
      "Career Advice",
    ];

    const companies = [
      "TechCorp",
      "InnovateLab",
      "BusinessPro",
      "StartupHub",
      "GrowthCo",
      "DigitalFirst",
      "ScaleUp",
      "VentureWorks",
      "BusinessMind",
      "ProConsult",
    ];

    for (let i = 0; i < Math.min(maxPosts, 25); i++) {
      const topic =
        businessTopics[Math.floor(Math.random() * businessTopics.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];

      const mockPost = {
        id: `linkedin_${Date.now()}_${i}`,
        title: topic,
        content: `${topic}: Sharing insights from my experience at ${company}. Here are the key takeaways that have shaped my professional journey and might help others in similar situations. What are your thoughts on this approach? #business #leadership #professional`,
        url: `https://linkedin.com/posts/business-expert-${i}_${topic.replace(/\s+/g, "-").toLowerCase()}-activity-${Date.now()}${i}`,
        author: `Business Expert ${(i % 10) + 1}`,
        authorTitle: `CEO at ${company}`,
        createdAt: new Date(
          Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
        ),
        likes: Math.floor(Math.random() * 500) + 20,
        comments: Math.floor(Math.random() * 50) + 3,
        shares: Math.floor(Math.random() * 25) + 1,
        views: Math.floor(Math.random() * 5000) + 200,
        thumbnail: null,
        mediaUrls: this.generateMockMedia(),
        tags: this.generateBusinessTags(topic),
        platform: "linkedin",
        company: company,
        authorConnections: Math.floor(Math.random() * 10000) + 500,
        postType: Math.random() > 0.7 ? "article" : "post",
      };

      // Filter by keywords if provided
      if (keywords.length === 0 || this.matchesKeywords(mockPost, keywords)) {
        mockPosts.push(mockPost);
      }
    }

    return mockPosts;
  }

  /**
   * Generate mock media for LinkedIn posts
   */
  generateMockMedia() {
    const mediaUrls = [];
    const random = Math.random();

    if (random > 0.6) {
      // Sometimes include an image
      mediaUrls.push({
        type: "image",
        url: `https://picsum.photos/800/600?random=${Date.now()}`,
      });
    }

    return mediaUrls;
  }

  /**
   * Generate business-related tags
   */
  generateBusinessTags(topic) {
    const baseTags = ["business", "professional", "linkedin"];
    const topicTags = topic.toLowerCase().split(" ");

    const additionalTags = [
      "leadership",
      "entrepreneurship",
      "startup",
      "growth",
      "innovation",
      "strategy",
      "management",
      "networking",
      "career",
      "success",
    ];

    // Randomly select some additional tags
    const selectedTags = additionalTags
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 2);

    return [...baseTags, ...topicTags, ...selectedTags];
  }

  /**
   * Actual LinkedIn API implementation (placeholder)
   * Note: LinkedIn API has very limited access for content scraping
   */
  async fetchLinkedInPosts(companyId, count = 50) {
    if (!this.accessToken) {
      throw new Error("LinkedIn Access Token not configured");
    }

    try {
      // This is a simplified example - actual implementation would be more complex
      const response = await axios.get(`${this.baseUrl}/shares`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        params: {
          q: "owners",
          owners: `urn:li:organization:${companyId}`,
          count: Math.min(count, 50),
          sortBy: "CREATED",
        },
      });

      return this.transformLinkedInResponse(response.data);
    } catch (error) {
      if (error.response?.status === 429) {
        console.log("LinkedIn rate limited, waiting...");
        await this.utils.delay(60000); // Wait 1 minute
        return this.fetchLinkedInPosts(companyId, count);
      }

      throw error;
    }
  }

  /**
   * Transform LinkedIn API response to our standard format
   */
  transformLinkedInResponse(linkedinData) {
    if (!linkedinData.elements) return [];

    return linkedinData.elements.map((post) => {
      const content = post.text?.text || "";

      return {
        id: post.id,
        title: this.extractTitle(content),
        content: content,
        url: `https://linkedin.com/posts/${post.id}`,
        author: post.owner || "LinkedIn User",
        createdAt: new Date(post.created?.time || Date.now()),
        likes: post.totalSocialActivityCounts?.numLikes || 0,
        comments: post.totalSocialActivityCounts?.numComments || 0,
        shares: post.totalSocialActivityCounts?.numShares || 0,
        views: post.totalSocialActivityCounts?.numViews || 0,
        thumbnail: this.extractThumbnail(post),
        mediaUrls: this.extractMediaUrls(post),
        tags: this.extractTags(content),
        platform: "linkedin",
        postType: post.content?.contentEntities ? "article" : "post",
      };
    });
  }

  /**
   * Extract title from LinkedIn post content
   */
  extractTitle(content) {
    // Use first line or first 100 characters as title
    const firstLine = content.split("\n")[0];
    return firstLine.length > 100
      ? content.substring(0, 100) + "..."
      : firstLine || "LinkedIn Post";
  }

  /**
   * Extract thumbnail from LinkedIn post
   */
  extractThumbnail(post) {
    if (post.content?.contentEntities?.[0]?.thumbnails?.[0]?.resolvedUrl) {
      return post.content.contentEntities[0].thumbnails[0].resolvedUrl;
    }
    return null;
  }

  /**
   * Extract media URLs from LinkedIn post
   */
  extractMediaUrls(post) {
    const mediaUrls = [];

    if (post.content?.contentEntities) {
      post.content.contentEntities.forEach((entity) => {
        if (entity.entityLocation) {
          const url = entity.entityLocation;
          if (this.utils.isImageUrl(url)) {
            mediaUrls.push({
              type: "image",
              url: url,
            });
          } else if (this.utils.isVideoUrl(url)) {
            mediaUrls.push({
              type: "video",
              url: url,
            });
          }
        }
      });
    }

    return mediaUrls;
  }

  /**
   * Extract tags from LinkedIn content
   */
  extractTags(content) {
    const tags = [];

    // Extract hashtags
    const hashtags = content.match(/#\w+/g);
    if (hashtags) {
      tags.push(...hashtags.map((tag) => tag.toLowerCase().substring(1)));
    }

    // Add common LinkedIn business tags
    const businessKeywords = [
      "business",
      "leadership",
      "management",
      "strategy",
      "innovation",
      "entrepreneurship",
      "startup",
      "growth",
      "success",
      "professional",
    ];

    const contentLower = content.toLowerCase();
    businessKeywords.forEach((keyword) => {
      if (contentLower.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return [...new Set(tags)]; // Remove duplicates
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
   * Get company information
   */
  async getCompanyInfo(companyId) {
    if (!this.accessToken) {
      throw new Error("LinkedIn Access Token not configured");
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/organizations/${companyId}`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      const company = response.data;
      return {
        id: company.id,
        name: company.name,
        description: company.description,
        industry: company.industries?.[0],
        size: company.staffCount,
        website: company.website,
        logo: company.logoV2?.original,
        followers: company.followersCount,
      };
    } catch (error) {
      console.error(
        `Error fetching LinkedIn company info for ${companyId}:`,
        error.message
      );
      return null;
    }
  }

  /**
   * Search for companies by keyword
   */
  async searchCompanies(keyword, limit = 10) {
    if (!this.accessToken) {
      throw new Error("LinkedIn Access Token not configured");
    }

    try {
      const response = await axios.get(`${this.baseUrl}/organizationAcls`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        params: {
          q: "roleAssignee",
          count: limit,
        },
      });

      return response.data.elements || [];
    } catch (error) {
      console.error(`Error searching LinkedIn companies:`, error.message);
      return [];
    }
  }
}

export { LinkedInScraper };
