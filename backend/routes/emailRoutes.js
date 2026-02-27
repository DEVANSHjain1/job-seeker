const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const emailController = require('../controllers/emailController');
const { protect, checkCredits } = require('../middleware/auth');

// Validation middleware
const applicationValidation = [
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required'),
  body('jobDescription').optional(),
  body('additionalDetails').optional(),
  body('resumeUrl').optional().isURL().withMessage('Invalid resume URL')
];

// All routes are protected and require credits
router.use(protect, checkCredits);

// Job application routes
router.post('/applications', applicationValidation, emailController.createApplication);
router.get('/applications', emailController.getApplications);
router.get('/applications/:id', emailController.getApplication);
router.put('/applications/:id', emailController.updateApplication);
router.post('/applications/:id/send', emailController.markAsSent);
router.post('/applications/:id/archive', emailController.archiveApplication);

module.exports = router; 