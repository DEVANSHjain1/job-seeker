const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const Airtable = require('airtable');
const { validationResult } = require('express-validator');

// Initialize Airtable
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY });
const base = airtable.base(process.env.AIRTABLE_BASE_ID);

// Generate email content
const generateEmailContent = async (jobDetails) => {
  try {
    // TODO: Integrate with AI service for email generation
    // For now, return a template
    return `Dear Hiring Manager,

I hope this email finds you well. I am writing to express my strong interest in the ${jobDetails.jobTitle} position at ${jobDetails.companyName}.

${jobDetails.jobDescription ? `I was particularly drawn to this role because ${jobDetails.jobDescription}` : ''}

${jobDetails.additionalDetails ? `Additional Information: ${jobDetails.additionalDetails}` : ''}

I have attached my resume for your review.

Thank you for considering my application.

Best regards,
[Your Name]`;
  } catch (error) {
    console.error('Email generation error:', error);
    throw new Error('Failed to generate email content');
  }
};

// Create new job application and generate email
exports.createApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { companyName, jobTitle, jobDescription, additionalDetails, resumeUrl } = req.body;
    const userId = req.user.id;

    // Check user credits
    const user = await User.findById(userId);
    if (!user.hasSufficientCredits()) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient credits. Please purchase more credits to continue.'
      });
    }

    // Generate email content
    const generatedEmail = await generateEmailContent({
      companyName,
      jobTitle,
      jobDescription,
      additionalDetails
    });

    // Create job application
    const jobApplication = new JobApplication({
      user: userId,
      companyName,
      jobTitle,
      jobDescription,
      additionalDetails,
      resumeUrl,
      generatedEmail
    });

    await jobApplication.save();

    // Deduct credit
    user.deductCredits();
    await user.save();

    // Store in Airtable
    try {
      const airtableRecord = await base('JobApplications').create([
        {
          fields: {
            UserID: userId,
            CompanyName: companyName,
            JobTitle: jobTitle,
            JobDescription: jobDescription,
            AdditionalDetails: additionalDetails,
            ResumeUrl: resumeUrl,
            GeneratedEmail: generatedEmail,
            Status: 'draft'
          }
        }
      ]);

      jobApplication.airtableRecordId = airtableRecord[0].id;
      await jobApplication.save();
    } catch (airtableError) {
      console.error('Airtable sync error:', airtableError);
      // Continue even if Airtable sync fails
    }

    res.status(201).json({
      success: true,
      jobApplication,
      remainingCredits: user.credits
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job application'
    });
  }
};

// Get user's job applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job applications'
    });
  }
};

// Get single job application
exports.getApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job application'
    });
  }
};

// Update job application
exports.updateApplication = async (req, res) => {
  try {
    const { generatedEmail } = req.body;
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    application.generatedEmail = generatedEmail;
    await application.save();

    // Update Airtable
    if (application.airtableRecordId) {
      try {
        await base('JobApplications').update(application.airtableRecordId, {
          fields: {
            GeneratedEmail: generatedEmail
          }
        });
      } catch (airtableError) {
        console.error('Airtable update error:', airtableError);
      }
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job application'
    });
  }
};

// Mark application as sent
exports.markAsSent = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    application.markAsSent();
    await application.save();

    // Update Airtable
    if (application.airtableRecordId) {
      try {
        await base('JobApplications').update(application.airtableRecordId, {
          fields: {
            Status: 'sent',
            SentAt: application.sentAt
          }
        });
      } catch (airtableError) {
        console.error('Airtable update error:', airtableError);
      }
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Mark as sent error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking application as sent'
    });
  }
};

// Archive application
exports.archiveApplication = async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    application.archive();
    await application.save();

    // Update Airtable
    if (application.airtableRecordId) {
      try {
        await base('JobApplications').update(application.airtableRecordId, {
          fields: {
            Status: 'archived'
          }
        });
      } catch (airtableError) {
        console.error('Airtable update error:', airtableError);
      }
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Archive application error:', error);
    res.status(500).json({
      success: false,
      message: 'Error archiving application'
    });
  }
}; 