const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const subscriptionController = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// Validation middleware
const orderValidation = [
  body('plan')
    .isIn(['basic', 'premium'])
    .withMessage('Invalid plan selected')
];

// All routes are protected
router.use(protect);

// Subscription routes
router.post('/orders', orderValidation, subscriptionController.createOrder);
router.post('/verify-payment', subscriptionController.verifyPayment);
router.get('/details', subscriptionController.getSubscriptionDetails);
router.get('/payments', subscriptionController.getPaymentHistory);
router.post('/cancel', subscriptionController.cancelSubscription);

module.exports = router; 