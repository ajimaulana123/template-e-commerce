# 🧪 Testing Guide - Cart & Wishlist Optimization

## Pre-Testing Checklist

### 1. Start Development Server
```bash
npm run dev
```

### 2. Clear Browser Storage (Fresh Start)
Open browser console and run:
```javascript
localStorage.removeItem('cart-storage')
localStorage.removeItem('wishlist-storage')
```

Then refresh the page.

---

## 🛒 CART TESTING

### Test 1: Add to Cart (Product Page)
**Steps:**
1. Go to any product page: `http://localhost:3000/products/[product-id]`
2. Click "Add to Cart" button
3. Observe cart count in navbar

**Expected Results:**
- ✅ Cart count updates INSTANTLY (no delay)
- ✅ Success toast appears
- ✅ Button shows loading state briefly
- ✅ Network tab shows API call in background

**Check:**
```javascript
// In console
localStorage.getItem('cart-storage')
// Should show cart items
```

---

### Test 2: Add to Cart (Product Grid)
**Steps:**
1. Go to products page: `http://localhost:3000/products`
2. Click "Add to Cart" on any product card
3. Observe cart count

**Expected Results:**
- ✅ Cart count updates INSTANTLY
- ✅ Alert shows "Product added to cart successfully!"
- ✅ No page reload

---

### Test 3: View Cart Page
**Steps:**
1. Click cart icon in navbar
2. Go to cart page: `http://localhost:3000/cart`

**Expected Results:**
- ✅ All cart items displayed with:
  - Product image
  - Product name
  - Category name
  - Price (with discount if applicable)
  - Quantity controls
  - Subtotal
- ✅ Order summary shows correct totals
- ✅ Shipping calculation correct (free over 500k)

---

### Test 4: Update Quantity
**Steps:**
1. On cart page, click + or - buttons
2. Observe quantity change

**Expected Results:**
- ✅ Quantity updates INSTANTLY
- ✅ Subtotal recalculates immediately
- ✅ Total updates immediately
- ✅ Shows "..." briefly during sync
- ✅ Network tab shows PUT request in background

---

### Test 5: Remove from Cart
**Steps:**
1. On cart page, click trash icon
2. Confirm removal

**Expected Results:**
- ✅ Item disappears INSTANTLY
- ✅ Cart count updates immediately
- ✅ Totals recalculate
- ✅ Network tab shows DELETE request

---

### Test 6: Cart Persistence
**Steps:**
1. Add items to cart
2. Close browser completely
3. Reopen browser
4. Go to site

**Expected Results:**
- ✅ Cart count shows correct number immediately
- ✅ Cart items still there
- ✅ No loading spinner on navbar

---

### Test 7: WhatsApp Order
**Steps:**
1. On cart page with items
2. Click "Order via WhatsApp"

**Expected Results:**
- ✅ WhatsApp opens in new tab
- ✅ Message formatted correctly with:
  - Product names
  - Quantities
  - Prices
  - Subtotal
  - Shipping
  - Total

---

### Test 8: Error Handling (Cart)
**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to add/update/remove cart item
4. Go back online

**Expected Results:**
- ✅ UI updates optimistically
- ✅ Error toast appears
- ✅ UI rolls back to previous state
- ✅ No broken state

---

## ❤️ WISHLIST TESTING

### Test 9: Add to Wishlist (Product Page)
**Steps:**
1. Go to any product page
2. Click heart icon (empty heart)
3. Observe heart icon and wishlist count

**Expected Results:**
- ✅ Heart fills with red INSTANTLY
- ✅ Wishlist count updates immediately
- ✅ Success toast appears
- ✅ Network tab shows API call in background

**Check:**
```javascript
// In console
localStorage.getItem('wishlist-storage')
// Should show wishlist items
```

---

### Test 10: Remove from Wishlist (Product Page)
**Steps:**
1. On product page with filled heart
2. Click heart icon again

**Expected Results:**
- ✅ Heart empties INSTANTLY
- ✅ Wishlist count decreases immediately
- ✅ Toast shows "Removed from wishlist"

---

### Test 11: Toggle Wishlist (Product Grid)
**Steps:**
1. Go to products page
2. Click heart icon on multiple products
3. Observe hearts and count

**Expected Results:**
- ✅ Each heart toggles INSTANTLY
- ✅ Wishlist count updates correctly
- ✅ Multiple toggles work smoothly

---

### Test 12: View Wishlist Page
**Steps:**
1. Click wishlist icon in navbar
2. Go to wishlist page: `http://localhost:3000/wishlist`

**Expected Results:**
- ✅ All wishlist items displayed with:
  - Product image
  - Product name
  - Category name
  - Price (with discount if applicable)
  - Stock count
  - Add to Cart button
- ✅ Correct item count in header

---

### Test 13: Remove from Wishlist Page
**Steps:**
1. On wishlist page, click X button on item
2. Observe removal

**Expected Results:**
- ✅ Item disappears INSTANTLY
- ✅ Wishlist count updates immediately
- ✅ No loading spinner
- ✅ Network tab shows DELETE request

---

### Test 14: Add to Cart from Wishlist
**Steps:**
1. On wishlist page, click "Add to Cart" button
2. Observe both cart and wishlist

**Expected Results:**
- ✅ Item removed from wishlist INSTANTLY
- ✅ Cart count increases immediately
- ✅ Wishlist count decreases immediately
- ✅ Alert shows "Product moved to cart!"

---

### Test 15: Wishlist Persistence
**Steps:**
1. Add items to wishlist
2. Close browser completely
3. Reopen browser
4. Go to site

**Expected Results:**
- ✅ Wishlist count shows correct number immediately
- ✅ Heart icons show correct state (filled/empty)
- ✅ Wishlist page shows all items

---

### Test 16: Wishlist State Sync Across Pages
**Steps:**
1. Add product to wishlist on product page
2. Navigate to products grid
3. Find same product

**Expected Results:**
- ✅ Heart icon is filled on grid
- ✅ State consistent across pages
- ✅ No API calls to check state

---

### Test 17: Error Handling (Wishlist)
**Steps:**
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to add/remove wishlist item
4. Go back online

**Expected Results:**
- ✅ UI updates optimistically
- ✅ Error toast appears
- ✅ UI rolls back to previous state
- ✅ No broken state

---

## 🔄 INTEGRATION TESTING

### Test 18: Cart + Wishlist Together
**Steps:**
1. Add 3 products to cart
2. Add 5 products to wishlist
3. Navigate between pages
4. Check counts

**Expected Results:**
- ✅ Both counts correct everywhere
- ✅ No conflicts between stores
- ✅ Both persist correctly

---

### Test 19: Login/Logout Flow
**Steps:**
1. Add items to cart and wishlist (not logged in)
2. Login
3. Check cart and wishlist
4. Logout
5. Check again

**Expected Results:**
- ✅ Items sync to server on login
- ✅ Items persist in localStorage
- ✅ Server data loads on login
- ✅ No data loss

---

### Test 20: Multiple Tabs
**Steps:**
1. Open site in 2 tabs
2. Add to cart in tab 1
3. Check tab 2

**Expected Results:**
- ✅ Both tabs show same data (after refresh)
- ✅ localStorage syncs between tabs
- ✅ No conflicts

---

## 📊 PERFORMANCE TESTING

### Test 21: Speed Comparison
**Steps:**
1. Open DevTools → Network tab
2. Clear cache
3. Add item to cart
4. Measure time to UI update

**Expected Results:**
- ✅ UI updates in < 50ms (instant)
- ✅ API call completes in background (300-500ms)
- ✅ No blocking

---

### Test 22: Multiple Rapid Actions
**Steps:**
1. Rapidly click add to cart 5 times
2. Rapidly toggle wishlist 5 times
3. Observe behavior

**Expected Results:**
- ✅ All actions processed
- ✅ No race conditions
- ✅ Final state correct
- ✅ No duplicate items

---

### Test 23: Large Cart/Wishlist
**Steps:**
1. Add 20+ items to cart
2. Add 30+ items to wishlist
3. Navigate pages
4. Check performance

**Expected Results:**
- ✅ No lag on page load
- ✅ Counts update instantly
- ✅ localStorage handles large data
- ✅ No memory issues

---

## 🐛 EDGE CASES

### Test 24: Out of Stock
**Steps:**
1. Find product with stock = 0
2. Try to add to cart

**Expected Results:**
- ✅ Button disabled or shows "Out of Stock"
- ✅ Cannot add to cart
- ✅ Can still add to wishlist

---

### Test 25: Quantity Limits
**Steps:**
1. Add item to cart
2. Try to increase quantity beyond stock
3. Observe behavior

**Expected Results:**
- ✅ Quantity capped at stock level
- ✅ + button disabled at max
- ✅ Error message if exceeded

---

### Test 26: Duplicate Prevention
**Steps:**
1. Add same product to cart twice
2. Check cart

**Expected Results:**
- ✅ Only one cart item
- ✅ Quantity increased instead
- ✅ No duplicates

---

### Test 27: Network Failure Recovery
**Steps:**
1. Go offline
2. Add 3 items to cart
3. Go online
4. Refresh page

**Expected Results:**
- ✅ Items persist in localStorage
- ✅ Sync attempts on reconnect
- ✅ No data loss

---

## ✅ SUCCESS CRITERIA

### Cart
- [ ] All 8 cart tests pass
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Instant UI updates
- [ ] Background sync works
- [ ] Error handling works
- [ ] Persistence works

### Wishlist
- [ ] All 9 wishlist tests pass
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Instant UI updates
- [ ] Background sync works
- [ ] Error handling works
- [ ] Persistence works

### Integration
- [ ] All 3 integration tests pass
- [ ] No conflicts between stores
- [ ] Login/logout works
- [ ] Multi-tab works

### Performance
- [ ] All 3 performance tests pass
- [ ] UI updates < 50ms
- [ ] No blocking operations
- [ ] Handles large datasets

### Edge Cases
- [ ] All 4 edge case tests pass
- [ ] Stock limits enforced
- [ ] Duplicates prevented
- [ ] Network failures handled

---

## 🔍 Debugging Commands

### Check Cart State
```javascript
// In browser console
const cartData = localStorage.getItem('cart-storage')
console.log(JSON.parse(cartData))
```

### Check Wishlist State
```javascript
const wishlistData = localStorage.getItem('wishlist-storage')
console.log(JSON.parse(wishlistData))
```

### Clear All Storage
```javascript
localStorage.clear()
location.reload()
```

### Monitor Network Calls
```javascript
// In console, watch for API calls
// Network tab → Filter: /api/cart, /api/wishlist
```

---

## 📝 Test Results Template

Copy this and fill in results:

```
## Test Results - [Date]

### Cart Tests
- [ ] Test 1: Add to Cart (Product Page)
- [ ] Test 2: Add to Cart (Product Grid)
- [ ] Test 3: View Cart Page
- [ ] Test 4: Update Quantity
- [ ] Test 5: Remove from Cart
- [ ] Test 6: Cart Persistence
- [ ] Test 7: WhatsApp Order
- [ ] Test 8: Error Handling

### Wishlist Tests
- [ ] Test 9: Add to Wishlist (Product Page)
- [ ] Test 10: Remove from Wishlist (Product Page)
- [ ] Test 11: Toggle Wishlist (Product Grid)
- [ ] Test 12: View Wishlist Page
- [ ] Test 13: Remove from Wishlist Page
- [ ] Test 14: Add to Cart from Wishlist
- [ ] Test 15: Wishlist Persistence
- [ ] Test 16: Wishlist State Sync
- [ ] Test 17: Error Handling

### Integration Tests
- [ ] Test 18: Cart + Wishlist Together
- [ ] Test 19: Login/Logout Flow
- [ ] Test 20: Multiple Tabs

### Performance Tests
- [ ] Test 21: Speed Comparison
- [ ] Test 22: Multiple Rapid Actions
- [ ] Test 23: Large Cart/Wishlist

### Edge Cases
- [ ] Test 24: Out of Stock
- [ ] Test 25: Quantity Limits
- [ ] Test 26: Duplicate Prevention
- [ ] Test 27: Network Failure Recovery

### Issues Found
1. [Issue description]
2. [Issue description]

### Notes
[Any additional observations]
```

---

## 🚀 Ready to Test!

1. Start dev server: `npm run dev`
2. Clear storage (fresh start)
3. Follow tests in order
4. Check off each test
5. Report any issues

**Good luck! 🎉**
