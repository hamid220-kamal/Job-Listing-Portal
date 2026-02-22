const mongoose = require('mongoose');

const connectDB = async () => {
    // Idempotency: If already connected or connecting, don't start a new attempt
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
        return;
    }

    // Connection options
    const options = {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        bufferCommands: false, // Disable buffering to fail fast if not connected
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
        if (!cloudURI) {
            console.error('❌ Cannot force Cloud: MONGO_URI is not defined in .env');
            if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) process.exit(1);
            return;
        }
        await connectToCloud(true);
    } else if (forceLocal) {
        await connectToLocal(true);
    } else {
        // Default Behavior: 
        // 1. If MONGO_URI exists, Try Cloud -> Fallback to Local (only in dev)
        // 2. If NO MONGO_URI, Default to Local immediately (only in dev)

        if (cloudURI) {
            try {
                await connectToCloud();
            } catch (error) {
                if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
                    console.error('🛑 DATABASE ERROR: Connection failed in production/Vercel.');
                    console.error('👉 TIP: Check if MONGO_URI is correctly set in Vercel Environment Variables.');
                    console.error('👉 TIP: Ensure MongoDB Atlas IP Whitelist allows Access from Anywhere (0.0.0.0/0).');
                    return;
                }
                console.log('⚠️  Checking network or IP Whitelist issues...');
                await connectToLocal();
            }
        } else {
            if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
                console.error('❌ MONGO_URI is missing in production environment');
                return;
            }
            console.log('ℹ️  No MONGO_URI found in .env');
            console.log('ℹ️  Running in "Isolated Development Mode"');
            await connectToLocal();
        }
    }
};

module.exports = connectDB;
