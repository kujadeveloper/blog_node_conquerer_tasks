const db = require('../../db');
const  BlogPost = require('../../models/blogpost'); 
class BlogPost1 {
  static async createBlogPost(userId, title, content) {
    const result = await BlogModel.create({userId:userId, title:title, content:content});
    return result;
  }

  static async getBlogPostById(blogPostId) {
    const result = await BlogModel.findByPk(blogPostId);
    return result;
  }

  static async updateBlogPost(blogPostId, title, content) {
    const result = await db.query(
      'UPDATE blog_posts SET title = $1, content = $2 WHERE id = $3 RETURNING id, title, content',
      [title, content, blogPostId]
    );
    return result.rows[0];
  }

  static async deleteBlogPost(blogPostId) {
    const result = await db.query('DELETE FROM blog_posts WHERE id = $1 RETURNING id', [blogPostId]);
    return result.rows[0];
  }

  static async getBlogPosts() {
    const result = await BlogPost.findAll();
    return result;
  }
}

module.exports = BlogPost1;
