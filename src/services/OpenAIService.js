import OpenAI from 'openai';

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  /**
   * Generate realistic comments for a post using OpenAI
   */
  async generateComments(postTitle, postContent, commentCount = 12) {
    try {
      const prompt = this.buildCommentPrompt(postTitle, postContent, commentCount);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates realistic, diverse comments for social media posts. Generate comments that feel authentic and varied in tone, length, and perspective."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.8,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      });

      const generatedText = response.choices[0]?.message?.content;
      if (!generatedText) {
        throw new Error('No content generated from OpenAI');
      }

      return this.parseComments(generatedText);
    } catch (error) {
      console.error('Error generating comments with OpenAI:', error.message);
      
      // Fallback to basic comments if OpenAI fails
      return this.generateFallbackComments(commentCount);
    }
  }

  /**
   * Build optimized prompt for comment generation
   */
  buildCommentPrompt(title, content, count) {
    const truncatedContent = content.length > 300 ? content.substring(0, 300) + '...' : content;
    
    return `Generate ${count} realistic, diverse comments for this post:

Title: "${title}"
Content: "${truncatedContent}"

Requirements:
- Mix of short (5-15 words) and medium (15-40 words) comments
- Varied perspectives: supportive, questioning, sharing experiences, adding insights
- Natural language, no formal tone
- Include some with questions, some with personal anecdotes
- No promotional content or spam
- Separate each comment with "---"

Format: Just the comment text, one per line, separated by ---`;
  }

  /**
   * Parse generated comments from OpenAI response
   */
  parseComments(generatedText) {
    const comments = generatedText
      .split('---')
      .map(comment => comment.trim())
      .filter(comment => comment.length > 5 && comment.length < 200)
      .slice(0, 15); // Limit to 15 comments max

    // Ensure we have at least some comments
    if (comments.length < 5) {
      return this.generateFallbackComments(10);
    }

    return comments;
  }

  /**
   * Generate fallback comments if OpenAI fails
   */
  generateFallbackComments(count) {
    const templates = [
      "Thanks for sharing this!",
      "Really interesting perspective.",
      "I've experienced something similar.",
      "Great insights here.",
      "This is really helpful.",
      "Couldn't agree more.",
      "Good point about this.",
      "I learned something new today.",
      "This resonates with me.",
      "Valuable information, thanks!",
      "Makes total sense.",
      "I've been thinking about this too.",
      "Solid advice right here.",
      "This is spot on.",
      "Really appreciate this post."
    ];

    return templates
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(count, templates.length));
  }

  /**
   * Generate comments in batches to optimize API usage
   */
  async generateCommentsInBatches(posts, batchSize = 3) {
    const results = [];
    
    for (let i = 0; i < posts.length; i += batchSize) {
      const batch = posts.slice(i, i + batchSize);
      const batchPromises = batch.map(post => 
        this.generateComments(post.title, post.content, Math.floor(Math.random() * 6) + 10)
      );
      
      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Rate limiting between batches
        if (i + batchSize < posts.length) {
          await this.delay(2000);
        }
      } catch (error) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, error.message);
        // Add fallback comments for failed batch
        batch.forEach(() => results.push(this.generateFallbackComments(10)));
      }
    }
    
    return results;
  }

  /**
   * Delay utility for rate limiting
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export { OpenAIService };