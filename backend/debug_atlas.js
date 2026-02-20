const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dotenv.config();

console.log('--- MongoDB Atlas Diagnostic Tool ---');
console.log(`Node.js Version: ${process.version}`);
console.log(`Mongoose Version: ${require('mongoose/package.json').version}`);

const uri = process.env.MONGO_URI;
const domain = uri.split('@')[1].split('/')[0];

console.log(`\n1. Analyzing URI:`);
console.log(`   Domain to lookup: ${domain}`);

// Test 1: DNS Lookup
console.log('\n2. Testing DNS Resolution (SRV Record):');
dns.resolveSrv(`_mongodb._tcp.${domain}`, (err, addresses) => {
    if (err) {
        console.error(`   ❌ DNS Lookup FAILED: ${err.message}`);
        console.log('   Possible Causes:');
        console.log('   - Local Firewall/Antivirus blocking DNS');
        console.log('   - ISP DNS issues (Try changing to Google DNS 8.8.8.8)');
    } else {
        console.log(`   ✅ DNS Lookup SUCCESS: Found ${addresses.length} records`);
        console.log(addresses);
    }
});

// Test 2: Mongoose Connect
console.log('\n3. Attempting Mongoose Connection...');
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
    family: 4
})
    .then(() => {
        console.log('   ✅ Mongoose Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error(`   ❌ Mongoose Connection FAILED: ${err.message}`);
        // Don't exit yet, let DNS finish
    });
