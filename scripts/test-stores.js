/**
 * Simple Store Test Script
 * Run this in browser console to verify stores are working
 */

console.log('🧪 Testing Cart & Wishlist Stores...\n')

// Test 1: Check if stores exist in localStorage
console.log('Test 1: Check localStorage')
const cartData = localStorage.getItem('cart-storage')
const wishlistData = localStorage.getItem('wishlist-storage')

if (cartData) {
  console.log('✅ Cart store exists')
  console.log('Cart data:', JSON.parse(cartData))
} else {
  console.log('⚠️ Cart store empty (add items to cart first)')
}

if (wishlistData) {
  console.log('✅ Wishlist store exists')
  console.log('Wishlist data:', JSON.parse(wishlistData))
} else {
  console.log('⚠️ Wishlist store empty (add items to wishlist first)')
}

// Test 2: Check store structure
console.log('\nTest 2: Validate store structure')
if (cartData) {
  const cart = JSON.parse(cartData)
  if (cart.state && cart.state.items) {
    console.log('✅ Cart structure valid')
    console.log(`   Items: ${cart.state.items.length}`)
  } else {
    console.log('❌ Cart structure invalid')
  }
}

if (wishlistData) {
  const wishlist = JSON.parse(wishlistData)
  if (wishlist.state && wishlist.state.items) {
    console.log('✅ Wishlist structure valid')
    console.log(`   Items: ${wishlist.state.items.length}`)
  } else {
    console.log('❌ Wishlist structure invalid')
  }
}

// Test 3: Check item structure
console.log('\nTest 3: Validate item structure')
if (cartData) {
  const cart = JSON.parse(cartData)
  if (cart.state.items.length > 0) {
    const item = cart.state.items[0]
    const hasRequiredFields = 
      item.id && 
      item.productId && 
      item.quantity && 
      item.product &&
      item.product.name &&
      item.product.price

    if (hasRequiredFields) {
      console.log('✅ Cart item structure valid')
      console.log('   Sample item:', {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        productName: item.product.name,
        price: item.product.price
      })
    } else {
      console.log('❌ Cart item missing required fields')
    }
  }
}

if (wishlistData) {
  const wishlist = JSON.parse(wishlistData)
  if (wishlist.state.items.length > 0) {
    const item = wishlist.state.items[0]
    const hasRequiredFields = 
      item.id && 
      item.productId && 
      item.product &&
      item.product.name &&
      item.product.price

    if (hasRequiredFields) {
      console.log('✅ Wishlist item structure valid')
      console.log('   Sample item:', {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        price: item.product.price
      })
    } else {
      console.log('❌ Wishlist item missing required fields')
    }
  }
}

// Test 4: Performance check
console.log('\nTest 4: Performance check')
console.log('💡 To test performance:')
console.log('   1. Open Network tab')
console.log('   2. Add item to cart/wishlist')
console.log('   3. UI should update instantly (<50ms)')
console.log('   4. API call should happen in background')

// Test 5: Cleanup helper
console.log('\nTest 5: Cleanup helpers')
console.log('💡 To clear stores:')
console.log('   localStorage.removeItem("cart-storage")')
console.log('   localStorage.removeItem("wishlist-storage")')
console.log('   location.reload()')

console.log('\n✅ Store test complete!')
console.log('📝 Check results above for any issues')
