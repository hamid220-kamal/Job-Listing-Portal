const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name company');
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('postedBy', 'name company');

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    if (!req.body.title || !req.body.company || !req.body.salary) {
        res.status(400).json({ message: 'Please add required fields' });
        return;
    }

    try {
        const job = await Job.create({
            ...req.body,
            postedBy: req.user.id,
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        // Check for user
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Make sure the logged in user matches the job user
        if (job.postedBy.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            res.status(404).json({ message: 'Job not found' });
            return;
        }

        // Check for user
        if (!req.user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        // Make sure the logged in user matches the job user
        if (job.postedBy.toString() !== req.user.id) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        await job.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};
