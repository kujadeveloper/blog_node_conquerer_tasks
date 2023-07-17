const BlogPost = require('../../models/blogpost'); 
const User = require('../../models/user'); 
const Comments = require('../../models/comments'); 
const Category = require('../../models/category'); 

const response = require('../utils/response');
const { Op } = require('sequelize');

exports.createBlogPost = async (req, res) => {
  const { title, content, categoryId } = req.body;
  const { userId } = req;
  try {
    const blogPost = await BlogPost.create({userId:userId, 
                                            categoryId:categoryId,
                                            title:title, 
                                            content:content});
    res.status(201).json(response.get(blogPost));
  } catch (error) {
    let msg = 'An error occurred'
    if(error.message!=undefined)
      msg = error.message
    res.status(500).json(response.error(msg));
  }
};

exports.getBlogPosts = async (req, res) => {
  const {categoryId, search } = req.query;
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  
  let order = req.query.order || 'createdAt,DESC'

  order = order.split(',')
  order = [[order[0].trim(), order[1].trim()]]
  
  try {
    
    let filter = {is_delete:false}

    if(search!=undefined)
    {
      filter['title'] = {[Op.like]: `%${search}%`}
    }
    if(categoryId!=0 && categoryId!=undefined)
    {
      filter['categoryId'] = categoryId
    }


    const {count, rows: blogPosts} = await BlogPost.findAndCountAll({ where: filter, 
                                                                      offset, 
                                                                      limit: pageSize, 
                                                                      include:[
                                                                                {model:User, attributes:['id','fullname','email']},
                                                                                {model:Comments},
                                                                                {model:Category, attributes:['id','name']}
                                                                              ],
                                                                      order: order,
                                                                      
                                                                    });

    res.status(200).json(response.getAll(blogPosts,count,page));
  } catch (error) {
    console.log(error)
    res.status(500).json(response.error('An error occurred'));
  }
};


exports.getCategory = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  
  let order = req.query.order || 'createdAt,DESC'

  order = order.split(',')
  order = [[order[0].trim(), order[1].trim()]]
  
  try {
    
    let filter = {is_delete:false}

    const {count, rows: blogPosts} = await Category.findAndCountAll({ where: filter, 
                                                                      offset, 
                                                                      limit: pageSize, 
                                                                      order: order,
                                                                    });

    res.status(200).json(response.getAll(blogPosts,count,page));
  } catch (error) {
    console.log(error)
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.getMyBlogPosts = async (req, res) => {
  const {categoryId,search } = req.query;
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10;
  const offset = (page - 1) * pageSize;
  const {userId} = req;
  let order = req.query.order || 'createdAt,DESC'

  order = order.split(',')
  order = [[order[0].trim(), order[1].trim()]]
  
  try {
    
    let filter = {is_delete:false, userId:userId}

    if(search!=undefined)
    {
      filter['title'] = {[Op.like]: `%${search}%`}
    }
    if(categoryId!=0 && categoryId!=undefined)
    {
      filter['categoryId'] = categoryId
    }


    const {count, rows: blogPosts} = await BlogPost.findAndCountAll({ where: filter, 
                                                                      order: order,
                                                                      offset, 
                                                                      limit: pageSize, 
                                                                      include:[{model:User, attributes:['id','fullname','email']}],
                                                                    });

    res.status(200).json(response.getAll(blogPosts,count,page));
  } catch (error) {
    console.log(error)
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
    res.status(200).json(response.success(blogPost));
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
    const [count, updateComments] = await Comments.update({is_delete:true}, {
      where: {blogId: blog.id, is_delete:false},
      returning: true, // Return the updated records
    });
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
    const blog = await BlogPost.findOne({ where: {is_delete:false, id: blogPostId}})
    if (!blog) {
      // User not found
      res.status(409).json(response.error('blog not found'));
    }
    const comment = await Comments.create({userId:userId, blogId:blogPostId, content:content});
    res.status(201).json(response.success(comment));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.getCommentsByBlogPostId = async (req, res) => {
  
  const { blogPostId } = req.params;
  let order = req.query.order || 'createdAt,DESC'
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10;
  let filter = {is_delete:false} 
  const offset = (page - 1) * pageSize;

  order = order.split(',')
  order = [[order[0].trim(), order[1].trim()]]
  
 

  if(blogPostId!=0)
  {
    filter['blogId']= blogPostId
  }

  try {
    const {count, rows: comments} = await Comments.findAndCountAll({ where: filter,
                                                                    include:[{model:User, attributes:['id','fullname','email']}],
                                                                    offset, 
                                                                    limit: pageSize, 
                                                                    order: order,
                                                                  });
    res.status(200).json(response.getAll(comments,count,page));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};

exports.getMyComments = async (req, res) => {
  
  const { blogPostId } = req.params;
  let order = req.query.order || 'createdAt,DESC'
  const page = parseInt(req.query.page) || 1; // Current page number
  const pageSize = parseInt(req.query.pageSize) || 10
  const offset = (page - 1) * pageSize;
  const {userId} = req;
  let filter = {is_delete:false, userId:userId} 
  order = order.split(',')
  order = [[order[0].trim(), order[1].trim()]]
  
 
  if(blogPostId!=0 && blogPostId!=undefined)
  {
    filter['blogId']= blogPostId
  }

  try {
    const {count, rows: comments} = await Comments.findAndCountAll({ where: filter,
                                                                    include:[{model:User, attributes:['id','fullname','email']}],
                                                                    offset, 
                                                                    limit: pageSize, 
                                                                    order: order,
                                                                  });
    res.status(200).json(response.getAll(comments,count,page));
  } catch (error) {
    console.error(error);
    res.status(500).json(response.error('An error occurred'));
  }
};
