/**
 * Performance Testing Script
 * Run: node scripts/test-performance.js
 */

const https = require('https');
const http = require('http');

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Test endpoints (public endpoints only for automated testing)
const endpoints = [
  '/api/categories',
  '/api/products?page=1&limit=20',
  '/api/featured-products'
];

// Admin endpoints (require authentication)
const adminEndpoints = [
  '/api/dashboard/stats',
  '/api/analytics',
  '/api/orders/admin?page=1&limit=20'
];

async function measureEndpoint(url, headers = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const fullUrl = `${BASE_URL}${url}`;
    const client = fullUrl.startsWith('https') ? https : http;
    
    const options = {
      headers: {
        'User-Agent': 'Performance-Test-Script',
        ...headers
      }
    };
    
    const req = client.get(fullUrl, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const cacheStatus = res.headers['x-cache'] || 'UNKNOWN';
        
        resolve({
          url,
          responseTime,
          statusCode: res.statusCode,
          cacheStatus,
          contentLength: data.length,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        error: error.message,
        responseTime: -1,
        success: false
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout',
        responseTime: -1,
        success: false
      });
    });
  });
}

async function runPerformanceTest() {
  console.log('🚀 Starting Performance Test...\n');
  console.log(`Base URL: ${BASE_URL}\n`);
  
  const results = [];
  
  console.log('📊 Testing Public Endpoints (No Auth Required):\n');
  
  // Test public endpoints
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    
    // First request (should be MISS)
    const firstResult = await measureEndpoint(endpoint);
    if (firstResult.success) {
      console.log(`  First:  ${firstResult.responseTime}ms (${firstResult.cacheStatus})`);
    } else {
      console.log(`  First:  ERROR - ${firstResult.error || firstResult.statusCode}`);
    }
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Second request (should be HIT if cached)
    const secondResult = await measureEndpoint(endpoint);
    if (secondResult.success) {
      console.log(`  Second: ${secondResult.responseTime}ms (${secondResult.cacheStatus})`);
    } else {
      console.log(`  Second: ERROR - ${secondResult.error || secondResult.statusCode}`);
    }
    
    results.push({
      endpoint,
      first: firstResult,
      second: secondResult,
      improvement: firstResult.success && secondResult.success && firstResult.responseTime > 0 && secondResult.responseTime > 0
        ? Math.round(((firstResult.responseTime - secondResult.responseTime) / firstResult.responseTime) * 100)
        : 0
    });
    
    console.log('');
  }
  
  console.log('🔐 Testing Admin Endpoints (Auth Required - May Show 401):\n');
  
  // Test admin endpoints (these will likely return 401, but we can still measure response times)
  for (const endpoint of adminEndpoints) {
    console.log(`Testing: ${endpoint}`);
    
    const firstResult = await measureEndpoint(endpoint);
    console.log(`  Response: ${firstResult.responseTime}ms (Status: ${firstResult.statusCode || 'ERROR'})`);
    
    results.push({
      endpoint,
      first: firstResult,
      second: { responseTime: 0, cacheStatus: 'N/A' },
      improvement: 0,
      requiresAuth: true
    });
    
    console.log('');
  }
  
  // Summary
  console.log('📊 Performance Test Results:\n');
  console.log('Endpoint'.padEnd(35) + 'First'.padEnd(10) + 'Second'.padEnd(10) + 'Cache'.padEnd(10) + 'Improvement');
  console.log('-'.repeat(75));
  
  results.forEach(result => {
    const endpoint = result.endpoint.padEnd(35);
    const first = result.requiresAuth 
      ? `${result.first.responseTime}ms`.padEnd(10)
      : `${result.first.responseTime}ms`.padEnd(10);
    const second = result.requiresAuth 
      ? 'N/A'.padEnd(10)
      : `${result.second.responseTime}ms`.padEnd(10);
    const cache = result.requiresAuth 
      ? 'N/A'.padEnd(10)
      : result.second.cacheStatus.padEnd(10);
    const improvement = result.requiresAuth 
      ? 'N/A'
      : `${result.improvement}%`;
    
    console.log(`${endpoint}${first}${second}${cache}${improvement}`);
  });
  
  // Performance Analysis
  console.log('\n🎯 Performance Analysis:');
  
  const publicResults = results.filter(r => !r.requiresAuth && r.first.success && r.second.success);
  const cachedEndpoints = publicResults.filter(r => r.second.cacheStatus === 'HIT');
  const avgImprovement = publicResults.length > 0 
    ? publicResults.reduce((sum, r) => sum + r.improvement, 0) / publicResults.length 
    : 0;
  
  console.log(`- Public endpoints tested: ${publicResults.length}`);
  console.log(`- Cached endpoints: ${cachedEndpoints.length}/${publicResults.length}`);
  if (publicResults.length > 0) {
    console.log(`- Average cache improvement: ${Math.round(avgImprovement)}%`);
  }
  
  const fastResponses = publicResults.filter(r => r.second.responseTime < 100 && r.second.responseTime > 0);
  console.log(`- Fast responses (<100ms): ${fastResponses.length}/${publicResults.length}`);
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  
  if (publicResults.length === 0) {
    console.log('- ⚠️  No public endpoints could be tested successfully');
    console.log('- 🔧 Check if server is running on ' + BASE_URL);
  }
  
  results.forEach(result => {
    if (result.requiresAuth && result.first.statusCode === 401) {
      console.log(`- ℹ️  ${result.endpoint} requires authentication (expected 401)`);
    } else if (!result.first.success) {
      console.log(`- ❌ ${result.endpoint} failed - check server status`);
    } else if (result.second.responseTime > 500) {
      console.log(`- ⚠️  ${result.endpoint} is slow (${result.second.responseTime}ms) - consider optimization`);
    } else if (result.second.cacheStatus === 'UNKNOWN' && result.endpoint.includes('/api/')) {
      console.log(`- 🔧 ${result.endpoint} has no cache headers - consider adding caching`);
    } else if (result.improvement < 20 && result.second.cacheStatus === 'HIT') {
      console.log(`- 📈 ${result.endpoint} cache improvement is low (${result.improvement}%) - check cache efficiency`);
    }
  });
  
  console.log('\n✅ Performance test completed!');
  console.log('\n💡 For admin endpoint testing:');
  console.log('   1. Login to dashboard in browser');
  console.log('   2. Use browser DevTools Network tab');
  console.log('   3. Check X-Cache headers manually');
}

// Run the test
runPerformanceTest().catch(console.error);