const fs = require('fs');
fs.writeFileSync('test-out.txt', 'Node is working at ' + new Date().toISOString());
process.exit(0);
