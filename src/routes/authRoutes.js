const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/update-me', authenticateToken, authController.update);
router.post('/update-pass', authenticateToken, authController.updatePass);
module.exports = router;
