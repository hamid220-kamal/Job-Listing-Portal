const mongoose = require('mongoose');

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
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['candidate', 'employer'],
        default: 'candidate'
    },
    company: {
        type: String,
        // only if employer
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Match user entered password to hashed password in database
// We will add bcrypt later in controller or pre-save hook

module.exports = mongoose.model('User', userSchema);
