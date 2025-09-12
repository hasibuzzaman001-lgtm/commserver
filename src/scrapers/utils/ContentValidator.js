import { ScrapingUtils } from "./ScrapingUtils.js";

class ContentValidator {
  constructor() {
    this.utils = new ScrapingUtils();
    this.spamKeywords = [
      'buy now', 'click here', 'limited time', 'act now', 'free money',
      'guaranteed', 'winner', 'congratulations', 'urgent', 'exclusive offer',
      'make money fast', 'work from home', 'get rich quick', 'no experience needed'
    ];
    this.promotionalIndicators = [
      'sponsored', 'ad', 'promoted', 'advertisement', 'affiliate',
      'discount code', 'promo code', 'sale', 'offer expires', 'limited time'
    ];
  }

  /**
   * Validate content authenticity
   */
  async validateAuthenticity(content) {
    const validationResults = {
      valid: true,
      score: 1.0,
      reason: '',
      checks: {}
    };

    // Check 1: Content length and quality
    const lengthCheck = this.validateContentLength(content);
    validationResults.checks.length = lengthCheck;
    if (!lengthCheck.valid) {
      validationResults.valid = false;
      validationResults.reason = lengthCheck.reason;
      validationResults.score -= 0.3;
    }

    // Check 2: Spam detection
    const spamCheck = this.detectSpam(content);
    validationResults.checks.spam = spamCheck;
    if (!spamCheck.valid) {
      validationResults.valid = false;
      validationResults.reason = spamCheck.reason;
      validationResults.score -= 0.4;
    }

    // Check 3: Promotional content detection
    const promoCheck = this.detectPromotionalContent(content);
    validationResults.checks.promotional = promoCheck;
    if (!promoCheck.valid) {
      validationResults.valid = false;
      validationResults.reason = promoCheck.reason;
      validationResults.score -= 0.3;
    }

    // Check 4: Author authenticity
    const authorCheck = this.validateAuthor(content);
    validationResults.checks.author = authorCheck;
    if (!authorCheck.valid) {
      validationResults.score -= 0.2;
    }

    // Check 5: Content originality
    const originalityCheck = this.checkOriginality(content);
    validationResults.checks.originality = originalityCheck;
    if (!originalityCheck.valid) {
      validationResults.score -= 0.2;
    }

    // Check 6: Engagement authenticity
    const engagementCheck = this.validateEngagement(content);
    validationResults.checks.engagement = engagementCheck;
    if (!engagementCheck.valid) {
      validationResults.score -= 0.1;
    }

    // Final score adjustment
    validationResults.score = Math.max(0, validationResults.score);
    
    // If score is too low, mark as invalid
    if (validationResults.score < 0.6) {
      validationResults.valid = false;
      if (!validationResults.reason) {
        validationResults.reason = 'Overall authenticity score too low';
      }
    }

    return validationResults;
  }

  /**
   * Validate content length and structure
   */
  validateContentLength(content) {
    const title = content.title || '';
    const text = content.content || '';
    
    // Check minimum content requirements
    if (title.length < 10) {
      return {
        valid: false,
        reason: 'Title too short (minimum 10 characters)',
        score: 0.2
      };
    }

    if (text.length < 20) {
      return {
        valid: false,
        reason: 'Content too short (minimum 20 characters)',
        score: 0.3
      };
    }

    // Check for reasonable maximum lengths
    if (title.length > 300) {
      return {
        valid: false,
        reason: 'Title too long (maximum 300 characters)',
        score: 0.4
      };
    }

    if (text.length > 10000) {
      return {
        valid: false,
        reason: 'Content too long (maximum 10000 characters)',
        score: 0.6
      };
    }

    return {
      valid: true,
      reason: 'Content length appropriate',
      score: 1.0
    };
  }

  /**
   * Detect spam content
   */
  detectSpam(content) {
    const fullText = `${content.title || ''} ${content.content || ''}`.toLowerCase();
    
    // Check for spam keywords
    const spamMatches = this.spamKeywords.filter(keyword => 
      fullText.includes(keyword.toLowerCase())
    );

    if (spamMatches.length > 0) {
      return {
        valid: false,
        reason: `Contains spam keywords: ${spamMatches.join(', ')}`,
        score: 0.1,
        matches: spamMatches
      };
    }

    // Check for excessive punctuation
    const exclamationCount = (fullText.match(/!/g) || []).length;
    const questionCount = (fullText.match(/\?/g) || []).length;
    
    if (exclamationCount > 5 || questionCount > 3) {
      return {
        valid: false,
        reason: 'Excessive punctuation indicating spam',
        score: 0.3
      };
    }

    // Check for excessive capitalization
    const capsRatio = (fullText.match(/[A-Z]/g) || []).length / fullText.length;
    if (capsRatio > 0.3 && fullText.length > 50) {
      return {
        valid: false,
        reason: 'Excessive capitalization indicating spam',
        score: 0.4
      };
    }

    // Check for repeated characters
    if (/(.)\1{4,}/.test(fullText)) {
      return {
        valid: false,
        reason: 'Contains repeated characters indicating spam',
        score: 0.2
      };
    }

    return {
      valid: true,
      reason: 'No spam indicators detected',
      score: 1.0
    };
  }

  /**
   * Detect promotional content
   */
  detectPromotionalContent(content) {
    const fullText = `${content.title || ''} ${content.content || ''}`.toLowerCase();
    
    // Check for promotional keywords
    const promoMatches = this.promotionalIndicators.filter(indicator => 
      fullText.includes(indicator.toLowerCase())
    );

    if (promoMatches.length > 1) {
      return {
        valid: false,
        reason: `Contains promotional indicators: ${promoMatches.join(', ')}`,
        score: 0.2,
        matches: promoMatches
      };
    }

    // Check for URLs that might be promotional
    const urls = this.utils.extractUrls(fullText);
    const suspiciousUrls = urls.filter(url => {
      const domain = this.utils.extractDomain(url);
      return domain && (
        domain.includes('affiliate') ||
        domain.includes('promo') ||
        domain.includes('deal') ||
        domain.includes('discount')
      );
    });

    if (suspiciousUrls.length > 0) {
      return {
        valid: false,
        reason: 'Contains promotional URLs',
        score: 0.3,
        suspiciousUrls
      };
    }

    // Check for price mentions (might indicate sales content)
    const pricePattern = /\$\d+|\d+\s*dollars?|\d+\s*usd|price|cost|buy|purchase/gi;
    const priceMatches = fullText.match(pricePattern) || [];
    
    if (priceMatches.length > 2) {
      return {
        valid: false,
        reason: 'Contains multiple price/purchase references',
        score: 0.4
      };
    }

    return {
      valid: true,
      reason: 'No promotional content detected',
      score: 1.0
    };
  }

  /**
   * Validate author authenticity
   */
  validateAuthor(content) {
    const author = content.author || '';
    
    // Check for valid author name
    if (!author || author.length < 2) {
      return {
        valid: false,
        reason: 'No valid author information',
        score: 0.3
      };
    }

    // Check for suspicious author patterns
    if (/^(user|guest|anonymous)\d*$/i.test(author)) {
      return {
        valid: false,
        reason: 'Generic/suspicious author name',
        score: 0.4
      };
    }

    // Check for bot-like patterns
    if (/bot|automated|script|crawler/i.test(author)) {
      return {
        valid: false,
        reason: 'Author appears to be automated',
        score: 0.2
      };
    }

    return {
      valid: true,
      reason: 'Author appears authentic',
      score: 1.0
    };
  }

  /**
   * Check content originality
   */
  checkOriginality(content) {
    const text = content.content || '';
    
    // Check for copy-paste indicators
    const copyPasteIndicators = [
      'copy and paste', 'copied from', 'source:', 'via @', 'repost',
      'shared from', 'originally posted', 'credit to'
    ];

    const copyIndicators = copyPasteIndicators.filter(indicator => 
      text.toLowerCase().includes(indicator)
    );

    if (copyIndicators.length > 0) {
      return {
        valid: false,
        reason: `Contains copy-paste indicators: ${copyIndicators.join(', ')}`,
        score: 0.3
      };
    }

    // Check for template-like content
    const templatePatterns = [
      /fill in the blank/i,
      /\[insert \w+\]/i,
      /\{\{\w+\}\}/i,
      /\[your \w+\]/i
    ];

    const templateMatches = templatePatterns.filter(pattern => pattern.test(text));
    
    if (templateMatches.length > 0) {
      return {
        valid: false,
        reason: 'Contains template-like content',
        score: 0.4
      };
    }

    return {
      valid: true,
      reason: 'Content appears original',
      score: 1.0
    };
  }

  /**
   * Validate engagement metrics authenticity
   */
  validateEngagement(content) {
    const likes = content.likes || 0;
    const comments = content.comments || 0;
    const shares = content.shares || 0;
    const views = content.views || 0;

    // Check for suspicious engagement patterns
    if (likes > 0 && comments === 0 && likes > 100) {
      return {
        valid: false,
        reason: 'Suspicious engagement pattern (high likes, no comments)',
        score: 0.5
      };
    }

    // Check for unrealistic ratios
    if (comments > likes && likes > 10) {
      return {
        valid: false,
        reason: 'Unrealistic engagement ratio (more comments than likes)',
        score: 0.6
      };
    }

    // Check for round numbers (might indicate fake metrics)
    const metrics = [likes, comments, shares, views].filter(m => m > 0);
    const roundNumbers = metrics.filter(m => m % 100 === 0 || m % 1000 === 0);
    
    if (roundNumbers.length > 1 && metrics.length > 2) {
      return {
        valid: false,
        reason: 'Multiple round engagement numbers (suspicious)',
        score: 0.7
      };
    }

    return {
      valid: true,
      reason: 'Engagement metrics appear authentic',
      score: 1.0
    };
  }

  /**
   * Validate content against platform-specific rules
   */
  validatePlatformSpecific(content, platform) {
    switch (platform) {
      case 'twitter':
        return this.validateTwitterContent(content);
      case 'reddit':
        return this.validateRedditContent(content);
      case 'linkedin':
        return this.validateLinkedInContent(content);
      case 'medium':
        return this.validateMediumContent(content);
      default:
        return { valid: true, reason: 'No platform-specific validation', score: 1.0 };
    }
  }

  /**
   * Twitter-specific validation
   */
  validateTwitterContent(content) {
    const text = content.content || '';
    
    // Check character limit
    if (text.length > 280) {
      return {
        valid: false,
        reason: 'Content exceeds Twitter character limit',
        score: 0.1
      };
    }

    // Check for excessive hashtags
    const hashtags = (text.match(/#\w+/g) || []).length;
    if (hashtags > 5) {
      return {
        valid: false,
        reason: 'Excessive hashtags for Twitter',
        score: 0.4
      };
    }

    return { valid: true, reason: 'Valid Twitter content', score: 1.0 };
  }

  /**
   * Reddit-specific validation
   */
  validateRedditContent(content) {
    const title = content.title || '';
    const text = content.content || '';
    
    // Check for clickbait titles
    const clickbaitPatterns = [
      /you won't believe/i,
      /this will shock you/i,
      /number \d+ will amaze you/i,
      /doctors hate this/i
    ];

    const clickbaitMatches = clickbaitPatterns.filter(pattern => pattern.test(title));
    
    if (clickbaitMatches.length > 0) {
      return {
        valid: false,
        reason: 'Contains clickbait title patterns',
        score: 0.3
      };
    }

    return { valid: true, reason: 'Valid Reddit content', score: 1.0 };
  }

  /**
   * LinkedIn-specific validation
   */
  validateLinkedInContent(content) {
    const text = `${content.title || ''} ${content.content || ''}`;
    
    // Check for professional tone indicators
    const professionalIndicators = [
      'experience', 'career', 'professional', 'business', 'industry',
      'leadership', 'management', 'strategy', 'growth', 'development'
    ];

    const professionalMatches = professionalIndicators.filter(indicator => 
      text.toLowerCase().includes(indicator)
    );

    if (professionalMatches.length === 0 && text.length > 100) {
      return {
        valid: false,
        reason: 'Content lacks professional context for LinkedIn',
        score: 0.6
      };
    }

    return { valid: true, reason: 'Valid LinkedIn content', score: 1.0 };
  }

  /**
   * Medium-specific validation
   */
  validateMediumContent(content) {
    const text = content.content || '';
    
    // Check for article-like structure
    if (text.length < 200) {
      return {
        valid: false,
        reason: 'Content too short for Medium article',
        score: 0.4
      };
    }

    // Check for proper formatting indicators
    const formattingIndicators = text.match(/\n\n|\. [A-Z]|:\s*\n/g) || [];
    
    if (formattingIndicators.length < 2 && text.length > 500) {
      return {
        valid: false,
        reason: 'Poor formatting for Medium article',
        score: 0.5
      };
    }

    return { valid: true, reason: 'Valid Medium content', score: 1.0 };
  }
}

export { ContentValidator };