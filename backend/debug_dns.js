const dns = require('dns');

const domain = '_mongodb._tcp.cluster0.sa7jva1.mongodb.net';

console.log(`Checking DNS SRV records for: ${domain}`);

dns.resolveSrv(domain, (err, addresses) => {
    if (err) {
        console.error('❌ DNS Resolution Failed:', err.message);
        console.error('Code:', err.code);
        console.log('\nPossible causes:\n1. Your network (ISP/School/Work) blocks custom DNS lookups.\n2. You are using a VPN causing DNS leaks.\n3. Your Firewall is strict.');
    } else {
        console.log('✅ DNS Resolution Successful!');
        console.log('SRV Records found:', addresses);
        console.log('\nIf DNS works but connection fails, it might be Port 27017 blocking.');
    }
});
