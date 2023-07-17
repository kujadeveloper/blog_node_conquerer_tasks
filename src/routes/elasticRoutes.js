const express = require('express');
const elasticSearchController = require('../controllers/elasticSearchController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/category-rates-all', elasticSearchController.getCategory);


module.exports = router;
