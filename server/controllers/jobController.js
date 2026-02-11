// Dummy Job Controller with In-Memory Data

// In-memory array to store jobs
let jobs = [
    {
        _id: 'job-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'Remote',
        description: 'Great job opportunity.',
        salary: '120000',
        postedBy: {
            _id: 'dummy-user-id',
            name: 'Dummy User',
            company: 'Tech Corp'
        },
        createdAt: new Date(),
    },
    {
        _id: 'job-2',
        title: 'Product Manager',
        company: 'Product Co',
        location: 'New York',
        description: 'Lead the product team.',
        salary: '140000',
        postedBy: {
            _id: 'dummy-user-id-2',
            name: 'Another User',
            company: 'Product Co'
        },
        createdAt: new Date(),
    }
];

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    res.status(200).json(jobs);
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
    const job = jobs.find(j => j._id === req.params.id);

    if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }

    res.status(200).json(job);
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
const createJob = async (req, res) => {
    if (!req.body.title || !req.body.company || !req.body.salary) {
        res.status(400).json({ message: 'Please add required fields' });
        return;
    }

    const newJob = {
        _id: 'job-' + Date.now(),
        ...req.body,
        postedBy: {
            _id: req.user.id,
            name: req.user.name,
            company: req.body.company
        },
        createdAt: new Date(),
    };

    jobs.push(newJob);

    res.status(201).json(newJob);
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = async (req, res) => {
    const jobIndex = jobs.findIndex(j => j._id === req.params.id);

    if (jobIndex === -1) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }

    const job = jobs[jobIndex];

    // Check for user (simplified for dummy)
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Update job
    jobs[jobIndex] = { ...job, ...req.body };

    res.status(200).json(jobs[jobIndex]);
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = async (req, res) => {
    const jobIndex = jobs.findIndex(j => j._id === req.params.id);

    if (jobIndex === -1) {
        res.status(404).json({ message: 'Job not found' });
        return;
    }

    const job = jobs[jobIndex];

    // Check for user (simplified)
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Remove job
    jobs = jobs.filter(j => j._id !== req.params.id);

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob,
};
