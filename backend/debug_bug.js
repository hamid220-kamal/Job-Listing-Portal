const API_URL = 'http://localhost:5000/api';

const testBug = async () => {
    const user = {
        name: 'Bug Tester',
        email: `bug_${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'candidate'
    };

    try {
        // 1. Signup
        console.log('[1] Signup...');
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const signupData = await signupRes.json();

        if (!signupRes.ok) throw new Error('Signup Failed');
        const token = signupData.token;
        console.log('✅ Signup OK. Token:', !!token);

        // 2. Login (Should work)
        console.log('\n[2] First Login...');
        const loginRes1 = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });
        if (!loginRes1.ok) throw new Error('First Login Failed');
        console.log('✅ First Login OK.');

        // 3. Update User (Trigger save without password change)
        console.log('\n[3] Updating Profile (Name change)...');
        // We need an endpoint that updates the user. 
        // /api/profile/update? There is no profileRoutes listed in the context previously but verification plan mentioned it.
        // Let's check api/profile/me or similar.
        // server/index.js had: app.use('/api/profile', require('./routes/profileRoutes'));
        // I will try to PUT /api/profile or POST /api/profile
        // Let's assume PUT /api/profile/update exists or similar.
        // Actually, let's look at the file check earlier.

        // I'll try a PUT to /api/profile (common pattern) using the token
        const updateRes = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: 'Updated Name' })
        });

        // If this route doesn't exist, I might need to find one that does.
        // But let's see. verify route existence first?
        // I'll assume standard MERN pattern I implemented.

        if (updateRes.status === 404) {
            console.log('⚠️ /api/profile PUT not found. Trying /api/auth/me PUT?');
            // Or maybe I skip this if I can't find an update route easily without reading more files.
            // But the bug relies on a SAVE.
            throw new Error('Cannot trigger save: Update route unknown');
        }

        console.log(`Update status: ${updateRes.status}`);

        // 4. Login Again (Should FAIL if bug exists)
        console.log('\n[4] Second Login (After Update)...');
        const loginRes2 = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (!loginRes2.ok) {
            console.log('❌ Second Login FAILED! Bug Confirmd.');
            console.log(`Status: ${loginRes2.status}`);
        } else {
            console.log('✅ Second Login OK. Bug not reproduced via this method.');
        }

    } catch (error) {
        console.error(error.message);
    }
};

testBug();
