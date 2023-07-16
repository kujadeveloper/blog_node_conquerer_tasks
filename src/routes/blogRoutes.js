const express = require('express');
const blogController = require('../controllers/blogController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/blog-posts', authenticateToken, blogController.createBlogPost);
router.get('/blog-posts', blogController.getBlogPosts);
router.put('/blog-posts/:blogPostId', authenticateToken, blogController.updateBlogPost);
router.delete('/blog-posts/:blogPostId', authenticateToken, blogController.deleteBlogPost);
router.post('/blog-posts/:blogPostId/comments', authenticateToken, blogController.createComment);
router.get('/blog-posts/:blogPostId/comments', blogController.getCommentsByBlogPostId);

module.exports = router;
