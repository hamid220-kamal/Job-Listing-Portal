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
// @route   POST /api/jobs
const createJob = async (req, res) => {
    if (!req.body.title || !req.body.company || !req.body.salary) {
        return res.status(400).json({ message: 'Please add required fields' });
    }

    try {
        // CHANGED: Using Job.create() to save permanently to MongoDB
        // This ensures the dashboard's countDocuments() can actually see it!
        const newJob = await Job.create({
            ...req.body,
            employer: req.user.id, // Links job to the logged-in user
            postedBy: {
                _id: req.user.id,
                name: req.user.name,
                company: req.body.company
            }
        });

        res.status(201).json(newJob);
    } catch (error) {
        res.status(400).json({ message: 'Error creating job' });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
    try {
        // CHANGED: Using findByIdAndUpdate instead of array indexing
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Verify ownership (security check)
        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Returns the updated document
        );

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
    try {
        // CHANGED: Using findById and deleteOne instead of array.filter()
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await job.deleteOne();
        res.status(200).json({ id: req.params.id });
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
};
