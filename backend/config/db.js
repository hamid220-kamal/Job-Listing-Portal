const mongoose = require('mongoose');

const connectDB = async () => {
    // Connection options to help with DNS issues
    const options = {
        serverSelectionTimeoutMS: 10000, // 10 second timeout
        family: 4, // Use IPv4, skip trying IPv6
    };

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);

        // If Atlas fails, try local MongoDB if available
        if (process.env.MONGO_URI.includes('mongodb.net')) {
            console.log('Attempting fallback to local MongoDB...');
            try {
                const localURI = 'mongodb://127.0.0.1:27017/job-portal';
                const localConn = await mongoose.connect(localURI, options);
                console.log(`MongoDB Connected Locally: ${localConn.connection.host}`);
                return;
            } catch (localError) {
                console.error(`Local MongoDB also unavailable: ${localError.message}`);
            }
        }

        console.error('\n❌ Could not connect to any MongoDB instance');
        console.error('Please ensure either:');
        console.error('  1. MongoDB Atlas is accessible (check network/DNS)');
        console.error('  2. Local MongoDB is installed and running\n');
        process.exit(1);
    }
};

module.exports = connectDB;
