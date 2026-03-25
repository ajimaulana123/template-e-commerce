# Phase 2: Dynamic Imports & Lazy Loading Plan

## 🎯 Goal
Reduce initial bundle size and improve Time to Interactive (TTI) by lazy loading heavy components.

---

## 📊 Components to Optimize

### 1. Modals (High Priority)
**Why:** Modals are not needed on initial page load, only when user clicks

- ✅ `CategoryModal` - Large component with category list
- ✅ `ReviewModal` - Form with validation
- ✅ `ProductDetailModal` - Product details view
- ✅ `EditProductModal` - Product edit form

**Impact:** ~50-100KB reduction in initial bundle

---

### 2. Dashboard Components (High Priority)
**Why:** Dashboard is admin-only, shouldn't be in main bundle

- ✅ `AnalyticsPageClient` - Heavy data processing
- ✅ `ProductForm` - Large form with validation
- ✅ `OrdersPageClient` - Data tables

**Impact:** ~100-200KB reduction for non-admin users

---

### 3. Product Components (Medium Priority)
**Why:** Below-the-fold content can be lazy loaded

- ✅ `ProductReviews` - Review list (below fold)
- ✅ `ProductQuestions` - Q&A section (below fold)
- ✅ `RelatedProducts` - Related products grid (below fold)

**Impact:** ~30-50KB reduction, faster initial render

---

### 4. Heavy UI Components (Medium Priority)
**Why:** Not critical for initial render

- ✅ `HeroSlider` - Image carousel (can show placeholder)
- ✅ `ProductGrid` - Can lazy load after viewport

**Impact:** ~20-30KB reduction

---

## 🚀 Implementation Strategy

### Pattern 1: Dynamic Import with Loading State
```typescript
import dynamic from 'next/dynamic'

const CategoryModal = dynamic(() => import('./CategoryModal'), {
  loading: () => <div>Loading...</div>,
  ssr: false // Don't render on server
})
```

### Pattern 2: Lazy Load on Interaction
```typescript
const [showModal, setShowModal] = useState(false)

const Modal = dynamic(() => import('./Modal'))

// Only loads when showModal becomes true
{showModal && <Modal />}
```

### Pattern 3: Lazy Load Below Fold
```typescript
import { lazy, Suspense } from 'react'

const Reviews = lazy(() => import('./ProductReviews'))

<Suspense fallback={<ReviewsSkeleton />}>
  <Reviews />
</Suspense>
```

---

## 📈 Expected Results

### Bundle Size Reduction
- Initial bundle: **-200-400KB** (30-40% smaller)
- Admin routes: **-100-200KB** (code split)
- Modal components: **-50-100KB** (lazy loaded)

### Performance Improvements
- Time to Interactive: **-500ms to -1s**
- First Contentful Paint: **-200ms to -500ms**
- Lighthouse Score: **+10-20 points**

### User Experience
- Faster initial page load
- Smoother navigation
- Better mobile performance
- Lower data usage

---

## 🔧 Implementation Order

### Phase 1: Modals (Quick Win)
1. CategoryModal
2. ReviewModal
3. ProductDetailModal
4. EditProductModal

### Phase 2: Dashboard (Big Impact)
1. AnalyticsPageClient
2. ProductForm
3. OrdersPageClient

### Phase 3: Below-the-Fold (Progressive)
1. ProductReviews
2. ProductQuestions
3. RelatedProducts

### Phase 4: Optional Optimizations
1. HeroSlider
2. ProductGrid (viewport-based)

---

## ✅ Success Criteria

### Technical
- [ ] Bundle size reduced by 30%+
- [ ] No runtime errors
- [ ] All components still functional
- [ ] Loading states smooth

### Performance
- [ ] Lighthouse Performance: 90+
- [ ] Time to Interactive: < 3s
- [ ] First Contentful Paint: < 1.5s
- [ ] Total Blocking Time: < 300ms

### User Experience
- [ ] No visible lag
- [ ] Smooth loading transitions
- [ ] Mobile performance improved
- [ ] No broken functionality

---

## 🧪 Testing Checklist

### After Implementation
1. [ ] Test all modals open correctly
2. [ ] Test dashboard loads properly
3. [ ] Test product pages render correctly
4. [ ] Test mobile performance
5. [ ] Run Lighthouse audit
6. [ ] Check bundle analyzer
7. [ ] Test slow 3G connection

---

## 📝 Notes

### Best Practices
- Use `loading` prop for better UX
- Use `ssr: false` for client-only components
- Provide skeleton loaders
- Test on slow connections
- Monitor bundle size

### Avoid
- Don't lazy load critical components
- Don't lazy load above-the-fold content
- Don't over-optimize (diminishing returns)
- Don't break SSR unnecessarily

---

**Ready to implement!** 🚀
