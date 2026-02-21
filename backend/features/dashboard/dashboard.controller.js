const Application = require('../applications/application.model');
const Job = require('../jobs/job.model');
const User = require('../auth/user.model');

// @desc    Get Dashboard Statistics (Role based — real DB queries)
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const role = req.user?.role || 'candidate';
        const userId = req.user.id;

        if (role === 'employer') {
            const [activeJobs, totalApps, shortlisted] = await Promise.all([
                Job.countDocuments({ postedBy: userId }),
                Application.countDocuments({
                    job: { $in: await Job.find({ postedBy: userId }).distinct('_id') },
                }),
                Application.countDocuments({
                    job: { $in: await Job.find({ postedBy: userId }).distinct('_id') },
                    status: 'shortlisted',
                }),
            ]);

            return res.json({
                role: 'employer',
                stats: { activeJobs, totalApplications: totalApps, shortlistedCandidates: shortlisted },
            });
        }

        // ── Candidate Dashboard ──
        const apps = await Application.find({ applicant: userId })
            .populate('job', 'title company location type salary')
            .sort('-appliedAt')
            .lean();

        const statusCounts = { pending: 0, reviewed: 0, shortlisted: 0, rejected: 0, accepted: 0 };
        apps.forEach(a => { if (statusCounts[a.status] !== undefined) statusCounts[a.status]++; });

        // Profile completeness
        const user = await User.findById(userId).lean();
        const completeness = calcCompleteness(user);

        // Recent jobs matching skills (up to 6)
        const skills = user?.skills || [];
        let recommendedJobs = [];
        if (skills.length) {
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

        return res.json({
            role: 'candidate',
            stats: {
                totalApplications: apps.length,
                ...statusCounts,
            },
            completeness,
            applications: apps.slice(0, 10), // latest 10
            recommendedJobs,
        });
    } catch (err) {
        console.error('Dashboard error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/* ── Helper: profile completeness (mirrors user model logic) ── */
function calcCompleteness(u) {
    if (!u) return { score: 0, missing: [] };
    const checks = [
        { key: 'name', label: 'Full Name' },
        { key: 'bio', label: 'Bio' },
        { key: 'headline', label: 'Headline' },
        { key: 'avatar', label: 'Profile Photo' },
        { key: 'resume', label: 'Resume' },
    ];
    const arrayChecks = [
        { key: 'skills', label: 'Skills' },
        { key: 'experience', label: 'Experience' },
        { key: 'education', label: 'Education' },
    ];
    const linkChecks = [{ path: 'socialLinks.linkedin', label: 'LinkedIn Profile' }];

    let filled = 0;
    const total = checks.length + arrayChecks.length + linkChecks.length;
    const missing = [];

    checks.forEach(c => { if (u[c.key]) filled++; else missing.push(c.label); });
    arrayChecks.forEach(c => { if (u[c.key]?.length) filled++; else missing.push(c.label); });
    linkChecks.forEach(c => {
        const val = c.path.split('.').reduce((o, k) => o?.[k], u);
        if (val) filled++; else missing.push(c.label);
    });

    return { score: Math.round((filled / total) * 100), missing };
}

module.exports = { getDashboardStats };
