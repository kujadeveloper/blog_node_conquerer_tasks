const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

exports.createBlogPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req;

  try {
    const blogPost = await BlogPost.createBlogPost(userId, title, content);
    res.status(201).json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.getBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.getBlogPosts();
    res.status(200).json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.updateBlogPost = async (req, res) => {
  const { title, content } = req.body;
  const { blogPostId } = req.params;

  try {
    const blogPost = await BlogPost.updateBlogPost(blogPostId, title, content);
    res.status(200).json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.deleteBlogPost = async (req, res) => {
  const { blogPostId } = req.params;

  try {
    await BlogPost.deleteBlogPost(blogPostId);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.createComment = async (req, res) => {
  const { content } = req.body;
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    const comment = await Comment.createComment(userId, blogPostId, content);
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

exports.getCommentsByBlogPostId = async (req, res) => {
  const { blogPostId } = req.params;

  try {
    const comments = await Comment.getCommentsByBlogPostId(blogPostId);
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
