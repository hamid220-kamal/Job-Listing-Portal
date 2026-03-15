const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'debug.log');
const log = (msg) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    console.log(msg);
};

let connectionPromise = null;

const connectDB = async () => {
    // If already connected, return immediately
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If already connecting, return the existing promise
    if (connectionPromise && mongoose.connection.readyState === 2) {
        return connectionPromise;
    }

    // Connection options
    const options = {
        serverSelectionTimeoutMS: 30000, // Increased to 30s to allow Atlas to respond
        connectTimeoutMS: 30000,        // Increased to 30s
        socketTimeoutMS: 45000,
        bufferCommands: false, 
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
            if (typeof log !== 'undefined') log(isForced ? '🌐 Forced Cloud Mode. Connecting to MongoDB Cloud (Atlas)...' : '🌐 Attempting to connect to MongoDB Cloud (Atlas)...');
            const conn = await mongoose.connect(cloudURI, options);
            console.log(`✅ MongoDB Connected to Cloud: ${conn.connection.host}`);
            if (typeof log !== 'undefined') log(`✅ MongoDB Connected to Cloud: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.error('--- Cloud Connection Error Detail ---');
            console.error(`Error Code: ${error.code || 'N/A'}`);
            console.error(`Error Name: ${error.name}`);
            console.error(`Error Message: ${error.message}`);
            
            if (error.message.includes('ETIMEDOUT')) {
                console.error('❌ Cloud Connection Timeout: The server took too long to respond.');
            } else if (error.message.includes('ECONNREFUSED')) {
                console.error('❌ Cloud Connection Refused: Ensure the host and port are correct.');
            } else if (error.message.includes('authentication failed')) {
                console.error('❌ Cloud Auth Failed: Check your username and password in MONGO_URI.');
            } else if (error.message.includes('MongooseServerSelectionError')) {
                console.error('❌ Server Selection Error: This often means IP is not whitelisted or firewall is blocking.');
            }
            
            if (isForced) {
                console.error('🛑 Specific cloud connection requested. Exiting...');
                process.exit(1);
            }
            throw error; // Rethrow to trigger fallback
        }
    };

    const connectToLocal = async (isForced = false) => {
        try {
            console.log(isForced ? '🏠 Forced Local Mode. Connecting to Local MongoDB...' : '🏠 Attempting fallback to Local MongoDB...');
            if (typeof log !== 'undefined') log(isForced ? '🏠 Forced Local Mode. Connecting to Local MongoDB...' : '🏠 Attempting fallback to Local MongoDB...');
            const localConn = await mongoose.connect(localURI, options);
            console.log(`✅ MongoDB Connected Locally: ${localConn.connection.host}`);
            if (typeof log !== 'undefined') log(`✅ MongoDB Connected Locally: ${localConn.connection.host}`);
            return localConn;
        } catch (error) {
            console.error(`❌ Local MongoDB Failed: ${error.message}`);
            console.error('Please ensure a database is running.');
            process.exit(1);
        }
    };

    connectionPromise = (async () => {
        try {
            let result;
            // Main Logic
            if (forceCloud) {
                if (!cloudURI) {
                    console.error('❌ Cannot force Cloud: MONGO_URI is not defined in .env');
                    if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) process.exit(1);
                    return;
                }
                result = await connectToCloud(true);
            } else if (forceLocal) {
                result = await connectToLocal(true);
            } else {
                // Default Behavior: 
                // 1. If MONGO_URI exists, Try Cloud -> Fallback to Local (only in dev)
                // 2. If NO MONGO_URI, Default to Local immediately (only in dev)

                if (cloudURI) {
                    try {
                        result = await connectToCloud();
                    } catch (error) {
                        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
                            console.error('🛑 DATABASE ERROR: Connection failed in production/Vercel.');
                            console.error('👉 TIP: Check if MONGO_URI is correctly set in Vercel Environment Variables.');
                            console.error('👉 TIP: Ensure MongoDB Atlas IP Whitelist allows Access from Anywhere (0.0.0.0/0).');
                            return;
                        }
                        console.log('⚠️  Checking network or IP Whitelist issues...');
                        result = await connectToLocal();
                    }
                } else {
                    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
                        console.error('❌ MONGO_URI is missing in production environment');
                        return;
                    }
                    console.log('ℹ️  No MONGO_URI found in .env');
                    console.log('ℹ️  Running in "Isolated Development Mode"');
                    result = await connectToLocal();
                }
            }
            return result;
        } finally {
            // Do not clear connectionPromise if it succeeded, as it may be used by subsequent calls
            // Only clear it on complete failure if we want to allow retry
            // But if it succeeded, readyState will be 1, so connectDB will return early
        }
    })();

    return connectionPromise;
};

module.exports = connectDB;
