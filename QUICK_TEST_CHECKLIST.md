# ⚡ Quick Test Checklist - Cart & Wishlist

## 🎯 Priority Tests (Must Pass)

### Setup
```bash
# 1. Start server
npm run dev

# 2. Open browser console and clear storage
localStorage.removeItem('cart-storage')
localStorage.removeItem('wishlist-storage')

# 3. Refresh page
```

---

## 🛒 CART - 5 Critical Tests

### ✅ Test 1: Add to Cart
- [ ] Go to product page
- [ ] Click "Add to Cart"
- [ ] Cart count updates INSTANTLY (no delay)
- [ ] Success message appears

### ✅ Test 2: View Cart
- [ ] Click cart icon
- [ ] See all items with images, prices, categories
- [ ] Totals calculated correctly

### ✅ Test 3: Update Quantity
- [ ] Click + or - buttons
- [ ] Quantity changes INSTANTLY
- [ ] Subtotal updates immediately

### ✅ Test 4: Remove Item
- [ ] Click trash icon
- [ ] Item disappears INSTANTLY
- [ ] Cart count updates

### ✅ Test 5: Persistence
- [ ] Close browser
- [ ] Reopen browser
- [ ] Cart items still there

---

## ❤️ WISHLIST - 5 Critical Tests

### ✅ Test 6: Add to Wishlist
- [ ] Go to product page
- [ ] Click heart icon
- [ ] Heart fills INSTANTLY
- [ ] Wishlist count updates

### ✅ Test 7: Remove from Wishlist
- [ ] Click filled heart
- [ ] Heart empties INSTANTLY
- [ ] Wishlist count decreases

### ✅ Test 8: View Wishlist
- [ ] Click wishlist icon
- [ ] See all items with details
- [ ] Correct count shown

### ✅ Test 9: Remove from Wishlist Page
- [ ] Click X button
- [ ] Item disappears INSTANTLY
- [ ] Count updates

### ✅ Test 10: Persistence
- [ ] Close browser
- [ ] Reopen browser
- [ ] Wishlist items still there

---

## 🔄 INTEGRATION - 2 Critical Tests

### ✅ Test 11: Cart + Wishlist Together
- [ ] Add 3 items to cart
- [ ] Add 3 items to wishlist
- [ ] Both counts correct
- [ ] No conflicts

### ✅ Test 12: Error Handling
- [ ] Open DevTools → Network → Offline
- [ ] Try to add to cart
- [ ] UI updates then rolls back
- [ ] Error message shown

---

## 📊 Quick Performance Check

### ✅ Test 13: Speed Test
- [ ] Open DevTools → Network tab
- [ ] Add item to cart
- [ ] UI updates in < 100ms (instant feel)
- [ ] API call happens in background

---

## ✅ All Tests Passed?

If all 13 tests pass:
- ✅ Cart optimization working
- ✅ Wishlist optimization working
- ✅ Ready for Phase 2 continuation

If any test fails:
- ❌ Check console for errors
- ❌ Check Network tab for failed requests
- ❌ Check localStorage data
- ❌ Report issue for fixing

---

## 🐛 Common Issues & Fixes

### Issue: Cart count not updating
**Fix:** Check if `useCart()` hook is being called in navbar

### Issue: Items not persisting
**Fix:** Check localStorage in DevTools → Application → Local Storage

### Issue: API errors
**Fix:** Check if server is running and database is connected

### Issue: TypeScript errors
**Fix:** Run `npm run build` to check for type errors

### Issue: Slow updates
**Fix:** Check if optimistic updates are enabled in store

---

## 🚀 Ready to Continue?

Once all tests pass, you can proceed to:
**Phase 2 Continuation: Dynamic Imports & Lazy Loading**

This will further improve:
- Initial bundle size
- Time to interactive
- Code splitting
- Lazy loading of heavy components

---

**Testing Time:** ~10-15 minutes  
**Expected Result:** All tests pass ✅
