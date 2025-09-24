<<<<<<< HEAD
import OpenAI from "openai";
import { Comment } from "../models/comment.model.js";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
=======
import OpenAI from 'openai';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import { Post } from '../models/post.model.js';
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

class CommentGeneratorService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.rateLimitDelay = 1000; // 1 second between API calls
  }

  /**
   * Generate AI comments for a post
   */
  async generateCommentsForPost(postId, commentCount = 12) {
<<<<<<< HEAD
    commentCount = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
    try {
      const post = await Post.findById(postId).populate("owner");
      if (!post) {
        throw new Error("Post not found");
=======
    try {
      const post = await Post.findById(postId).populate('owner');
      if (!post) {
        throw new Error('Post not found');
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      }

      // Get available platform users (excluding post author)
      const platformUsers = await User.find({
<<<<<<< HEAD
        userType: "platform",
        _id: { $ne: post.owner._id },
      }).select("_id username");

      if (platformUsers.length === 0) {
        throw new Error("No platform users available for comment assignment");
      }

      console.log(
        `🤖 Generating ${commentCount} AI comments for post: ${post.title.substring(0, 50)}...`
      );
=======
        userType: 'platform',
        _id: { $ne: post.owner._id }
      }).select('_id username');

      if (platformUsers.length === 0) {
        throw new Error('No platform users available for comment assignment');
      }

      console.log(`🤖 Generating ${commentCount} AI comments for post: ${post.title.substring(0, 50)}...`);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

      // Generate comments in batches to optimize API usage
      const batchSize = 5;
      const batches = Math.ceil(commentCount / batchSize);
      const allComments = [];

      for (let i = 0; i < batches; i++) {
<<<<<<< HEAD
        const currentBatchSize = Math.min(
          batchSize,
          commentCount - i * batchSize
        );

=======
        const currentBatchSize = Math.min(batchSize, commentCount - (i * batchSize));
        
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        try {
          const batchComments = await this.generateCommentBatch(
            post,
            currentBatchSize,
            platformUsers
          );
          allComments.push(...batchComments);

          // Rate limiting between batches
          if (i < batches - 1) {
            await this.delay(this.rateLimitDelay);
          }
        } catch (error) {
<<<<<<< HEAD
          console.error(
            `Error generating comment batch ${i + 1}:`,
            error.message
          );
=======
          console.error(`Error generating comment batch ${i + 1}:`, error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
          // Continue with other batches even if one fails
        }
      }

      // Save comments to database
<<<<<<< HEAD
      const savedComments = await this.saveCommentsToDatabase(
        allComments,
        post._id
      );

      // Update post comment count
      await Post.findByIdAndUpdate(postId, {
        $inc: { "localEngagement.comments": savedComments.length },
=======
      const savedComments = await this.saveCommentsToDatabase(allComments, post._id);

      // Update post comment count
      await Post.findByIdAndUpdate(postId, {
        $inc: { 'localEngagement.comments': savedComments.length }
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      });

      console.log(`✅ Generated and saved ${savedComments.length} AI comments`);
      return savedComments;
<<<<<<< HEAD
    } catch (error) {
      console.error("Error generating comments for post:", error.message);
=======

    } catch (error) {
      console.error('Error generating comments for post:', error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      throw error;
    }
  }

  /**
   * Generate a batch of comments using OpenAI API
   */
  async generateCommentBatch(post, count, platformUsers) {
    try {
      const prompt = this.buildCommentPrompt(post, count);

      const response = await this.openai.chat.completions.create({
<<<<<<< HEAD
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates realistic, diverse comments for social media posts. Generate comments that are authentic, varied in length and tone, and relevant to the post content. Avoid repetitive patterns.",
          },
          {
            role: "user",
            content: prompt,
          },
=======
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates realistic, diverse comments for social media posts. Generate comments that are authentic, varied in length and tone, and relevant to the post content. Avoid repetitive patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        ],
        max_tokens: 800,
        temperature: 0.8,
        presence_penalty: 0.6,
<<<<<<< HEAD
        frequency_penalty: 0.3,
=======
        frequency_penalty: 0.3
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      });

      const generatedText = response.choices[0]?.message?.content;
      if (!generatedText) {
<<<<<<< HEAD
        throw new Error("No content generated from OpenAI");
      }

      // Parse the generated comments
      const comments = this.parseGeneratedComments(
        generatedText,
        platformUsers
      );
      return comments;
    } catch (error) {
      console.error("Error calling OpenAI API:", error.message);
=======
        throw new Error('No content generated from OpenAI');
      }

      // Parse the generated comments
      const comments = this.parseGeneratedComments(generatedText, platformUsers);
      return comments;

    } catch (error) {
      console.error('Error calling OpenAI API:', error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
      throw error;
    }
  }

  /**
   * Build optimized prompt for comment generation
   */
  buildCommentPrompt(post, count) {
    const postContent = post.content.substring(0, 500); // Limit content to reduce token usage
    const platform = post.platform;

    return `Generate ${count} realistic comments for this ${platform} post:

Title: "${post.title}"
Content: "${postContent}"

Requirements:
- Make comments diverse in length (5-50 words)
- Include different perspectives and tones
- Some supportive, some questioning, some sharing experiences
- Use natural language appropriate for ${platform}
- Number each comment (1., 2., etc.)
- Keep comments relevant to the post topic
- Avoid repetitive phrases or patterns

Format each comment as:
1. [comment text]
2. [comment text]
...`;
  }

  /**
   * Parse generated comments and assign users
   */
  parseGeneratedComments(generatedText, platformUsers) {
    const comments = [];
<<<<<<< HEAD
    const lines = generatedText.split("\n").filter((line) => line.trim());
=======
    const lines = generatedText.split('\n').filter(line => line.trim());
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

    for (const line of lines) {
      const match = line.match(/^\d+\.\s*(.+)$/);
      if (match && match[1]) {
        const commentText = match[1].trim();
<<<<<<< HEAD

=======
        
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        // Skip if comment is too short or too long
        if (commentText.length < 5 || commentText.length > 300) {
          continue;
        }

        // Assign random user
<<<<<<< HEAD
        const randomUser =
          platformUsers[Math.floor(Math.random() * platformUsers.length)];

        // Generate random like count
        const likes = Math.floor(Math.random() * 6);
=======
        const randomUser = platformUsers[Math.floor(Math.random() * platformUsers.length)];
        
        // Generate random like count
        const likes = Math.floor(Math.random() * 200) + 1;
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c

        comments.push({
          content: commentText,
          owner: randomUser._id,
<<<<<<< HEAD
          likes: likes,
=======
          likes: likes
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        });
      }
    }

    return comments;
  }

  /**
   * Save comments to database
   */
  async saveCommentsToDatabase(comments, postId) {
    const savedComments = [];

    for (const commentData of comments) {
      try {
        const comment = await Comment.create({
          content: commentData.content,
          post: postId,
          owner: commentData.owner,
<<<<<<< HEAD
          likes: commentData.likes,
=======
          likes: commentData.likes
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        });

        savedComments.push(comment);
      } catch (error) {
<<<<<<< HEAD
        console.error("Error saving comment:", error.message);
=======
        console.error('Error saving comment:', error.message);
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        // Continue with other comments even if one fails
      }
    }

    return savedComments;
  }

  /**
   * Generate comments for multiple posts
   */
  async generateCommentsForPosts(postIds, commentsPerPost = 12) {
    const results = [];
<<<<<<< HEAD
    commentsPerPost = Math.floor(Math.random() * (10 - 3 + 1)) + 3;

    for (const postId of postIds) {
      try {
        const comments = await this.generateCommentsForPost(
          postId,
          commentsPerPost
        );
        results.push({
          postId,
          success: true,
          commentsGenerated: comments.length,
=======

    for (const postId of postIds) {
      try {
        const comments = await this.generateCommentsForPost(postId, commentsPerPost);
        results.push({
          postId,
          success: true,
          commentsGenerated: comments.length
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        });

        // Rate limiting between posts
        await this.delay(this.rateLimitDelay * 2);
      } catch (error) {
<<<<<<< HEAD
        console.error(
          `Error generating comments for post ${postId}:`,
          error.message
        );
        results.push({
          postId,
          success: false,
          error: error.message,
=======
        console.error(`Error generating comments for post ${postId}:`, error.message);
        results.push({
          postId,
          success: false,
          error: error.message
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
        });
      }
    }

    return results;
  }

  /**
   * Delay utility
   */
  async delay(ms) {
<<<<<<< HEAD
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export { CommentGeneratorService };
=======
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export { CommentGeneratorService };
>>>>>>> 8631fb474849bfe30d9255aaa1200f3e9577988c
