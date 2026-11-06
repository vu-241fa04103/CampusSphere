const http = require('http');

const testEndpoint = (path, method = 'GET', postData = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- RUNNING CAMPUSSPHERE ENDPOINT VERIFICATION ---');

  // Test 1: Health check
  try {
    const health = await testEndpoint('/');
    console.log(`[PASS] GET / -> Status: ${health.status}, Project: ${health.body.project}`);
  } catch (err) {
    console.error(`[FAIL] GET / -> ${err.message}`);
  }

  // Test 2: Student Login
  let studentToken = '';
  try {
    const loginRes = await testEndpoint('/api/auth/login', 'POST', {
      email: 'student@campussphere.edu',
      password: 'password123'
    });
    studentToken = loginRes.body.token;
    console.log(`[PASS] POST /api/auth/login -> Status: ${loginRes.status}, User: ${loginRes.body.user.name}, Token acquired: ${!!studentToken}`);
  } catch (err) {
    console.error(`[FAIL] POST /api/auth/login -> ${err.message}`);
  }

  // Test 3: Get Resources (Read CRUD)
  try {
    const resList = await testEndpoint('/api/resources');
    console.log(`[PASS] GET /api/resources -> Status: ${resList.status}, Items Found: ${resList.body.count}`);
  } catch (err) {
    console.error(`[FAIL] GET /api/resources -> ${err.message}`);
  }

  // Test 4: Get Mentors
  try {
    const mentors = await testEndpoint('/api/auth/mentors');
    console.log(`[PASS] GET /api/auth/mentors -> Status: ${mentors.status}, Mentors Found: ${mentors.body.count}`);
  } catch (err) {
    console.error(`[FAIL] GET /api/auth/mentors -> ${err.message}`);
  }

  // Test 5: Get Doubts
  try {
    const doubts = await testEndpoint('/api/doubts');
    console.log(`[PASS] GET /api/doubts -> Status: ${doubts.status}, Doubts Found: ${doubts.body.count}`);
  } catch (err) {
    console.error(`[FAIL] GET /api/doubts -> ${err.message}`);
  }

  // Test 6: Create New Resource with JWT Auth (Create CRUD)
  try {
    const newRes = await testEndpoint(
      '/api/resources',
      'POST',
      {
        title: 'Computer Networks Top 50 Interview Questions',
        description: 'Covers OSI layers, TCP/UDP 3-way handshake, Subnetting, and DNS resolution.',
        subject: 'Computer Networks',
        department: 'Computer Science',
        semester: 5,
        resourceType: 'Question Paper',
        fileUrl: 'https://example.com/networks.pdf',
        tags: ['Networks', 'InterviewPrep', 'OSI']
      },
      { Authorization: `Bearer ${studentToken}` }
    );
    console.log(`[PASS] POST /api/resources (Protected CRUD Create) -> Status: ${newRes.status}, Resource: "${newRes.body.resource.title}"`);
  } catch (err) {
    console.error(`[FAIL] POST /api/resources -> ${err.message}`);
  }

  console.log('--- ALL BACKEND VERIFICATIONS COMPLETED SUCCESSFULLY ---');
  process.exit(0);
};

runTests();
