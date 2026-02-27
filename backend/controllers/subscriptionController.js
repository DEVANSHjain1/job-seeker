const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create payment order
exports.createOrder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan } = req.body;
    const userId = req.user.id;

    // Get plan details
    const planDetails = Payment.getPlanDetails(plan);
    if (!planDetails) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: planDetails.amount * 100, // Amount in paise
      currency: planDetails.currency,
      receipt: `order_${Date.now()}`,
      notes: {
        userId,
        plan,
        credits: planDetails.credits
      }
    });

    res.json({
      success: true,
      order,
      planDetails
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order'
    });
  }
};

// Verify and process payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Verify payment signature
    const crypto = require('crypto');
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get order details from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);
    const { userId, plan, credits } = order.notes;

    // Create payment record
    const payment = new Payment({
      user: userId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount: order.amount / 100,
      currency: order.currency,
      plan,
      credits: parseInt(credits),
      status: 'completed',
      paymentMethod: 'razorpay'
    });

    await payment.save();

    // Update user credits and subscription
    const user = await User.findById(userId);
    user.addCredits(parseInt(credits));
    user.subscription = {
      plan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      status: 'active'
    };
    await user.save();

    res.json({
      success: true,
      payment,
      user: {
        id: user._id,
        email: user.email,
        credits: user.credits,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// Get user's subscription details
exports.getSubscriptionDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('subscription credits')
      .populate({
        path: 'subscription',
        select: 'plan startDate endDate status'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      subscription: user.subscription,
      credits: user.credits
    });
  } catch (error) {
    console.error('Get subscription details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription details'
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.subscription.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'No active subscription to cancel'
      });
    }

    user.subscription.status = 'cancelled';
    await user.save();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription'
    });
  }
}; 