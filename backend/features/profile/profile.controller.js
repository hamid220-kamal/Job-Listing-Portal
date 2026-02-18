const asyncHandler = require('express-async-handler');
const User = require('../auth/user.model');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update basic fields
    user.name = req.body.name || user.name;

    // Update role-specific fields
    if (user.role === 'candidate') {
        user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
        user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;
        user.experience = req.body.experience !== undefined ? req.body.experience : user.experience;
        user.education = req.body.education !== undefined ? req.body.education : user.education;
        user.resume = req.body.resume !== undefined ? req.body.resume : user.resume;
    } else if (user.role === 'employer') {
        user.company = req.body.company !== undefined ? req.body.company : user.company;
        user.companyDescription = req.body.companyDescription !== undefined ? req.body.companyDescription : user.companyDescription;
        user.industry = req.body.industry !== undefined ? req.body.industry : user.industry;
        user.companySize = req.body.companySize !== undefined ? req.body.companySize : user.companySize;
        user.website = req.body.website !== undefined ? req.body.website : user.website;
        user.logo = req.body.logo !== undefined ? req.body.logo : user.logo;
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        experience: updatedUser.experience,
        education: updatedUser.education,
        resume: updatedUser.resume,
        company: updatedUser.company,
        companyDescription: updatedUser.companyDescription,
        industry: updatedUser.industry,
        companySize: updatedUser.companySize,
        website: updatedUser.website,
        logo: updatedUser.logo,
    });
});

module.exports = {
    getProfile,
    updateProfile,
};
