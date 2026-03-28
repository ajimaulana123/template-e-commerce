@echo off
echo 🚀 Manual Performance Check
echo ==========================
echo.

set BASE_URL=http://localhost:3000

echo 📊 Quick API Response Check:
echo.

echo 1. Testing Categories API (Public):
curl -w "Time: %%{time_total}s | Status: %%{http_code} | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/categories

echo.
echo 2. Testing Products API (Public):
curl -w "Time: %%{time_total}s | Status: %%{http_code} | Cache: %%{header_x_cache}\n" -s -o nul "%BASE_URL%/api/products?page=1&limit=10"

echo.
echo 3. Testing Categories Again (Should be cached):
curl -w "Time: %%{time_total}s | Status: %%{http_code} | Cache: %%{header_x_cache}\n" -s -o nul %BASE_URL%/api/categories

echo.
echo 4. Testing Products Again (Should be cached):
curl -w "Time: %%{time_total}s | Status: %%{http_code} | Cache: %%{header_x_cache}\n" -s -o nul "%BASE_URL%/api/products?page=1&limit=10"

echo.
echo ✅ Quick Check Complete!
echo.
echo 📋 What to Look For:
echo - First request: 0.1-1.0s (MISS or no cache)
echo - Second request: 0.01-0.1s (HIT)
echo - Status: 200 (success)
echo - Cache: HIT on second request
echo.
echo 💡 For Admin APIs (dashboard/analytics):
echo    Login to dashboard first, then check Network tab in DevTools
echo.
pause