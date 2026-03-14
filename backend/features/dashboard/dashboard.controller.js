const asyncHandler = require('express-async-handler');
const Application = require('../applications/application.model');
const Job = require('../jobs/job.model');
const User = require('../auth/user.model');

// @desc    Get Dashboard Statistics (Role based)
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const role = req.user?.role || 'candidate';
    const userId = req.user._id || req.user.id;

    if (role === 'employer') {
        const jobIds = await Job.find({ postedBy: userId }).distinct('_id');
        const [totalApps, shortlisted] = await Promise.all([
            Application.countDocuments({ job: { $in: jobIds } }),
            Application.countDocuments({ job: { $in: jobIds }, status: 'shortlisted' }),
        ]);

        return res.json({
            role: 'employer',
            stats: { 
                activeJobs: jobIds.length, 
                totalApplications: totalApps, 
                shortlistedCandidates: shortlisted 
            },
        });
    }

    // ── Candidate Dashboard ──
    const apps = await Application.find({ applicant: userId })
        .populate('job', 'title company location type salary')
        .sort('-appliedAt')
        .lean();

    const statusCounts = { pending: 0, reviewed: 0, shortlisted: 0, rejected: 0, accepted: 0 };
    apps.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });

    const user = await User.findById(userId).populate('bookmarks', 'title company location type salary createdAt');
    const completeness = user ? user.getCompleteness() : { score: 0, missing: [] };
    const savedJobs = user?.bookmarks || [];

    const skills = user?.skills || [];
    let recommendedJobs = [];
    
    if (skills.length > 0) {
        recommendedJobs = await Job.find({
            $or: [
                { requirements: { $in: skills.map(s => new RegExp(s, 'i')) } },
                { title: { $in: skills.map(s => new RegExp(s, 'i')) } },
            ],
        })
        .sort('-createdAt')
        .limit(6)
        .select('title company location type salary createdAt')
        .lean();
    }

    if (recommendedJobs.length < 6) {
        const ids = recommendedJobs.map(j => j._id);
        const extra = await Job.find({ _id: { $nin: ids } })
            .sort('-createdAt')
            .limit(6 - recommendedJobs.length)
            .select('title company location type salary createdAt')
            .lean();
        recommendedJobs = [...recommendedJobs, ...extra];
    }

    res.json({
        role: 'candidate',
        stats: {
            totalApplications: apps.length,
            ...statusCounts,
            totalBookmarks: savedJobs.length
        },
        completeness,
        applications: apps.slice(0, 10),
        recommendedJobs,
        savedJobs: savedJobs.slice(0, 5), // Include first 5 saved jobs
    });
});

module.exports = { getDashboardStats };
