const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testConnection = async () => {
    console.log('Testing Cloud Connection...');
    console.log(`URI: ${process.env.MONGO_URI.substring(0, 20)}...`); // Log partial URI for safety

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('✅ SUCCESS: Connected to MongoDB Cloud!');
        process.exit(0);
    } catch (error) {
        console.error(`❌ FAILURE: Could not connect to Cloud. Reason: ${error.message}`);
        process.exit(1);
    }
};

testConnection();
