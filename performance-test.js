#!/usr/bin/env node

const axios = require('axios');
const crypto = require('crypto');

console.log('⚡ Performance Test Suite');
console.log('═'.repeat(40));

const baseURL = 'http://localhost:4000';
let adminToken = '';

// Helper function to measure response time
async function measureResponseTime(testName, asyncFunction) {
    const startTime = Date.now();
    try {
        const result = await asyncFunction();
        const duration = Date.now() - startTime;
        return { success: true, duration, result };
    } catch (error) {
        const duration = Date.now() - startTime;
        return { success: false, duration, error: error.message };
    }
}

// Setup admin token
async function setupAuth() {
    console.log('\n🔑 Setting up authentication...');
    try {
        const response = await axios.post(`${baseURL}/api/user/admin-login`, {
            email: 'zoghlamimustapha16@gmail.com',
            password: 'admin123'
        });
        adminToken = response.data.token;
        console.log('   ✅ Admin authentication successful');
        return true;
    } catch (error) {
        console.log('   ❌ Admin authentication failed:', error.message);
        return false;
    }
}

async function testAPIPerformance() {
    const results = [];

    console.log('\n📊 API Performance Tests');
    console.log('─'.repeat(25));

    // Test 1: Product List Load Time
    console.log('\n1. 🛍️ Product List Performance');
    const productTest = await measureResponseTime('Product List', () => 
        axios.get(`${baseURL}/api/product`)
    );
    results.push({
        test: 'Product List Load',
        ...productTest,
        threshold: 500, // 500ms threshold
        passed: productTest.success && productTest.duration < 500
    });

    if (productTest.success) {
        console.log(`   ✅ Response time: ${productTest.duration}ms`);
        console.log(`   📦 Products loaded: ${productTest.result.data.length}`);
    } else {
        console.log(`   ❌ Failed: ${productTest.error}`);
    }

    // Test 2: Category List Performance
    console.log('\n2. 🏷️ Category Performance');
    const categoryTest = await measureResponseTime('Category List', () => 
        axios.get(`${baseURL}/api/category`)
    );
    results.push({
        test: 'Category List Load',
        ...categoryTest,
        threshold: 300,
        passed: categoryTest.success && categoryTest.duration < 300
    });

    if (categoryTest.success) {
        console.log(`   ✅ Response time: ${categoryTest.duration}ms`);
        console.log(`   🏷️ Categories loaded: ${categoryTest.result.data.length}`);
    } else {
        console.log(`   ❌ Failed: ${categoryTest.error}`);
    }

    // Test 3: Search Performance
    console.log('\n3. 🔍 Search Performance');
    const searchTest = await measureResponseTime('Product Search', () => 
        axios.get(`${baseURL}/api/product?search=test`)
    );
    results.push({
        test: 'Product Search',
        ...searchTest,
        threshold: 600,
        passed: searchTest.success && searchTest.duration < 600
    });

    if (searchTest.success) {
        console.log(`   ✅ Response time: ${searchTest.duration}ms`);
        console.log(`   🔍 Search results: ${searchTest.result.data.length}`);
    } else {
        console.log(`   ❌ Failed: ${searchTest.error}`);
    }

    // Test 4: Authentication Performance
    console.log('\n4. 🔐 Authentication Performance');
    const authTest = await measureResponseTime('User Login', () => 
        axios.post(`${baseURL}/api/user/admin-login`, {
            email: 'zoghlamimustapha16@gmail.com',
            password: 'admin123'
        })
    );
    results.push({
        test: 'Admin Login',
        ...authTest,
        threshold: 400,
        passed: authTest.success && authTest.duration < 400
    });

    if (authTest.success) {
        console.log(`   ✅ Response time: ${authTest.duration}ms`);
        console.log(`   👤 Login successful`);
    } else {
        console.log(`   ❌ Failed: ${authTest.error}`);
    }

    return results;
}

async function testConcurrentLoad() {
    console.log('\n🚀 Concurrent Load Testing');
    console.log('─'.repeat(25));

    const concurrentUsers = 5;
    const requests = [];

    console.log(`\n5. ⚡ ${concurrentUsers} Concurrent Product Requests`);
    
    const startTime = Date.now();
    
    // Create concurrent requests
    for (let i = 0; i < concurrentUsers; i++) {
        requests.push(axios.get(`${baseURL}/api/product`));
    }

    try {
        const responses = await Promise.all(requests);
        const totalTime = Date.now() - startTime;
        const avgTime = totalTime / concurrentUsers;

        console.log(`   ✅ All ${concurrentUsers} requests completed`);
        console.log(`   ⏱️ Total time: ${totalTime}ms`);
        console.log(`   📊 Average per request: ${Math.round(avgTime)}ms`);
        console.log(`   📈 Throughput: ${Math.round(concurrentUsers / (totalTime / 1000))} req/s`);

        return {
            test: 'Concurrent Load',
            success: true,
            duration: totalTime,
            avgDuration: avgTime,
            throughput: concurrentUsers / (totalTime / 1000),
            threshold: 2000,
            passed: totalTime < 2000
        };
    } catch (error) {
        console.log(`   ❌ Concurrent test failed: ${error.message}`);
        return {
            test: 'Concurrent Load',
            success: false,
            duration: Date.now() - startTime,
            error: error.message,
            threshold: 2000,
            passed: false
        };
    }
}

async function testMemoryUsage() {
    console.log('\n💾 Memory Usage Analysis');
    console.log('─'.repeat(25));

    const beforeMemory = process.memoryUsage();
    console.log(`\n6. 📊 Memory Usage Before Tests`);
    console.log(`   RSS: ${Math.round(beforeMemory.rss / 1024 / 1024)}MB`);
    console.log(`   Heap Used: ${Math.round(beforeMemory.heapUsed / 1024 / 1024)}MB`);

    // Simulate some API calls
    const requests = [];
    for (let i = 0; i < 10; i++) {
        requests.push(axios.get(`${baseURL}/api/product`));
    }
    
    await Promise.all(requests);

    const afterMemory = process.memoryUsage();
    console.log(`\n   📊 Memory Usage After 10 API Calls`);
    console.log(`   RSS: ${Math.round(afterMemory.rss / 1024 / 1024)}MB`);
    console.log(`   Heap Used: ${Math.round(afterMemory.heapUsed / 1024 / 1024)}MB`);
    console.log(`   Memory increase: ${Math.round((afterMemory.heapUsed - beforeMemory.heapUsed) / 1024)}KB`);

    const memoryIncrease = afterMemory.heapUsed - beforeMemory.heapUsed;
    const memoryIncreaseKB = memoryIncrease / 1024;
    
    return {
        test: 'Memory Usage',
        success: true,
        memoryIncrease: memoryIncreaseKB,
        threshold: 5000, // 5MB threshold
        passed: memoryIncreaseKB < 5000
    };
}

async function runPerformanceTests() {
    const startTime = Date.now();

    // Setup authentication
    const authSuccess = await setupAuth();
    if (!authSuccess) {
        console.log('\n❌ Cannot proceed without authentication');
        return;
    }

    // Run performance tests
    const apiResults = await testAPIPerformance();
    const concurrentResult = await testConcurrentLoad();
    const memoryResult = await testMemoryUsage();

    // Combine all results
    const allResults = [...apiResults, concurrentResult, memoryResult];
    
    // Calculate summary
    const passed = allResults.filter(r => r.passed).length;
    const failed = allResults.length - passed;
    const totalDuration = Date.now() - startTime;

    console.log('\n' + '═'.repeat(40));
    console.log('📊 PERFORMANCE TEST SUMMARY');
    console.log('═'.repeat(40));
    
    console.log(`⏱️  Total Duration: ${Math.round(totalDuration / 1000)}s`);
    console.log(`📈 Tests Run: ${allResults.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Success Rate: ${Math.round((passed / allResults.length) * 100)}%`);

    console.log('\n📋 Detailed Results:');
    allResults.forEach(result => {
        const status = result.passed ? '✅' : '❌';
        const duration = result.duration ? `${result.duration}ms` : 'N/A';
        const threshold = result.threshold ? `(< ${result.threshold}ms)` : '';
        console.log(`   ${status} ${result.test}: ${duration} ${threshold}`);
    });

    console.log('\n🎯 Performance Insights:');
    const avgResponseTime = apiResults
        .filter(r => r.success && r.duration)
        .reduce((sum, r) => sum + r.duration, 0) / 
        apiResults.filter(r => r.success && r.duration).length;
    
    console.log(`   📊 Average API Response Time: ${Math.round(avgResponseTime)}ms`);
    
    if (concurrentResult.throughput) {
        console.log(`   🚀 Concurrent Throughput: ${Math.round(concurrentResult.throughput)} req/s`);
    }

    if (failed === 0) {
        console.log('\n🎉 All performance tests passed! System performing well.');
    } else {
        console.log('\n⚠️  Some performance issues detected. Consider optimization.');
    }

    process.exit(failed === 0 ? 0 : 1);
}

if (require.main === module) {
    runPerformanceTests().catch(error => {
        console.error('\nPerformance test execution failed:', error.message);
        process.exit(1);
    });
}
