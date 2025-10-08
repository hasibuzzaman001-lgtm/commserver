# Reddit-Exclusive Scraping System

## Overview

This system is configured to scrape **ONLY authentic content from Reddit**. All other platforms (Twitter, LinkedIn, Medium) have been disabled to ensure data quality and consistency.

## Why Reddit Only?

1. **Authentic Content**: Reddit's community-driven nature ensures genuine discussions and user-generated content
2. **API Reliability**: Reddit's JSON API provides consistent, structured data without authentication
3. **Comprehensive Coverage**: Reddit has active communities for virtually every business topic
4. **Quality Control**: Built-in voting system helps identify valuable content
5. **Anti-Spam Measures**: Reddit's moderation and community guidelines reduce promotional content

## Authenticity Filters

All scraped Reddit posts are filtered through multiple authenticity checks:

### Author Validation
- Excludes deleted accounts
- Filters out AutoModerator posts
- Identifies and excludes obvious bot accounts
- Validates author credibility

### Content Quality Checks
- **Title Length**: 10-300 characters
- **Spam Detection**: Filters promotional keywords like "buy now", "limited time", "discount code"
- **Formatting Validation**: Removes posts with excessive punctuation or repeated characters
- **Score Threshold**: Excludes downvoted posts (score < 0)
- **Engagement Analysis**: Prioritizes posts with genuine community interaction

### Promotional Content Filters
Automatically excludes posts containing:
- Affiliate links
- Discount codes
- Sponsored content indicators
- "Get rich quick" schemes
- Work from home scams
- Excessive promotional language

## Covered Subreddits

The system scrapes from 12 diverse business-focused subreddits:

1. **r/entrepreneur** - General entrepreneurship discussions
2. **r/startups** - Startup-specific content and advice
3. **r/smallbusiness** - Small business operations and management
4. **r/business** - Business strategy and analysis
5. **r/marketing** - Marketing strategies and tactics
6. **r/SaaS** - SaaS-specific discussions
7. **r/ecommerce** - E-commerce strategies and platforms
8. **r/sales** - Sales techniques and CRM
9. **r/personalfinance** - Financial advice and investing
10. **r/businessideas** - Business ideation and opportunities
11. **r/EntrepreneurRideAlong** - Entrepreneurial journey stories
12. **r/legaladvice** - Business legal guidance

## Scraping Configuration

### Default Settings
- **Frequency**: Daily scraping for all communities
- **Posts Per Scrape**: 15-35 posts depending on community
- **Quality Threshold**: 0.5-0.7 based on community focus
- **Rate Limiting**: 2 seconds between requests to respect Reddit's API

### Authenticity Mode
When enabled (default: true), the scraper:
1. Fetches 2x the requested posts
2. Applies authenticity filters
3. Returns only validated authentic content
4. Logs filtering statistics

## Content Processing

### What Gets Scraped
- Post title (cleaned and validated)
- Post content/selftext
- Author information
- Creation timestamp
- Engagement metrics (upvotes, comments, shares)
- Subreddit tags and flairs
- Media URLs (images, videos)

### What Gets Enhanced
- Titles cleaned of common Reddit prefixes (PSA, TIL, TIFU, etc.)
- Content stripped of edit notes and TL;DR sections
- Short posts expanded with contextual content
- Business-related tags automatically extracted
- Quality scores calculated

### What Gets Excluded
- Deleted or removed posts
- Bot-generated content
- Promotional/spam posts
- Low-quality content (below threshold)
- Duplicate content
- Template-like posts

## Data Quality Metrics

### Quality Score Components
- **Content Length** (20%): Appropriate length for meaningful discussion
- **Title Quality** (10%): Clear, descriptive titles
- **Engagement** (20%): Likes, comments, and shares
- **Spam-Free** (-40%): No spam indicators
- **Content Freshness** (10%): Recent content prioritized
- **Media Presence** (10%): Has relevant images/videos
- **Author Credibility** (5%): Established Reddit accounts

### Minimum Thresholds
- Title: 10 characters minimum
- Content: 20 characters minimum
- Quality Score: 0.5-0.7 (varies by community)
- Author: Valid username (not deleted/bot)

## API Endpoints

### Scraping Operations
```
POST /api/scraper/run - Run scraping for all communities
POST /api/scraper/run/:communityId - Run scraping for specific community
POST /api/scraper/test/:platform - Test scraper (Reddit only)
```

### Validation
- Only `reddit` platform is accepted
- Non-Reddit platforms return: "Invalid platform - only Reddit scraping is supported"

## Comment Generation

For each scraped post, the system:
1. Generates 10-15 AI-powered comments
2. Maintains authentic discussion patterns
3. Respects community tone and style
4. Adds 2-second delay between generations

## Monitoring & Statistics

### Scraping Stats Available
- Total posts scraped (last 24 hours)
- Average quality score per subreddit
- Total engagement metrics
- Platform breakdown (Reddit only)
- Success/failure rates

### Logging
- Detailed scraping progress logs
- Authenticity filtering statistics
- API rate limit handling
- Error tracking and reporting

## Best Practices

### For Administrators
1. Monitor scraping frequency to avoid API limits
2. Review quality thresholds periodically
3. Check authenticity filter effectiveness
4. Validate community configurations

### For Developers
1. Never bypass authenticity filters
2. Maintain 2-second delay between requests
3. Handle rate limiting gracefully
4. Log all scraping activities
5. Validate scraped content before storage

## Error Handling

### Common Errors
- **Rate Limiting**: Automatic 10-second backoff and retry
- **Invalid Subreddit**: URL validation before scraping
- **API Timeout**: 15-second timeout with error logging
- **Empty Results**: Logged but not treated as error

### Recovery Mechanisms
- Automatic retry on rate limit (429)
- Graceful degradation on API failures
- Detailed error messages for debugging
- Continues to next community on individual failures

## Data Storage

### Post Metadata
```javascript
{
  platform: "reddit",
  originalId: "post_id",
  sourceUrl: "reddit.com/r/.../comments/...",
  scrapingMetadata: {
    isAuthentic: true,
    validationMethod: "real_api_scraping",
    qualityScore: 0.75,
    authenticityScore: 0.92
  }
}
```

## Maintenance

### Regular Tasks
1. **Weekly**: Review scraping statistics
2. **Monthly**: Update subreddit list if needed
3. **Quarterly**: Adjust quality thresholds
4. **As Needed**: Add new business-related subreddits

### Performance Optimization
- Monitor scraping duration
- Optimize quality score calculations
- Review duplicate detection
- Update spam keyword lists

## Future Enhancements

### Planned Features
1. Multi-sorting support (hot, top, new, rising)
2. Time-based filtering (day, week, month, year)
3. Subreddit-specific authenticity rules
4. Enhanced duplicate detection
5. Cross-post identification
6. Automated subreddit discovery

### Not Planned
- Scraping from other platforms (Twitter, LinkedIn, Medium)
- Authentication-required Reddit features
- Private subreddit access
- User-specific content scraping

## Compliance

### Reddit API Guidelines
- Respects rate limits (2 seconds between requests)
- Uses proper User-Agent header
- Does not store sensitive user data
- Complies with Reddit's Terms of Service

### Data Privacy
- No personal user information collected
- Public posts only
- Deleted content excluded
- Author usernames stored as-is (public information)

## Support

For issues or questions:
1. Check scraping logs for errors
2. Verify Reddit API accessibility
3. Review community configurations
4. Consult ContentValidator for authenticity rules
5. Test with `/api/scraper/test/reddit` endpoint

---

**Last Updated**: 2025-10-08
**Version**: 1.0.0
**Platform**: Reddit Exclusive
