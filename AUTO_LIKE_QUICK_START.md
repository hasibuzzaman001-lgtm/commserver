# Auto-Like System Quick Start Guide

## What Was Implemented

A comprehensive auto-like system that automatically generates and manages likes for posts.

## Key Features

1. **Initial Likes on New Posts**: 5-15 random likes are automatically assigned when posts are scraped
2. **Auto-Increment Every 5 Minutes**: Adds 5-15 likes to the last 100 posts
3. **No Duplicates**: Prevents users from liking the same post twice
4. **Fully Automated**: Runs via cron job, no manual intervention needed

## How to Use

### Automatic Operation

The system runs automatically once the server starts. No configuration needed!

- **On Post Creation**: Initial likes are assigned automatically
- **Every 5 Minutes**: Auto-increment runs on the last 100 posts
- **Logs**: Monitor console for execution details

### API Endpoints

**Check System Status:**
```bash
GET /api/v1/auto-like/status
```

**Manually Trigger Auto-Increment:**
```bash
POST /api/v1/auto-like/run-increment
```

**Add Initial Likes to Specific Post:**
```bash
POST /api/v1/auto-like/assign-initial/{postId}
```

**Recalculate Post Likes:**
```bash
POST /api/v1/auto-like/recalculate/{postId}
```

**Recalculate All Posts:**
```bash
POST /api/v1/auto-like/recalculate-all
```

## System Configuration

**Location:** `/src/services/AutoLikeService.js`

**Default Settings:**
- Minimum likes per execution: 5
- Maximum likes per execution: 15
- Cron schedule: Every 5 minutes
- Target posts: Last 100 posts

## Files Created/Modified

### New Files
1. `/src/services/AutoLikeService.js` - Core auto-like logic
2. `/src/controllers/autoLike.controller.js` - API controllers
3. `/src/routes/autoLike.routes.js` - API routes
4. `/AUTO_LIKE_SYSTEM.md` - Full documentation
5. `/AUTO_LIKE_QUICK_START.md` - This guide

### Modified Files
1. `/src/services/SchedulerService.js` - Added auto-like cron job
2. `/src/scrapers/ScraperManager.js` - Integrated initial like assignment
3. `/src/app.js` - Registered auto-like routes

## Database Schema

Uses existing `likes` collection with structure:
```javascript
{
  likedBy: ObjectId,  // User who liked
  post: ObjectId,     // Post that was liked
  timestamps: true
}
```

**Unique Index:** Prevents duplicate likes from same user on same post

## Monitoring

### Console Logs
```
❤️ Starting auto-like increment job...
✅ Added 12 likes to post "Example Post..."
✅ Auto-increment completed: 1250 likes added to 98 posts
```

### Verify Operation
```bash
# Check scheduler status
curl http://localhost:3000/api/v1/scraper/scheduler/status

# Check auto-like status
curl http://localhost:3000/api/v1/auto-like/status

# Manually run increment
curl -X POST http://localhost:3000/api/v1/auto-like/run-increment
```

## Troubleshooting

**Issue: Auto-increment not running**
- Check server logs for scheduler initialization
- Verify users exist in database
- Check active posts exist

**Solution: Restart scheduler**
```bash
curl -X POST http://localhost:3000/api/v1/scraper/scheduler/restart
```

**Issue: Like counts seem wrong**
- Run recalculation to sync database with post counts
```bash
curl -X POST http://localhost:3000/api/v1/auto-like/recalculate-all
```

## Technical Details

### How Initial Likes Work
1. Post is scraped and created
2. System selects 5-15 random users
3. Creates like entries in database
4. Updates post's `localEngagement.likes` count

### How Auto-Increment Works
1. Cron job triggers every 5 minutes
2. Fetches last 100 active posts
3. For each post:
   - Selects 5-15 random users
   - Checks for existing likes
   - Creates new like entries
   - Updates like count

### Performance
- Uses MongoDB aggregation for efficient random selection
- Processes 100 posts per execution
- Handles large user bases efficiently
- Prevents duplicates at database level

## Production Considerations

1. **User Base**: Ensure sufficient users exist for diverse likes
2. **Monitoring**: Watch logs for errors or issues
3. **Performance**: Monitor database load during execution
4. **Scaling**: Adjust post limit if needed (currently 100)

## Next Steps

1. Start your server
2. Monitor logs for auto-like execution
3. Check post like counts after scraping
4. Use API endpoints to manually control if needed

The system is production-ready and requires no additional setup!