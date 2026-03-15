const asyncHandler = require('express-async-handler');
const Application = require('./application.model');
const Job = require('../jobs/job.model');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyJob = asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;
    const userId = req.user._id || req.user.id;

    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Role check is handled by middleware (authorize('candidate')), 
    // but we add a safety check here too.
    if (req.user.role !== 'candidate') {
        res.status(403);
        throw new Error('Only candidates can apply for jobs');
    }

    // Validate resume is provided
    if (!req.body.resume && !req.user.resume) {
        res.status(400);
        throw new Error('Please upload a resume in your profile before applying');
    }

    const application = await Application.create({
        job: jobId,
        applicant: userId,
        resume: req.body.resume || req.user.resume,
        coverLetter: req.body.coverLetter || '',
    });

    const populated = await application.populate('job', 'title company location type salary');
    res.status(201).json(populated);
});

// @desc    Get current user's applications
// @route   GET /api/applications/me
// @access  Private
const getMyApplications = asyncHandler(async (req, res) => {
    const apps = await Application.find({ applicant: req.user._id || req.user.id })
        .populate('job', 'title company location type salary status')
        .sort('-appliedAt')
        .lean();
    res.status(200).json(apps);
});

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
const getJobApplications = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role !== 'employer') {
        res.status(403);
        throw new Error('Only employers can view job applications');
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    if (job.postedBy.toString() !== (req.user._id || req.user.id).toString()) {
        res.status(403);
        throw new Error('Not authorised to view applications for this job');
    }

    const apps = await Application.find({ job: req.params.jobId })
        .populate('applicant', 'name email avatar headline skills')
        .sort('-appliedAt')
        .lean();
    res.status(200).json(apps);
});

// @desc    Update application status (Employer only)
// @route   PATCH /api/applications/:id/status
// @access  Private (Employer only)
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const valid = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    if (!valid.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Must be one of: ${valid.join(', ')}`);
    }

    const app = await Application.findById(req.params.id).populate('job');
    if (!app) {
        res.status(404);
        throw new Error('Application not found');
    }

    // Verify employer owns the job
    if (app.job.postedBy.toString() !== (req.user._id || req.user.id).toString()) {
        res.status(403);
        throw new Error('Not authorised to update this application');
    }

    app.status = status;
    await app.save();

    const populated = await app.populate('applicant', 'name email avatar headline skills');
    res.status(200).json(populated);
});

// @desc    Get all applications for an employer (across all their jobs)
// @route   GET /api/applications/employer
// @access  Private (Employer only)
const getEmployerApplications = asyncHandler(async (req, res) => {
    if (!req.user || req.user.role !== 'employer') {
        res.status(403);
        throw new Error('Only employers can view applications');
    }

    // First find all jobs by this employer
    const employerJobs = await Job.find({ postedBy: req.user._id || req.user.id }).select('_id');
    const jobIds = employerJobs.map(j => j._id);

    const apps = await Application.find({ job: { $in: jobIds } })
        .populate('applicant', 'name email avatar headline skills')
        .populate('job', 'title location type status')
        .sort('-appliedAt')
        .lean();

    res.status(200).json(apps);
});

module.exports = { 
    applyJob, 
    getMyApplications, 
    getJobApplications, 
    updateApplicationStatus,
    getEmployerApplications
};
