const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true,
        maxlength: [100, 'Title can not be more than 100 characters']
    },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    type: {
        type: String,
        required: [true, 'Please add job type (e.g., Full-time, Remote)'],
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance']
    },
    salary: {
        type: String,
        required: [true, 'Please add salary range']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    requirements: {
        type: [String],
        default: []
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);
