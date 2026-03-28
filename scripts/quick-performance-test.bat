@echo off
echo 🚀 Quick Performance Test
echo ========================
echo.

set BASE_URL=http://localhost:3000

echo 📊 Testing API Cache Performance...
echo.

echo Testing Dashboard Stats API:
curl -w "Response Time: %%{time_total}s | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/dashboard/stats
timeout /t 1 /nobreak >nul
curl -w "Response Time: %%{time_total}s | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/dashboard/stats

echo.
echo Testing Analytics API:
curl -w "Response Time: %%{time_total}s | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/analytics
timeout /t 1 /nobreak >nul
curl -w "Response Time: %%{time_total}s | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/analytics

echo.
echo Testing Products API:
curl -w "Response Time: %%{time_total}s | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/products?page=1^&limit=10
timeout /t 1 /nobreak >nul
curl -w "Response Time: %%{time_total}s | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/products?page=1^&limit=10

echo.
echo 🧹 Testing Cache Invalidation:
echo Clearing dashboard stats cache...
curl -X POST -s %BASE_URL%/api/dashboard/stats
echo Clearing analytics cache...
curl -X POST -s %BASE_URL%/api/analytics

echo.
echo ✅ Performance test completed!
echo.
echo 💡 Expected Results:
echo - First request: 100-500ms (MISS or no cache header)
echo - Second request: 10-50ms (HIT)
echo - Cache improvement: 70-90%%
echo.
echo 📖 For detailed testing, open: scripts/browser-performance-test.html
pause