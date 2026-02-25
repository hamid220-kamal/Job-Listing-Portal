const mongoose = require('mongoose');
const Job = require('./job.model');

// --- REMOVED: let jobs = [...] array has been deleted ---

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = async (req, res) => {
    try {
        // CHANGED: Instead of returning the 'jobs' array, we query MongoDB
        const allJobs = await Job.find().sort({ createdAt: -1 });
        res.status(200).json(allJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = async (req, res) => {
    try {
        // CHANGED: Using findById instead of array.find()
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(404).json({ message: 'Invalid Job ID' });
    }
};

// @desc    Create new job
const createJob = async (req, res) => {
    if (!req.body.title || !req.body.company || !req.body.salary) {
        return res.status(400).json({ message: 'Please add required fields' });
    }

    try {
        const newJob = await Job.create({
            ...req.body,
            postedBy: req.user.id,
        });

        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: 'Error creating job', error: error.message });
    }
};

// @desc    Update job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Verify ownership
        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await job.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user jobs
// @route   GET /api/jobs/mine
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get jobs by employer ID
// @route   GET /api/jobs/employer/:id
const getJobsByEmployer = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.params.id }).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getJobsByEmployer,
};
