const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/user', authenticateToken, authController.update);
router.delete('/user', authenticateToken, authController.delete);
router.post('/update-pass', authenticateToken, authController.updatePass);
module.exports = router;
