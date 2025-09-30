import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";

class AutoLikeService {
  constructor() {
    this.minLikes = 5;
    this.maxLikes = 15;
  }

  getRandomLikeCount() {
    return (
      Math.floor(Math.random() * (this.maxLikes - this.minLikes + 1)) +
      this.minLikes
    );
  }

  async getRandomUsers(count) {
    try {
      const totalUsers = await User.countDocuments();
      if (totalUsers === 0) {
        throw new Error("No users available in the database");
      }

      const randomUsers = await User.aggregate([
        { $sample: { size: Math.min(count, totalUsers) } },
        { $project: { _id: 1 } },
      ]);

      return randomUsers.map((user) => user._id);
    } catch (error) {
      console.error("Error fetching random users:", error.message);
      throw error;
    }
  }

  async assignInitialLikesToPost(postId) {
    try {
      console.log(`Assigning initial likes to post: ${postId}`);

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error(`Post not found: ${postId}`);
      }

      const likeCount = this.getRandomLikeCount();
      const userIds = await this.getRandomUsers(likeCount);

      let likesCreated = 0;

      for (const userId of userIds) {
        try {
          await Like.create({
            likedBy: userId,
            post: postId,
          });
          likesCreated++;
        } catch (error) {
          if (error.code === 11000) {
            console.log(
              `Duplicate like detected for user ${userId} on post ${postId}, skipping...`
            );
          } else {
            console.error(
              `Error creating like for user ${userId}:`,
              error.message
            );
          }
        }
      }

      await Post.findByIdAndUpdate(postId, {
        "localEngagement.likes": likesCreated,
      });

      console.log(`✅ Assigned ${likesCreated} initial likes to post ${postId}`);
      return likesCreated;
    } catch (error) {
      console.error(
        `Error assigning initial likes to post ${postId}:`,
        error.message
      );
      throw error;
    }
  }

  async incrementLikesForRecentPosts() {
    try {
      console.log("🔄 Starting auto-increment likes process...");

      const recentPosts = await Post.find({ status: "active" })
        .sort({ createdAt: -1 })
        .limit(100)
        .select("_id title");

      if (recentPosts.length === 0) {
        console.log("No recent posts found for like increment");
        return {
          totalPosts: 0,
          totalLikesAdded: 0,
          postsUpdated: 0,
        };
      }

      console.log(
        `Processing ${recentPosts.length} recent posts for like increment...`
      );

      let totalLikesAdded = 0;
      let postsUpdated = 0;

      for (const post of recentPosts) {
        try {
          const existingLikes = await Like.countDocuments({ post: post._id });

          const likeCount = this.getRandomLikeCount();
          const userIds = await this.getRandomUsers(likeCount);

          let likesCreated = 0;

          for (const userId of userIds) {
            try {
              const existingLike = await Like.findOne({
                likedBy: userId,
                post: post._id,
              });

              if (existingLike) {
                continue;
              }

              await Like.create({
                likedBy: userId,
                post: post._id,
              });
              likesCreated++;
            } catch (error) {
              if (error.code === 11000) {
                continue;
              } else {
                console.error(
                  `Error creating like for user ${userId}:`,
                  error.message
                );
              }
            }
          }

          if (likesCreated > 0) {
            const newTotalLikes = existingLikes + likesCreated;
            await Post.findByIdAndUpdate(post._id, {
              "localEngagement.likes": newTotalLikes,
            });

            totalLikesAdded += likesCreated;
            postsUpdated++;

            console.log(
              `✅ Added ${likesCreated} likes to post "${post.title.substring(0, 40)}..."`
            );
          }
        } catch (postError) {
          console.error(
            `Error processing post ${post._id}:`,
            postError.message
          );
        }
      }

      const result = {
        totalPosts: recentPosts.length,
        totalLikesAdded,
        postsUpdated,
        timestamp: new Date(),
      };

      console.log(
        `✅ Auto-increment completed: ${totalLikesAdded} likes added to ${postsUpdated} posts`
      );
      return result;
    } catch (error) {
      console.error("Error in auto-increment likes process:", error.message);
      throw error;
    }
  }

  async recalculatePostLikes(postId) {
    try {
      const likeCount = await Like.countDocuments({ post: postId });
      await Post.findByIdAndUpdate(postId, {
        "localEngagement.likes": likeCount,
      });
      return likeCount;
    } catch (error) {
      console.error(`Error recalculating likes for post ${postId}:`, error);
      throw error;
    }
  }

  async recalculateAllPostLikes() {
    try {
      console.log("Recalculating likes for all posts...");

      const posts = await Post.find({ status: "active" }).select("_id");
      let updated = 0;

      for (const post of posts) {
        try {
          await this.recalculatePostLikes(post._id);
          updated++;
        } catch (error) {
          console.error(
            `Error recalculating post ${post._id}:`,
            error.message
          );
        }
      }

      console.log(`✅ Recalculated likes for ${updated} posts`);
      return { postsUpdated: updated };
    } catch (error) {
      console.error("Error recalculating all post likes:", error.message);
      throw error;
    }
  }
}

const autoLikeService = new AutoLikeService();

export { autoLikeService, AutoLikeService };