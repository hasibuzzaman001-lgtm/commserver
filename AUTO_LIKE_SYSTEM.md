# Auto-Like System Documentation

## Overview

The auto-like system automatically generates and manages likes for posts in the platform. It assigns initial likes to newly scraped posts and continuously increments likes on recent posts to simulate organic engagement.

## Features

1. **Initial Like Assignment**: Automatically assigns 5-15 random likes when a new post is created
2. **Auto-Increment**: Adds 5-15 new likes to the last 100 posts every 5 minutes
3. **Duplicate Prevention**: Ensures no user likes the same post twice
4. **Scalability**: Uses MongoDB aggregation for efficient random user selection

## Architecture

### Database Schema

The system uses the existing `likes` collection with the following schema:

```javascript
{
  likedBy: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  comment: ObjectId (ref: Comment),
  timestamps: true
}
```

**Unique Indexes:**
- `{ likedBy: 1, post: 1 }` - Prevents duplicate likes on posts
- `{ likedBy: 1, comment: 1 }` - Prevents duplicate likes on comments

### Core Components

#### 1. AutoLikeService (`/src/services/AutoLikeService.js`)

The main service handling all auto-like operations:

**Methods:**

- `getRandomLikeCount()`: Returns a random number between 5-15
- `getRandomUsers(count)`: Fetches random users using MongoDB's `$sample` aggregation
- `assignInitialLikesToPost(postId)`: Assigns initial likes to a new post
- `incrementLikesForRecentPosts()`: Adds likes to the last 100 posts
- `recalculatePostLikes(postId)`: Recalculates and updates like count for a post
- `recalculateAllPostLikes()`: Recalculates likes for all active posts

**Configuration:**
- `minLikes`: 5
- `maxLikes`: 15

#### 2. Integration Points

**ScraperManager** (`/src/scrapers/ScraperManager.js`):
- Automatically calls `assignInitialLikesToPost()` after creating each new post
- Integrated in both `createPostsFromScrapedContent()` and `createPostsFromAuthenticContent()`

**SchedulerService** (`/src/services/SchedulerService.js`):
- Runs `scheduleAutoLikeJob()` during initialization
- Executes `incrementLikesForRecentPosts()` every 5 minutes via cron job

## API Endpoints

Base URL: `/api/v1/auto-like`

### 1. Get Auto-Like Status
```
GET /api/v1/auto-like/status
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "enabled": true,
    "minLikes": 5,
    "maxLikes": 15,
    "cronSchedule": "Every 5 minutes",
    "targetPosts": "Last 100 posts"
  },
  "message": "Auto-like status fetched successfully",
  "success": true
}
```

### 2. Run Auto-Like Increment Manually
```
POST /api/v1/auto-like/run-increment
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "totalPosts": 100,
    "totalLikesAdded": 1250,
    "postsUpdated": 98,
    "timestamp": "2025-09-30T12:00:00.000Z"
  },
  "message": "Auto-like increment completed: 1250 likes added to 98 posts",
  "success": true
}
```

### 3. Assign Initial Likes to Post
```
POST /api/v1/auto-like/assign-initial/:postId
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "postId": "60d5ec49f7d3a9001c8e4c7a",
    "likesAdded": 12
  },
  "message": "Successfully assigned 12 initial likes to post",
  "success": true
}
```

### 4. Recalculate Post Likes
```
POST /api/v1/auto-like/recalculate/:postId
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "postId": "60d5ec49f7d3a9001c8e4c7a",
    "totalLikes": 45
  },
  "message": "Post likes recalculated successfully",
  "success": true
}
```

### 5. Recalculate All Post Likes
```
POST /api/v1/auto-like/recalculate-all
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "postsUpdated": 5420
  },
  "message": "Successfully recalculated likes for all posts",
  "success": true
}
```

## Cron Job Configuration

**Schedule:** Every 5 minutes (`*/5 * * * *`)

**Job Name:** `auto_like_increment`

**Execution Flow:**
1. Fetch last 100 active posts sorted by creation date
2. For each post:
   - Generate random like count (5-15)
   - Select random users
   - Check for existing likes to prevent duplicates
   - Create new like entries
   - Update post's `localEngagement.likes` count
3. Log results with total likes added and posts updated

## How It Works

### Initial Like Assignment

When a new post is scraped and created:

1. `ScraperManager.createPostsFromScrapedContent()` creates the post
2. Immediately calls `autoLikeService.assignInitialLikesToPost(post._id)`
3. Service generates 5-15 random users
4. Creates like entries for each user
5. Updates post's `localEngagement.likes` field

### Auto-Increment Process

Every 5 minutes, the cron job:

1. Queries the last 100 active posts
2. For each post:
   - Counts existing likes
   - Selects 5-15 random users
   - Filters out users who already liked the post
   - Creates new like entries
   - Updates the post's like count

### Duplicate Prevention

The system prevents duplicate likes through:

1. **Database-level**: Unique compound index on `{ likedBy: 1, post: 1 }`
2. **Application-level**: Checks for existing likes before creation
3. **Error handling**: Catches duplicate key errors (code 11000) gracefully

## Performance Considerations

### Optimizations

1. **Random User Selection**: Uses MongoDB's `$sample` aggregation for efficient random selection
2. **Batch Processing**: Processes posts sequentially to avoid overwhelming the database
3. **Targeted Updates**: Only updates the last 100 posts, not the entire database
4. **Index Usage**: Leverages compound indexes for fast duplicate detection

### Scalability

- **User Count**: Handles large user bases efficiently through aggregation
- **Post Volume**: Limits to 100 most recent posts per increment
- **Concurrent Operations**: Gracefully handles duplicate key errors

## Monitoring and Logging

The system provides comprehensive logging:

```
🔄 Starting auto-increment likes process...
Processing 100 recent posts for like increment...
✅ Added 12 likes to post "Example Post Title..."
✅ Auto-increment completed: 1250 likes added to 98 posts
```

### Key Metrics Tracked

- Total posts processed
- Total likes added
- Posts successfully updated
- Timestamp of execution

## Error Handling

### Common Errors and Resolution

1. **No Users Available**
   - Error: "No users available in the database"
   - Solution: Ensure users are seeded in the database

2. **Post Not Found**
   - Error: "Post not found: {postId}"
   - Solution: Verify post exists and is active

3. **Duplicate Like**
   - Handled gracefully, skips to next user
   - No error thrown, logged for tracking

## Configuration

All configuration is centralized in `AutoLikeService`:

```javascript
class AutoLikeService {
  constructor() {
    this.minLikes = 5;      // Minimum likes per execution
    this.maxLikes = 15;     // Maximum likes per execution
  }
}
```

To modify behavior, update these values in `/src/services/AutoLikeService.js`.

## Testing

### Manual Testing

1. **Test Initial Assignment:**
```bash
curl -X POST http://localhost:3000/api/v1/auto-like/assign-initial/{postId}
```

2. **Test Auto-Increment:**
```bash
curl -X POST http://localhost:3000/api/v1/auto-like/run-increment
```

3. **Check Status:**
```bash
curl http://localhost:3000/api/v1/auto-like/status
```

### Verification

To verify the system is working:

1. Check scheduler status:
```bash
curl http://localhost:3000/api/v1/scraper/scheduler/status
```

2. Monitor server logs for auto-like execution messages

3. Query a post to see likes:
```bash
curl http://localhost:3000/api/v1/posts/{postId}
```

## Integration with Existing Systems

### Post Model Updates

The system updates the `localEngagement.likes` field:

```javascript
localEngagement: {
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  bookmarks: { type: Number, default: 0 }
}
```

### Compatibility

- Works with existing `Like` model and indexes
- Compatible with manual like endpoints
- Does not interfere with real user likes
- Properly syncs like counts with actual database records

## Future Enhancements

Potential improvements:

1. **Configurable Schedule**: Allow dynamic cron schedule changes
2. **Post Targeting**: Target specific communities or post types
3. **User Weighting**: Prioritize certain users for likes
4. **Analytics**: Track auto-like patterns and effectiveness
5. **Rate Limiting**: Prevent excessive likes per post
6. **Time-based Distribution**: Distribute likes over time for authenticity

## Troubleshooting

### Auto-Increment Not Running

1. Check if scheduler is initialized:
   - Verify server logs show "✅ Scheduler service initialized successfully"
   - Check `/api/v1/scraper/scheduler/status`

2. Restart scheduler:
```bash
curl -X POST http://localhost:3000/api/v1/scraper/scheduler/restart
```

### Likes Not Appearing

1. Verify like entries exist in database
2. Run recalculation:
```bash
curl -X POST http://localhost:3000/api/v1/auto-like/recalculate-all
```

3. Check for errors in server logs

### Performance Issues

1. Reduce target post count (currently 100)
2. Increase cron interval (currently 5 minutes)
3. Add database indexes if needed
4. Monitor MongoDB performance

## Conclusion

The auto-like system provides a robust, scalable solution for automatically managing post engagement. It seamlessly integrates with the existing scraping pipeline and maintains data integrity through comprehensive error handling and duplicate prevention.