const asyncHandler = require('express-async-handler');
const Job = require('./job.model');

// --- REMOVED: let jobs = [...] array has been deleted ---

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = asyncHandler(async (req, res) => {
    const { type, location, query, page = 1, limit = 12 } = req.query;
    
    let filter: any = {};
    if (type) filter.type = type;
    if (req.query.category) filter.category = req.query.category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (query) {
        // Simple search if no complex text index query is provided
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { company: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const jobs = await Job.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const total = await Job.countDocuments(filter);

    res.status(200).json({
        jobs,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
    });
});

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    res.status(200).json(job);
});

// @desc    Create new job
const createJob = asyncHandler(async (req, res) => {
    const { title, company, location, type, category, salary, description, requirements, qualifications, responsibilities } = req.body;

    if (!title || !company || !salary) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    const newJob = await Job.create({
        title,
        company,
        location,
        type,
        category,
        salary,
        description,
        requirements,
        qualifications,
        responsibilities,
        postedBy: req.user._id || req.user.id,
    });

    res.status(201).json(newJob);
});

// @desc    Update job
const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    // Verify ownership
    if (job.postedBy.toString() !== (req.user._id || req.user.id).toString()) {
        res.status(401);
        throw new Error('Not authorised to update this job');
    }

    // Explicitly update fields to prevent injection
    const allowed = ['title', 'location', 'type', 'category', 'salary', 'description', 'requirements', 'qualifications', 'responsibilities', 'status'];
    allowed.forEach(field => {
        if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
});

// @desc    Delete job
const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found');
    }

    if (job.postedBy.toString() !== (req.user._id || req.user.id).toString()) {
        res.status(401);
        throw new Error('Not authorised to delete this job');
    }

    await job.deleteOne(); // This triggers the pre('deleteOne') middleware
    res.status(200).json({ id: req.params.id, message: 'Job deleted and applications cleared' });
});

// @desc    Get logged in user jobs
// @route   GET /api/jobs/mine
const getMyJobs = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ postedBy: req.user._id || req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
});

// @desc    Get jobs by employer ID
// @route   GET /api/jobs/employer/:id
const getJobsByEmployer = asyncHandler(async (req, res) => {
    const jobs = await Job.find({ postedBy: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
});

module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
    getMyJobs,
    getJobsByEmployer,
};
