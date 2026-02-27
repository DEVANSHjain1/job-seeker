const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Validation middleware
const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name').notEmpty().withMessage('Name is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.post('/social-login', userController.socialLogin);

// Protected routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router; 