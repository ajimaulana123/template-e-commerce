# 🚀 Performance Testing Guide

Panduan lengkap untuk testing semua optimasi performa yang sudah diterapkan.

## 📋 Daftar Optimasi yang Akan Ditest

### ✅ **Optimasi yang Sudah Diterapkan:**
1. **Dashboard Stats Caching** - Cache 5 menit dengan invalidasi otomatis
2. **Image Optimization** - Next.js Image dengan AVIF/WebP
3. **Loading States & Skeletons** - Loading profesional untuk semua halaman
4. **Analytics Data Caching** - Cache terpusat dengan TTL 5 menit
5. **Cache Invalidation** - Otomatis clear cache saat data berubah

## 🧪 Testing Methods

### **1. Automated Performance Testing**

#### **Script Testing (Recommended)**
```bash
# Jalankan automated performance test
node scripts/test-performance.js
```

**Output yang diharapkan:**
```
🚀 Starting Performance Test...

Testing: /api/dashboard/stats
  First:  245ms (MISS)
  Second: 12ms (HIT)

Testing: /api/analytics
  First:  189ms (MISS)  
  Second: 8ms (HIT)

📊 Performance Test Results:
Endpoint                      First     Second    Cache     Improvement
----------------------------------------------------------------------
/api/dashboard/stats          245ms     12ms      HIT       95%
/api/analytics                189ms     8ms       HIT       96%
```

### **2. Manual Browser Testing**

#### **A. Cache Performance Testing**
1. **Buka Chrome DevTools** (F12)
2. **Go to Network tab**
3. **Navigate ke dashboard** (`/dashboard`)
4. **Check response times:**
   - First load: 200-500ms
   - Refresh page: 10-50ms
   - Look for `X-Cache: HIT` headers

#### **B. Image Optimization Testing**
1. **Network tab → Filter by Images**
2. **Check image formats:**
   - Should see `.avif` or `.webp` formats
   - File sizes should be 50-80% smaller
3. **Check loading behavior:**
   - Above-fold images load immediately
   - Below-fold images lazy load

#### **C. Loading States Testing**
1. **Throttle network** (Network tab → Slow 3G)
2. **Navigate between dashboard pages:**
   - `/dashboard` → Should show skeleton loading
   - `/dashboard/analytics` → Should show analytics skeleton
   - `/dashboard/orders` → Should show orders skeleton
   - `/dashboard/categories` → Should show categories skeleton

### **3. Lighthouse Performance Audit**

#### **Run Lighthouse Test:**
1. **Open Chrome DevTools**
2. **Go to Lighthouse tab**
3. **Select "Performance" only**
4. **Run audit on these pages:**
   - `/dashboard`
   - `/dashboard/analytics`
   - `/dashboard/products`
   - `/products`

#### **Expected Lighthouse Scores:**
- **Performance**: 85+ (Desktop), 70+ (Mobile)
- **LCP (Largest Contentful Paint)**: <2.5s
- **FCP (First Contentful Paint)**: <1.8s
- **CLS (Cumulative Layout Shift)**: <0.1

### **4. Cache Invalidation Testing**

#### **Test Cache Clearing:**
```bash
# Test dashboard stats cache
curl -X POST http://localhost:3000/api/dashboard/stats

# Test analytics cache  
curl -X POST http://localhost:3000/api/analytics
```

#### **Test Automatic Invalidation:**
1. **Load dashboard** → Note cache status (HIT)
2. **Create new product** → Cache should clear
3. **Reload dashboard** → Should be MISS, then HIT
4. **Create new order** → Cache should clear again

## 📊 Performance Benchmarks

### **Target Performance Metrics:**

#### **API Response Times:**
- **Cached responses**: 10-50ms
- **Cache miss**: 100-300ms
- **Cache hit rate**: 80-90%

#### **Page Load Times:**
- **Dashboard pages**: <2s
- **Product pages**: <1.5s
- **Time to Interactive**: <3s

#### **Image Performance:**
- **Format**: AVIF/WebP (not JPEG/PNG)
- **Size reduction**: 50-80%
- **Loading**: Lazy loading for below-fold

#### **Loading States:**
- **Skeleton loading**: Should appear instantly
- **No blank screens**: Always show loading state
- **Smooth transitions**: No layout shifts

## 🔧 Troubleshooting

### **Common Issues & Solutions:**

#### **Cache Not Working:**
```bash
# Check if cache is enabled
curl -I http://localhost:3000/api/dashboard/stats
# Should see: X-Cache: HIT or MISS
```

#### **Images Not Optimized:**
- Check Network tab for `.avif` or `.webp` formats
- Verify Next.js config has image optimization enabled
- Check if images are using Next.js `<Image>` component

#### **Loading States Not Showing:**
- Check if skeleton components are imported correctly
- Verify loading.tsx files exist in route folders
- Test with slow network (Slow 3G)

#### **Poor Lighthouse Scores:**
- Check for unused JavaScript
- Verify images are optimized
- Check for layout shifts (CLS)
- Ensure proper caching headers

## 📈 Performance Monitoring

### **Production Monitoring:**

#### **Server Logs:**
```bash
# Monitor cache hit rates
grep "X-Cache" logs/access.log | grep "HIT" | wc -l

# Monitor response times
grep "api/dashboard/stats" logs/access.log
```

#### **Client-side Monitoring:**
```javascript
// Add to PerformanceMonitor component
performance.mark('dashboard-load-start')
// ... after dashboard loads
performance.mark('dashboard-load-end')
performance.measure('dashboard-load', 'dashboard-load-start', 'dashboard-load-end')
```

### **Key Metrics to Track:**
1. **Cache Hit Rate**: Target 80-90%
2. **Average Response Time**: Target <100ms for cached
3. **Page Load Time**: Target <2s
4. **Image Load Time**: Target 50% improvement
5. **User Engagement**: Bounce rate, time on page

## ✅ Testing Checklist

### **Before Testing:**
- [ ] Server is running (`npm run dev`)
- [ ] Database is connected
- [ ] Admin user is created
- [ ] Sample data exists (products, orders, categories)

### **Performance Tests:**
- [ ] **Automated script test** - Run `node scripts/test-performance.js`
- [ ] **Cache performance** - Check X-Cache headers
- [ ] **Image optimization** - Verify AVIF/WebP formats
- [ ] **Loading states** - Test with slow network
- [ ] **Lighthouse audit** - Score 85+ desktop, 70+ mobile
- [ ] **Cache invalidation** - Test automatic clearing

### **Functional Tests:**
- [ ] **Dashboard loads fast** - <2s with cache
- [ ] **Analytics loads fast** - <2s with cache  
- [ ] **Images load properly** - Lazy loading works
- [ ] **Skeletons show** - No blank screens
- [ ] **Cache clears** - When data changes

### **Mobile Tests:**
- [ ] **Mobile performance** - Test on slow connection
- [ ] **Image loading** - Proper sizes for mobile
- [ ] **Loading states** - Skeletons work on mobile
- [ ] **Touch interactions** - Smooth scrolling

## 🎯 Expected Results

### **Performance Improvements:**
- **80-90% faster** dashboard loading (cached)
- **50-80% smaller** image file sizes
- **30-50% faster** image loading
- **Professional loading** states (no blank screens)
- **Consistent performance** across all pages

### **User Experience:**
- **Instant dashboard** loading after first visit
- **Smooth image** loading with proper placeholders
- **No layout shifts** during loading
- **Professional appearance** with skeleton loading

---

## 🚀 Quick Start Testing

**Untuk test cepat, jalankan:**

```bash
# 1. Start server
npm run dev

# 2. Run performance test
node scripts/test-performance.js

# 3. Open browser and test manually
# - Go to /dashboard
# - Check Network tab for cache headers
# - Test loading states with slow network
# - Run Lighthouse audit
```

**Expected: 80-90% cache improvement, professional loading states, optimized images**

## 🎮 Testing Commands

### **NPM Scripts (Recommended)**
```bash
# Automated performance test (Node.js)
npm run perf:test

# Quick command line test (Windows)
npm run perf:quick

# Browser-based testing dashboard
npm run perf:browser
```

### **Manual Commands**
```bash
# Start development server
npm run dev

# Run automated test
node scripts/test-performance.js

# Quick Windows test
scripts/quick-performance-test.bat

# Open browser testing dashboard
# Double-click: scripts/browser-performance-test.html
```

## 📱 Mobile Testing

### **Chrome DevTools Mobile Simulation:**
1. **Open DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Select device**: iPhone 12 Pro, Pixel 5, etc.
4. **Network throttling**: Slow 3G
5. **Test all dashboard pages**

### **Expected Mobile Performance:**
- **Dashboard load**: <3s on Slow 3G
- **Image loading**: Progressive with placeholders
- **Touch interactions**: Smooth scrolling
- **Loading states**: Proper skeleton loading

## 🔍 Advanced Testing

### **Chrome DevTools Performance Tab:**
1. **Open Performance tab**
2. **Click Record** 
3. **Navigate to dashboard**
4. **Stop recording**
5. **Analyze:**
   - **LCP**: <2.5s
   - **FCP**: <1.8s
   - **No long tasks**: <50ms

### **Network Analysis:**
1. **Network tab**
2. **Filter by XHR/Fetch**
3. **Check API calls:**
   - First load: 200-500ms
   - Cached: 10-50ms
   - Headers: X-Cache: HIT/MISS

### **Memory Usage:**
1. **Memory tab**
2. **Take heap snapshot**
3. **Navigate dashboard**
4. **Take another snapshot**
5. **Check for memory leaks**

## 🚨 Performance Alerts

### **Red Flags (Need Immediate Attention):**
- ❌ **API response > 1000ms** (even on first load)
- ❌ **No cache headers** (X-Cache missing)
- ❌ **Images still JPEG/PNG** (not AVIF/WebP)
- ❌ **Blank screens** (no loading states)
- ❌ **Lighthouse score < 60**

### **Yellow Flags (Monitor Closely):**
- ⚠️ **Cache hit rate < 70%**
- ⚠️ **Page load > 3s** on fast connection
- ⚠️ **Layout shifts** during loading
- ⚠️ **Large bundle sizes** (>1MB)

### **Green Flags (Excellent Performance):**
- ✅ **Cache hit rate > 80%**
- ✅ **API responses < 100ms** (cached)
- ✅ **AVIF/WebP images**
- ✅ **Skeleton loading states**
- ✅ **Lighthouse score > 85**

## 📊 Performance Report Template

### **Weekly Performance Report:**
```
📈 Performance Report - Week of [Date]

🎯 Key Metrics:
- Cache Hit Rate: 87% (Target: >80%) ✅
- Avg API Response: 45ms (Target: <100ms) ✅  
- Page Load Time: 1.8s (Target: <2s) ✅
- Lighthouse Score: 92 (Target: >85) ✅
- Image Optimization: 94% (Target: >80%) ✅

🚀 Improvements This Week:
- Implemented analytics caching (+89% performance)
- Added skeleton loading states
- Optimized image formats (AVIF/WebP)

⚠️ Areas to Monitor:
- Orders page load time: 2.1s (slightly above target)
- Mobile performance on slow networks

📋 Action Items:
- [ ] Implement orders table virtualization
- [ ] Add service worker caching
- [ ] Monitor cache hit rates in production
```

---

## 🎉 Success Criteria

**Your performance optimization is successful if:**

### **✅ Cache Performance:**
- Dashboard stats load in <50ms (cached)
- Analytics load in <50ms (cached)  
- Cache hit rate >80% in normal usage
- Automatic cache invalidation works

### **✅ Image Performance:**
- 90%+ images use AVIF/WebP format
- 50-80% reduction in image file sizes
- Lazy loading works for below-fold images
- No layout shifts during image loading

### **✅ Loading Experience:**
- Professional skeleton loading on all pages
- No blank screens during navigation
- Smooth transitions between states
- Loading states work on slow networks

### **✅ Overall Performance:**
- Lighthouse Performance score >85 (desktop)
- Lighthouse Performance score >70 (mobile)
- Page load time <2s (fast connection)
- Time to Interactive <3s

**🎯 Target Achievement: 80-90% performance improvement across all metrics**