const Application = require('./application.model');
const Job = require('../jobs/job.model');

// Dummy Application Controller with In-Memory Data

// In-memory array to store applications
let applications = [
    {
        _id: 'app-1',
        job: {
            _id: 'job-1',
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'Remote'
        },
        applicant: {
            _id: 'dummy-user-id',
            name: 'Dummy User',
            email: 'dummy@example.com'
        },
        resume: 'https://example.com/resume.pdf',
        coverLetter: 'I am a great fit.',
        appliedAt: new Date(),
    }
];

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private
const applyJob = async (req, res) => {
    // Check if already applied (simplified)
    const existingApplication = applications.find(
        app => app.job._id === req.params.jobId && app.applicant._id === req.user.id
    );

    if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = {
        _id: 'app-' + Date.now(),
        // In a real app we'd look up the job details, here we mock it or assume it's passed/known
        job: {
            _id: req.params.jobId,
            title: 'Mock Job Title', // hard to get real title without looking up in job controller or DB
            company: 'Mock Company',
            location: 'Mock Location'
        },
        applicant: {
            _id: req.user.id,
            name: req.user.name,
            email: req.user.email
        },
        resume: req.body.resume,
        coverLetter: req.body.coverLetter,
        appliedAt: new Date()
    };

    applications.push(application);

    res.status(201).json(application);
};

// @desc    Get user applications
// @route   GET /api/applications/me
// @access  Private
const getMyApplications = async (req, res) => {
    const myApps = applications.filter(app => app.applicant._id === req.user.id);
    res.status(200).json(myApps);
};

// @desc    Get applications for a job (Employer only)
// @route   GET /api/applications/job/:jobId
// @access  Private
const getJobApplications = async (req, res) => {
    // In a real app we'd check if user is job owner. 
    // Here we'll just return applications for the job if the user is an employer (or just allow it)

    // Simple check if user is employer (if we had role in req.user)
    // if (req.user.role !== 'employer') ...

    const jobApps = applications.filter(app => app.job._id === req.params.jobId);
    res.status(200).json(jobApps);
};

module.exports = {
    applyJob,
    getMyApplications,
    getJobApplications
};
