const API_URL = 'http://localhost:5000/api/auth';

const testAuth = async () => {
    const user = {
        name: 'Debug User',
        email: `debug_${Date.now()}@example.com`,
        password: 'Password123!',
        role: 'candidate'
    };

    console.log('--- Starting Auth Debug (Fetch) ---');
    console.log('Testing with user:', user);

    try {
        // 1. Signup
        console.log('\n[1] Attempting Signup...');
        const signupRes = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const signupData = await signupRes.json();

        if (!signupRes.ok) {
            throw new Error(`Signup Failed: ${signupRes.status} ${JSON.stringify(signupData)}`);
        }

        console.log('✅ Signup Successful!');
        console.log('User ID:', signupData._id);

        // 2. Login
        console.log('\n[2] Attempting Login with same credentials...');
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });

        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            throw new Error(`Login Failed: ${loginRes.status} ${JSON.stringify(loginData)}`);
        }

        console.log('✅ Login Successful!');
        console.log('Token received:', !!loginData.token);

    } catch (error) {
        console.error('\n❌ Operation Failed!');
        console.error(error.message);
    }
};

testAuth();
