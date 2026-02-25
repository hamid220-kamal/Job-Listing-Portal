const Job = require('../jobs/job.model');
const User = require('../auth/user.model');

// @desc    Search jobs with filters
// ... (searchJobs remains same)
const searchJobs = async (req, res) => {
    try {
        const { keyword, location, type, sort, page = 1, limit = 20 } = req.query;
        // Robust query for active or legacy jobs
        const query = {
            $or: [
                { status: 'active' },
                { status: { $exists: false } },
                { status: null },
                { status: '' }
            ]
        };

        console.log('Search Query:', JSON.stringify(query));

        // Keyword search — matches title, company, or description using Text Index
        if (keyword && typeof keyword === 'string' && keyword.trim()) {
            query.$text = { $search: keyword.trim() };
        }

        // Location filter (case-insensitive partial match)
        if (location && typeof location === 'string' && location.trim()) {
            query.location = { $regex: location.trim(), $options: 'i' };
        }

        // Job type filter — can be comma-separated (e.g., "Full-time,Part-time")
        if (type && typeof type === 'string' && type.trim()) {
            const types = type.split(',').map(t => t.trim()).filter(Boolean);
            if (types.length > 0) {
                query.type = { $in: types };
            }
        }

        // Sort options
        let sortOption = { createdAt: -1 }; // default: newest
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'title') sortOption = { title: 1 };

        // Pagination parameters
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 20);
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
    } catch (err) {
        console.error('searchJobs error:', err);
        res.status(500).json({ message: 'Could not search jobs. Please try again.' });
    }
};

// @desc    Get all company profiles (Employers)
// @route   GET /api/search/companies
// @access  Public
const getCompanies = async (req, res) => {
    try {
        // Find all employers who have a company name
        const employers = await User.find({
            role: 'employer',
            company: { $exists: true, $ne: '' }
        })
            .select('name company logo industry companyDescription website location')
            .lean();

        // Get job counts for these employers
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
    } catch (err) {
        console.error('getCompanies error:', err);
        res.status(500).json({ message: 'Could not fetch companies. Please try again.' });
    }
};

module.exports = { searchJobs, getCompanies };
