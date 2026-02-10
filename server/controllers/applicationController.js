const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private
const applyJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user.id,
            resume: req.body.resume, // URL
            coverLetter: req.body.coverLetter
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user applications
// @route   GET /api/applications/me
// @access  Private
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title company location')
            .sort('-appliedAt');

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a job (Employer only)
// @route   GET /api/applications/job/:jobId
// @access  Private
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user is the job owner
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email');

        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyJob,
    getMyApplications,
    getJobApplications
};
