import http from 'http';
import app from '../server.js';

let server;
let port;
let baseUrl;

function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`${baseUrl}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  // Start in-memory server on an available random port
  server = app.listen(0);
  port = server.address().port;
  baseUrl = `http://localhost:${port}`;

  console.log(`🧪 Running HomeFeast API Verification Suite on test port ${port}...\n`);
  let passed = 0;
  let failed = 0;

  // Test 1: Health Check
  try {
    const res = await get('/api/health');
    if (res.status === 200 && res.data.status === 'healthy') {
      console.log('✅ Health Check Endpoint (/api/health) passed');
      passed++;
    } else {
      console.error('❌ Health Check Endpoint failed:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ Health Check Endpoint error:', err.message);
    failed++;
  }

  // Test 2: MongoDB Status Endpoint
  try {
    const res = await get('/api/mongodb-status');
    if (res.status === 200 && res.data.success && res.data.mongodb) {
      console.log(`✅ MongoDB Status Endpoint (/api/mongodb-status) passed -> Connection state: ${res.data.mongodb.readyState}`);
      passed++;
    } else {
      console.error('❌ MongoDB Status Endpoint failed:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ MongoDB Status Endpoint error:', err.message);
    failed++;
  }

  // Test 3: Providers Endpoint
  try {
    const res = await get('/api/providers');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      console.log(`✅ Providers List (/api/providers) passed -> Count: ${res.data.data.length}`);
      passed++;
    } else {
      console.error('❌ Providers List failed:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ Providers List error:', err.message);
    failed++;
  }

  // Test 4: Menu Endpoint
  try {
    const res = await get('/api/menu');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      console.log(`✅ Menu Items (/api/menu) passed -> Count: ${res.data.data.length}`);
      passed++;
    } else {
      console.error('❌ Menu Items failed:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ Menu Items error:', err.message);
    failed++;
  }

  // Test 5: Meal Plans Endpoint
  try {
    const res = await get('/api/plans');
    if (res.status === 200 && res.data.success && Array.isArray(res.data.data)) {
      console.log(`✅ Meal Plans (/api/plans) passed -> Count: ${res.data.data.length}`);
      passed++;
    } else {
      console.error('❌ Meal Plans failed:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ Meal Plans error:', err.message);
    failed++;
  }

  // Test 6: Admin Dashboard Endpoint
  try {
    const res = await get('/api/admin/dashboard');
    if (res.status === 200 && res.data.success && res.data.data.stats) {
      console.log(`✅ Admin Dashboard (/api/admin/dashboard) passed -> Users: ${res.data.data.stats.totalUsers}, Kitchens: ${res.data.data.stats.totalProviders}`);
      passed++;
    } else {
      console.error('❌ Admin Dashboard failed:', res);
      failed++;
    }
  } catch (err) {
    console.error('❌ Admin Dashboard error:', err.message);
    failed++;
  }

  // Test 7: Admin Subscriptions & Orders Endpoints
  try {
    const [subRes, ordRes, uRes] = await Promise.all([
      get('/api/admin/subscriptions'),
      get('/api/admin/orders'),
      get('/api/admin/users')
    ]);
    if (subRes.status === 200 && ordRes.status === 200 && uRes.status === 200) {
      console.log(`✅ Admin Platform Collections (/api/admin/subscriptions, /orders, /users) passed -> Subs: ${subRes.data.data.length}, Orders: ${ordRes.data.data.length}, Users: ${uRes.data.data.length}`);
      passed++;
    } else {
      console.error('❌ Admin Platform Collections failed');
      failed++;
    }
  } catch (err) {
    console.error('❌ Admin Platform Collections error:', err.message);
    failed++;
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  server.close(() => {
    process.exit(failed > 0 ? 1 : 0);
  });
}

runTests();
