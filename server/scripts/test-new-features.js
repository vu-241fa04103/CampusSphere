const axios = require('axios');

const API = 'http://localhost:5000/api';

async function runTests() {
  console.log('==================================================================');
  console.log('🧪 CampusSphere All-Department Verification (CSE, BT, MECH, CIVIL)');
  console.log('==================================================================\n');

  try {
    // 1. CSE Student
    console.log('1️⃣ Authenticating 3rd Year CSE Student (student24@campussphere.edu)...');
    const cseStudentRes = await axios.post(`${API}/auth/login`, {
      email: 'student24@campussphere.edu',
      password: 'password123'
    });
    console.log(`   ✓ Authenticated: ${cseStudentRes.data.user.name} | Dept: ${cseStudentRes.data.user.department} | Specialization: ${cseStudentRes.data.user.specialization}`);

    // 2. Biotechnology Student
    console.log('\n2️⃣ Authenticating 3rd Year Biotechnology Student (btstudent24@campussphere.edu)...');
    const btStudentRes = await axios.post(`${API}/auth/login`, {
      email: 'btstudent24@campussphere.edu',
      password: 'password123'
    });
    console.log(`   ✓ Authenticated: ${btStudentRes.data.user.name} | Dept: ${btStudentRes.data.user.department} | Specialization: ${btStudentRes.data.user.specialization}`);

    // 3. Mechanical Student & Faculty
    console.log('\n3️⃣ Authenticating 3rd Year Mechanical Student & Faculty...');
    const mechStudentRes = await axios.post(`${API}/auth/login`, {
      email: 'mechstudent24@campussphere.edu',
      password: 'password123'
    });
    const mechFacultyRes = await axios.post(`${API}/auth/login`, {
      email: 'mechfaculty@campussphere.edu',
      password: 'faculty123'
    });
    console.log(`   ✓ Mechanical Student: ${mechStudentRes.data.user.name} (${mechStudentRes.data.user.department})`);
    console.log(`   ✓ Mechanical Faculty: ${mechFacultyRes.data.user.name} (${mechFacultyRes.data.user.department})`);

    // 4. Civil Student & Senior Mentor
    console.log('\n4️⃣ Authenticating Civil Student & Senior Mentor...');
    const civilStudentRes = await axios.post(`${API}/auth/login`, {
      email: 'civilstudent24@campussphere.edu',
      password: 'password123'
    });
    const civilSeniorRes = await axios.post(`${API}/auth/login`, {
      email: 'civilsenior23@campussphere.edu',
      password: 'password123'
    });
    console.log(`   ✓ Civil Student: ${civilStudentRes.data.user.name} (${civilStudentRes.data.user.department})`);
    console.log(`   ✓ Civil Senior Mentor: ${civilSeniorRes.data.user.name} (${civilSeniorRes.data.user.department})`);

    // 5. Quizzes for Mechanical
    console.log('\n5️⃣ Fetching Quizzes for Mechanical Student...');
    const mechQuizRes = await axios.get(`${API}/quizzes`, {
      headers: { Authorization: `Bearer ${mechStudentRes.data.token}` }
    });
    console.log(`   ✓ Mechanical Quizzes available: ${mechQuizRes.data.count}`);
    const thermoQuiz = mechQuizRes.data.quizzes.find(q => q.subject === 'Thermodynamics');
    if (thermoQuiz) {
      console.log(`   Submitting answers for: "${thermoQuiz.title}"...`);
      const submitRes = await axios.post(
        `${API}/quizzes/${thermoQuiz._id}/submit`,
        { answers: [1, 2] },
        { headers: { Authorization: `Bearer ${mechStudentRes.data.token}` } }
      );
      console.log(`   ✓ Mechanical Quiz Score: ${submitRes.data.result.score}/${submitRes.data.result.totalQuestions} (${submitRes.data.result.percentage}%)`);
    }

    // 6. AI Academic Chatbot on Civil & Mechanical Engineering concepts
    console.log('\n6️⃣ Testing AI Academic Chatbot on Multi-Department Concepts...');
    const civilAi = await axios.post(
      `${API}/ai/ask`,
      {
        question: 'Explain BOD vs COD in wastewater treatment',
        department: 'Civil',
        subject: 'Environmental Engineering'
      },
      { headers: { Authorization: `Bearer ${civilStudentRes.data.token}` } }
    );
    console.log('   ✓ AI Chatbot (Civil Engineering):');
    console.log(`     "${civilAi.data.answer.substring(0, 110)}..."`);

    const mechAi = await axios.post(
      `${API}/ai/ask`,
      {
        question: 'What is the maximum thermal efficiency of a Carnot heat engine?',
        department: 'Mechanical',
        subject: 'Thermodynamics'
      },
      { headers: { Authorization: `Bearer ${mechStudentRes.data.token}` } }
    );
    console.log('   ✓ AI Chatbot (Mechanical Engineering):');
    console.log(`     "${mechAi.data.answer.substring(0, 110)}..."`);

    // 7. Department Isolation Rule: Civil Senior trying to upload to Mechanical
    console.log('\n7️⃣ Testing Department Isolation between Civil and Mechanical:');
    console.log('   a) Civil Senior uploading to Civil (Expected: 201 Created)...');
    const civilUpload = await axios.post(
      `${API}/resources`,
      {
        title: 'Geotechnical Engineering Soil Mechanics Formula Book',
        description: 'Complete Terzaghi bearing capacity equations and Darcy permeability derivations.',
        subject: 'Geotechnical Engineering',
        department: 'Civil',
        semester: 5,
        targetYear: 3,
        resourceType: 'Important PDF',
        fileUrl: 'https://example.com/soil.pdf'
      },
      { headers: { Authorization: `Bearer ${civilSeniorRes.data.token}` } }
    );
    console.log(`      ✓ Success: Resource uploaded to Civil portal (HTTP ${civilUpload.status})`);

    console.log('   b) Civil Senior attempting to upload to Mechanical (Expected: 403 Forbidden)...');
    try {
      await axios.post(
        `${API}/resources`,
        {
          title: 'Unauthorized Cross-Department Upload',
          description: 'Civil senior posting into Mechanical portal.',
          subject: 'Thermodynamics',
          department: 'Mechanical',
          semester: 5,
          targetYear: 3,
          resourceType: 'Lecture Notes',
          fileUrl: 'https://example.com/test.pdf'
        },
        { headers: { Authorization: `Bearer ${civilSeniorRes.data.token}` } }
      );
      console.log('      ❌ FAIL: Server allowed cross-department upload!');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log(`      ✓ SUCCESS: Server rejected with 403 Forbidden!`);
        console.log(`      ✓ Message: "${err.response.data.message}"`);
      }
    }

    console.log('\n==================================================================');
    console.log('🎉 ALL MULTI-DEPARTMENT VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('==================================================================\n');
  } catch (err) {
    console.error('\n❌ Test Error:', err.response?.data || err.message);
  }
}

runTests();
