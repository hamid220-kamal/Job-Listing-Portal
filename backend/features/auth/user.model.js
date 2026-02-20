const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    role: {
        type: String,
        enum: ['candidate', 'employer'],
        default: 'candidate'
    },
    // Candidate-specific fields
    bio: {
        type: String,
        default: ''
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: String,
        default: ''
    },
    education: {
        type: String,
        default: ''
    },
    resume: {
        type: String,
        default: ''
    },
    // Employer-specific fields
    company: {
        type: String,
        default: ''
    },
    companyDescription: {
        type: String,
        default: ''
    },
    industry: {
        type: String,
        default: ''
    },
    companySize: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    logo: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
