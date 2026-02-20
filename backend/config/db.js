const mongoose = require('mongoose');

const connectDB = async () => {
    // Connection options
    const options = {
        serverSelectionTimeoutMS: 5000, // 5 second timeout for quick fallback
    };

    const cloudURI = process.env.MONGO_URI;
    const localURI = process.env.MONGO_LOCAL || 'mongodb://127.0.0.1:27017/job-portal';

    // Check for command line arguments
    const args = process.argv.slice(2);
    const forceCloud = args.includes('--cloud');
    const forceLocal = args.includes('--local');

    // Helper function to connect
    const connectToCloud = async (isForced = false) => {
        try {
            console.log(isForced ? '🌐 Forced Cloud Mode. Connecting to MongoDB Cloud (Atlas)...' : '🌐 Attempting to connect to MongoDB Cloud (Atlas)...');
            const conn = await mongoose.connect(cloudURI, options);
            console.log(`✅ MongoDB Connected to Cloud: ${conn.connection.host}`);
        } catch (error) {
            console.error(`❌ Cloud Connection Failed: ${error.message}`);
            if (isForced) {
                console.error('🛑 specific cloud connection requested. Exiting...');
                process.exit(1);
            }
            throw error; // Rethrow to trigger fallback
        }
    };

    const connectToLocal = async (isForced = false) => {
        try {
            console.log(isForced ? '🏠 Forced Local Mode. Connecting to Local MongoDB...' : '🏠 Attempting fallback to Local MongoDB...');
            const localConn = await mongoose.connect(localURI, options);
            console.log(`✅ MongoDB Connected Locally: ${localConn.connection.host}`);
        } catch (error) {
            console.error(`❌ Local MongoDB Failed: ${error.message}`);
            console.error('Please ensure a database is running.');
            process.exit(1);
        }
    };

    // Main Logic
    if (forceCloud) {
        await connectToCloud(true);
    } else if (forceLocal) {
        await connectToLocal(true);
    } else {
        // Default Behavior: Try Cloud -> Fallback to Local
        try {
            await connectToCloud();
        } catch (error) {
            console.log('⚠️  Checking network or IP Whitelist issues...');
            await connectToLocal();
        }
    }
};

module.exports = connectDB;
