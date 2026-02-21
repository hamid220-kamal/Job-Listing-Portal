const Job = require('./job.model');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('postedBy', 'name company')
            .sort('-createdAt')
            .lean();
        res.status(200).json(jobs);
    } catch (err) {
        console.error('getJobs error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name company email')
            .lean();
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res) => {
    try {
        const job = await Job.create({ ...req.body, postedBy: req.user.id });
        const populated = await job.populate('postedBy', 'name company');
        res.status(201).json(populated);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const msgs = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: msgs.join(', ') });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Owner only)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorised' });
        }
        Object.assign(job, req.body);
        await job.save();
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Owner only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorised' });
        }
        await job.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get employer's own jobs
// @route   GET /api/jobs/mine
// @access  Private (Employer only)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id })
            .sort('-createdAt')
            .lean();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs };
