import { ScrapingUtils } from "./ScrapingUtils.js";

class ContentProcessor {
  constructor() {
    this.utils = new ScrapingUtils();
    this.minContentLength = 50;
    this.maxContentLength = 5000;
    this.minTitleLength = 10;
    this.maxTitleLength = 200;
  }

  /**
   * Calculate quality score for scraped content
   */
  calculateQualityScore(content) {
    let score = 0.5; // Base score

    // Content length scoring
    const contentLength = content.content?.length || 0;
    if (
      contentLength >= this.minContentLength &&
      contentLength <= this.maxContentLength
    ) {
      score += 0.2;
    } else if (contentLength < this.minContentLength) {
      score -= 0.3;
    }

    // Title quality scoring
    const titleLength = content.title?.length || 0;
    if (
      titleLength >= this.minTitleLength &&
      titleLength <= this.maxTitleLength
    ) {
      score += 0.1;
    } else {
      score -= 0.2;
    }

    // Engagement scoring
    const totalEngagement =
      (content.likes || 0) + (content.comments || 0) + (content.shares || 0);
    if (totalEngagement > 50) {
      score += 0.2;
    } else if (totalEngagement > 10) {
      score += 0.1;
    }

    // Spam detection
    if (
      this.utils.isLikelySpam(content.content) ||
      this.utils.isLikelySpam(content.title)
    ) {
      score -= 0.4;
    }

    // Content freshness (newer content gets higher score)
    if (content.createdAt) {
      const daysSinceCreation =
        (Date.now() - new Date(content.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceCreation <= 1) {
        score += 0.1;
      } else if (daysSinceCreation <= 7) {
        score += 0.05;
      }
    }

    // Has media content
    if (content.mediaUrls && content.mediaUrls.length > 0) {
      score += 0.1;
    }

    // Author credibility (basic check)
    if (
      content.author &&
      content.author !== "unknown" &&
      content.author.length > 3
    ) {
      score += 0.05;
    }

    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Process authentic content with enhanced validation
   */
  processAuthenticContent(content) {
    const processed = this.processContent(content);

    // Add authenticity-specific processing
    processed.contentType = this.classifyContentType(content);
    processed.authorInfo = this.processAuthorInfo(content);
    processed.engagementAnalysis = this.analyzeEngagement(content);
    processed.contentFingerprint = this.generateContentFingerprint(content);

    return processed;
  }

  /**
   * Classify content type more accurately
   */
  classifyContentType(content) {
    const text =
      `${content.title || ""} ${content.content || ""}`.toLowerCase();

    // Educational content
    if (
      text.includes("how to") ||
      text.includes("tutorial") ||
      text.includes("learn") ||
      text.includes("guide")
    ) {
      return "educational";
    }

    // News content
    if (
      text.includes("breaking") ||
      text.includes("announced") ||
      text.includes("reports") ||
      text.includes("according to")
    ) {
      return "news";
    }

    // Discussion/Question
    if (
      text.includes("what do you think") ||
      text.includes("thoughts?") ||
      text.includes("discuss") ||
      text.includes("question")
    ) {
      return "discussion";
    }

    // Personal experience
    if (
      text.includes("my experience") ||
      text.includes("i learned") ||
      text.includes("personal story") ||
      text.includes("journey")
    ) {
      return "experience";
    }

    // Industry insights
    if (
      text.includes("industry") ||
      text.includes("market") ||
      text.includes("trends") ||
      text.includes("analysis")
    ) {
      return "insights";
    }

    return "general";
  }

  /**
   * Process author information
   */
  processAuthorInfo(content) {
    return {
      name: content.author || "Unknown",
      platform: content.platform,
      verified: content.verified || false,
      followerCount: content.followerCount || 0,
      accountAge: content.accountAge || null,
    };
  }

  /**
   * Analyze engagement patterns
   */
  analyzeEngagement(content) {
    const likes = content.likes || 0;
    const comments = content.comments || 0;
    const shares = content.shares || 0;
    const views = content.views || 0;

    const totalEngagement = likes + comments + shares;
    const engagementRate = views > 0 ? (totalEngagement / views) * 100 : 0;

    return {
      total: totalEngagement,
      rate: engagementRate,
      likesToComments: comments > 0 ? likes / comments : likes,
      sharesToLikes: likes > 0 ? shares / likes : 0,
      quality: this.assessEngagementQuality(likes, comments, shares, views),
    };
  }

  /**
   * Assess engagement quality
   */
  assessEngagementQuality(likes, comments, shares, views) {
    let quality = "low";

    // High engagement with good comment ratio
    if (likes > 50 && comments > 5 && comments / likes > 0.05) {
      quality = "high";
    } else if (likes > 20 && comments > 2) {
      quality = "medium";
    }

    // Boost quality if there are shares
    if (shares > 0 && quality !== "high") {
      quality = quality === "medium" ? "high" : "medium";
    }

    return quality;
  }

  /**
   * Generate content fingerprint for duplicate detection
   */
  generateContentFingerprint(content) {
    const text = `${content.title || ""} ${content.content || ""}`;
    const normalized = text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Simple hash function for fingerprinting
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
  }

  /**
   * Process and clean scraped content
   */
  processContent(content) {
    const processed = {
      title: this.processTitle(content.title),
      content: this.processText(content.content),
      tags: this.processTags(content),
      mediaUrls: this.processMediaUrls(content.mediaUrls || []),
    };

    return processed;
  }

  /**
   * Process and clean title
   */
  processTitle(title) {
    if (!title) return "Untitled Post";

    let processed = this.utils.cleanText(title);

    // Remove excessive punctuation
    processed = processed.replace(/[!?]{3,}/g, "!");
    processed = processed.replace(/\.{3,}/g, "...");

    // Capitalize first letter
    processed = processed.charAt(0).toUpperCase() + processed.slice(1);

    // Truncate if too long
    if (processed.length > this.maxTitleLength) {
      processed = this.utils.truncateText(processed, this.maxTitleLength);
    }

    return processed;
  }

  /**
   * Process and clean text content
   */
  processText(text) {
    if (!text) return "";

    let processed = this.utils.stripHtml(text);
    processed = this.utils.cleanText(processed);

    // Remove excessive line breaks
    processed = processed.replace(/\n{3,}/g, "\n\n");

    // Remove URLs from content (they're stored separately)
    processed = processed.replace(/https?:\/\/[^\s]+/g, "");

    // Clean up spacing
    processed = processed.replace(/\s{3,}/g, " ");

    // Truncate if too long
    if (processed.length > this.maxContentLength) {
      processed = this.utils.truncateText(processed, this.maxContentLength);
    }

    return processed.trim();
  }

  /**
   * Process and normalize tags
   */
  processTags(content) {
    const tags = new Set();

    // Add existing tags
    if (content.tags && Array.isArray(content.tags)) {
      content.tags.forEach((tag) => {
        const cleanTag = this.cleanTag(tag);
        if (cleanTag) tags.add(cleanTag);
      });
    }

    // Extract hashtags from title and content
    const titleHashtags = this.utils.extractHashtags(content.title || "");
    const contentHashtags = this.utils.extractHashtags(content.content || "");

    [...titleHashtags, ...contentHashtags].forEach((tag) => {
      const cleanTag = this.cleanTag(tag);
      if (cleanTag) tags.add(cleanTag);
    });

    // Add platform-specific tags
    if (content.platform) {
      tags.add(content.platform);
    }

    // Add business-related tags based on content analysis
    const businessTags = this.extractBusinessTags(content);
    businessTags.forEach((tag) => tags.add(tag));

    // Convert to array and limit number of tags
    return Array.from(tags).slice(0, 10);
  }

  /**
   * Clean individual tag
   */
  cleanTag(tag) {
    if (!tag || typeof tag !== "string") return null;

    let cleaned = tag.toLowerCase().trim();

    // Remove special characters except hyphens and underscores
    cleaned = cleaned.replace(/[^a-z0-9\-_]/g, "");

    // Remove leading/trailing hyphens and underscores
    cleaned = cleaned.replace(/^[-_]+|[-_]+$/g, "");

    // Skip if too short or too long
    if (cleaned.length < 2 || cleaned.length > 30) {
      return null;
    }

    return cleaned;
  }

  /**
   * Extract business-related tags from content
   */
  extractBusinessTags(content) {
    const businessKeywords = {
      startup: [
        "startup",
        "startups",
        "entrepreneur",
        "entrepreneurship",
        "founder",
      ],
      business: ["business", "company", "corporate", "enterprise"],
      marketing: ["marketing", "advertising", "promotion", "branding", "seo"],
      sales: ["sales", "selling", "revenue", "profit", "customer"],
      technology: ["tech", "technology", "software", "digital", "innovation"],
      finance: ["finance", "financial", "money", "investment", "funding"],
      leadership: ["leadership", "management", "ceo", "executive", "leader"],
      growth: ["growth", "scaling", "expansion", "development"],
      productivity: [
        "productivity",
        "efficiency",
        "optimization",
        "automation",
      ],
      strategy: ["strategy", "strategic", "planning", "vision"],
    };

    const text =
      `${content.title || ""} ${content.content || ""}`.toLowerCase();
    const tags = [];

    Object.entries(businessKeywords).forEach(([tag, keywords]) => {
      if (keywords.some((keyword) => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  /**
   * Process media URLs
   */
  processMediaUrls(mediaUrls) {
    if (!Array.isArray(mediaUrls)) return [];

    return mediaUrls
      .filter((media) => media && media.url && this.utils.isValidUrl(media.url))
      .map((media) => ({
        type: media.type || this.detectMediaType(media.url),
        url: media.url,
      }))
      .slice(0, 5); // Limit to 5 media items
  }

  /**
   * Detect media type from URL
   */
  detectMediaType(url) {
    if (this.utils.isImageUrl(url)) return "image";
    if (this.utils.isVideoUrl(url)) return "video";
    return "link";
  }

  /**
   * Check if content is duplicate
   */
  async isDuplicate(content, existingPosts) {
    const threshold = 0.8; // 80% similarity threshold

    for (const existingPost of existingPosts) {
      const titleSimilarity = this.utils.calculateSimilarity(
        content.title,
        existingPost.title
      );

      const contentSimilarity = this.utils.calculateSimilarity(
        content.content,
        existingPost.content
      );

      // If either title or content is very similar, consider it a duplicate
      if (titleSimilarity > threshold || contentSimilarity > threshold) {
        return true;
      }

      // Check if it's the same source URL
      if (content.sourceUrl === existingPost.sourceUrl) {
        return true;
      }
    }

    return false;
  }

  /**
   * Enhance content with additional metadata
   */
  enhanceContent(content) {
    const enhanced = { ...content };

    // Add reading time estimate
    enhanced.readingTime = this.estimateReadingTime(content.content);

    // Add content type classification
    enhanced.contentType = this.classifyContent(content);

    // Add sentiment analysis (basic)
    enhanced.sentiment = this.analyzeSentiment(content.content);

    // Add language detection (basic)
    enhanced.language = this.detectLanguage(content.content);

    return enhanced;
  }

  /**
   * Estimate reading time in minutes
   */
  estimateReadingTime(text) {
    if (!text) return 1;

    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return Math.max(1, readingTime);
  }

  /**
   * Classify content type
   */
  classifyContent(content) {
    const text =
      `${content.title || ""} ${content.content || ""}`.toLowerCase();

    if (
      text.includes("how to") ||
      text.includes("tutorial") ||
      text.includes("guide")
    ) {
      return "tutorial";
    }

    if (
      text.includes("news") ||
      text.includes("breaking") ||
      text.includes("announced")
    ) {
      return "news";
    }

    if (
      text.includes("opinion") ||
      text.includes("think") ||
      text.includes("believe")
    ) {
      return "opinion";
    }

    if (
      text.includes("review") ||
      text.includes("rating") ||
      text.includes("stars")
    ) {
      return "review";
    }

    return "general";
  }

  /**
   * Basic sentiment analysis
   */
  analyzeSentiment(text) {
    if (!text) return "neutral";

    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "awesome",
      "love",
      "best",
      "fantastic",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "hate",
      "worst",
      "horrible",
      "disappointing",
    ];

    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach((word) => {
      if (positiveWords.includes(word)) positiveCount++;
      if (negativeWords.includes(word)) negativeCount++;
    });

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  /**
   * Basic language detection
   */
  detectLanguage(text) {
    if (!text) return "en";

    // Very basic language detection - in production, use a proper library
    const englishWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
    ];
    const words = text.toLowerCase().split(/\s+/).slice(0, 50); // Check first 50 words

    const englishWordCount = words.filter((word) =>
      englishWords.includes(word)
    ).length;
    const englishRatio = englishWordCount / Math.min(words.length, 50);

    return englishRatio > 0.1 ? "en" : "unknown";
  }
}

export { ContentProcessor };
