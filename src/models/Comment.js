const db = require('../../db');

class Comment {
  static async createComment(userId, blogPostId, content) {
    const result = await db.query(
      'INSERT INTO comments (user_id, blog_post_id, content) VALUES ($1, $2, $3) RETURNING id, content',
      [userId, blogPostId, content]
    );
    return result.rows[0];
  }

  static async getCommentsByBlogPostId(blogPostId) {
    const result = await db.query('SELECT * FROM comments WHERE blog_post_id = $1', [blogPostId]);
    return result.rows;
  }
}

module.exports = Comment;
