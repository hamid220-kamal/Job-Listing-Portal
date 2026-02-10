const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

console.log('Testing connection to:', uri.replace(/:([^:@]{1,})@/, ':****@'));

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log('Connected successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
