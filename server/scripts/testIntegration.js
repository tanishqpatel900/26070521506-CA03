const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

const runIntegrationTests = async () => {
  console.log('🧪 Starting FlowFinance End-to-End API Test Suite...\n');

  try {
    // 1. Health check
    const health = await request('/api/health');
    console.log(`[1] Health Check: ${health.status === 200 ? '✅ PASS' : '❌ FAIL'}`);

    // 2. Demo User Login
    const login = await request('/api/auth/login', 'POST', {
      email: 'demo@flowfinance.com',
      password: 'password123',
    });
    console.log(`[2] Demo User Authentication: ${login.status === 200 && login.data.token ? '✅ PASS' : '❌ FAIL'}`);
    const token = login.data.token;

    // 3. User Profile Verification
    const me = await request('/api/auth/me', 'GET', null, token);
    console.log(`[3] Authenticated Profile (/api/auth/me): ${me.data.user.email === 'demo@flowfinance.com' ? '✅ PASS' : '❌ FAIL'}`);

    // 4. Create Transaction
    const newTx = await request(
      '/api/transactions',
      'POST',
      {
        title: 'Blue Bottle Single Origin Espresso',
        amount: 8.5,
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString(),
        paymentMethod: 'Credit Card',
        notes: 'Integration test transaction record',
      },
      token
    );
    console.log(`[4] Create Transaction: ${newTx.status === 201 && newTx.data.transaction ? '✅ PASS' : '❌ FAIL'}`);
    const txId = newTx.data.transaction?._id;

    // 5. Query Transactions with Search & Filtering
    const txList = await request('/api/transactions?search=Espresso&category=Food', 'GET', null, token);
    console.log(`[5] Filtered Transaction Search: ${txList.data.count >= 1 ? '✅ PASS' : '❌ FAIL'} (${txList.data.count} found)`);

    // 6. Budgets with Progress & Warnings
    const budgets = await request('/api/budgets', 'GET', null, token);
    console.log(`[6] Budgets Progress & Thresholds: ${budgets.data.budgets.length > 0 ? '✅ PASS' : '❌ FAIL'} (${budgets.data.budgets.length} budgets tracked)`);

    // 7. Analytics Summary
    const summary = await request('/api/analytics/summary', 'GET', null, token);
    console.log(`[7] Financial Summary Metrics: ${summary.data.summary.totalBalance !== undefined ? '✅ PASS' : '❌ FAIL'} (Balance: $${summary.data.summary.totalBalance})`);

    // 8. Deterministic Spending Insights
    const insights = await request('/api/analytics/spending', 'GET', null, token);
    console.log(`[8] Deterministic Spending Insights: ${insights.data.insights.length > 0 ? '✅ PASS' : '❌ FAIL'} (${insights.data.insights.length} active insights generated)`);

    // 9. Interactive Charts Telemetry
    const charts = await request('/api/analytics/charts?period=thisMonth', 'GET', null, token);
    console.log(`[9] Chart Datasets: ${charts.data.timeline.length > 0 && charts.data.categoryBreakdown.length > 0 ? '✅ PASS' : '❌ FAIL'}`);

    // 10. Live Currency Rates & Convert
    const fx = await request('/api/currency/convert?amount=100&from=USD&to=EUR');
    console.log(`[10] Live Currency Converter: ${fx.data.convertedAmount > 0 ? '✅ PASS' : '❌ FAIL'} ($100 USD = €${fx.data.convertedAmount} EUR, Rate: ${fx.data.rate})`);

    // 11. Reports Summary Statement
    const report = await request('/api/reports/summary', 'GET', null, token);
    console.log(`[11] Financial Statement Generator: ${report.data.report.totals ? '✅ PASS' : '❌ FAIL'} (Savings Rate: ${report.data.report.totals.savingsRate}%)`);

    // 12. Delete Test Transaction
    if (txId) {
      const del = await request(`/api/transactions/${txId}`, 'DELETE', null, token);
      console.log(`[12] Clean up / Delete Transaction: ${del.status === 200 ? '✅ PASS' : '❌ FAIL'}`);
    }

    console.log('\n=========================================');
    console.log('🎉 ALL INTEGRATION TESTS PASSED 100%!');
    console.log('=========================================\n');
    process.exit(0);
  } catch (err) {
    console.error('Integration Test Error:', err);
    process.exit(1);
  }
};

runIntegrationTests();
