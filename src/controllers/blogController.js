const Comment = require('../models/Comment');
const BlogPost = require('../../models/blogpost'); 
const Comments = require('../../models/comments'); 
const response = require('../utils/response');


exports.createBlogPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req;


  try {
    const blogPost = await BlogPost.create({userId:userId, 
                                            title:title, 
                                            content:content});
    res.status(201).json(response.get(blogPost));
  } catch (error) {
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.getBlogPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10;

    const offset = (page - 1) * pageSize;

    const {count, rows: blogPosts} = await BlogPost.findAndCountAll({ where: {is_delete:false}, offset, limit: pageSize, });
    res.status(200).json(response.getAll(blogPosts,count,page));
  } catch (error) {
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.updateBlogPost = async (req, res) => {
  const { title, content } = req.body;
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    const blog = await BlogPost.findOne({ where: {is_delete:false, id: blogPostId, userId: userId}})

    if (!blog) {
      // User not found
      res.status(409).json(response.error('blog not found'));
    }

    const blogPost = await blog.update({title, content});
    res.status(200).json(response.success(blogPosts));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.deleteBlogPost = async (req, res) => {
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    const blog = await BlogPost.findOne({ where: {is_delete:false, id: blogPostId, userId: userId}})
    if (!blog) {
      // User not found
      res.status(409).json(response.error('blog not found'));
    }
    const blogPost = await blog.update({is_delete:true});
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.createComment = async (req, res) => {
  const { content } = req.body;
  const { blogPostId } = req.params;
  const { userId } = req;

  try {
    const comment = await Comments.create({userId:userId, blogId:blogPostId, content:content});
    res.status(201).json(response.success(comment));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.getCommentsByBlogPostId = async (req, res) => {
  const { blogPostId } = req.params;
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10;

  const offset = (page - 1) * pageSize;
  try {
    const {count, rows: comments} = await Comments.findAndCountAll({ where: {is_delete:false, blogId:blogPostId}, offset, limit: pageSize, });
    res.status(200).json(response.getAll(comments,count,page));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};
