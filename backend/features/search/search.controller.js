const asyncHandler = require('express-async-handler');
const Job = require('../jobs/job.model');
const User = require('../auth/user.model');

// @desc    Search jobs with filters
// @route   GET /api/search
// @access  Public
const searchJobs = asyncHandler(async (req, res) => {
    const { keyword, location, type, sort, page = 1, limit = 20 } = req.query;
    
    // Robust query for active or legacy jobs
    const query: any = {
        $or: [
            { status: 'active' },
            { status: { $exists: false } },
            { status: null },
            { status: '' }
        ]
    };

    // Keyword search — matches title, company, or description using Text Index
    if (keyword && typeof keyword === 'string' && keyword.trim()) {
        query.$text = { $search: keyword.trim() };
    }

    // Location filter (case-insensitive partial match)
    if (location && typeof location === 'string' && location.trim()) {
        query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Job type filter
    if (type && typeof type === 'string' && type.trim()) {
        const types = type.split(',').map(t => t.trim()).filter(Boolean);
        if (types.length > 0) {
            query.type = { $in: types };
        }
    }

    // Category filter
    if (req.query.category && typeof req.query.category === 'string' && req.query.category.trim()) {
        query.category = req.query.category.trim();
    }

    // Sort options
    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title') sortOption = { title: 1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limitNum = Math.max(1, parseInt(limit as string) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
        Job.find(query)
            .populate('postedBy', 'name company avatar')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum)
            .lean(),
        Job.countDocuments(query),
    ]);

    res.json({
        jobs: jobs.map(j => ({
            ...j,
            id: j._id,
            postedAt: j.createdAt ? new Date(j.createdAt).toLocaleDateString() : 'Just now'
        })),
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
    });
});

// @desc    Get all company profiles (Employers)
// @route   GET /api/search/companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
    const employers = await User.find({
        role: 'employer',
        company: { $exists: true, $ne: '' }
    })
    .select('name company logo industry companyDescription website location')
    .lean();

    const companyData = await Promise.all(employers.map(async (emp) => {
        const count = await Job.countDocuments({
            postedBy: emp._id,
            status: 'active'
        });
        return {
            ...emp,
            activeJobsCount: count
        };
    }));

    res.json(companyData);
});

module.exports = { searchJobs, getCompanies };
