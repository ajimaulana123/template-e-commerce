export async function addToWishlist(productId: string) {
  const response = await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId })
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to add to wishlist')
  }

  return response.json()
}

export async function removeFromWishlist(wishlistItemId: string) {
  const response = await fetch(`/api/wishlist/${wishlistItemId}`, {
    method: 'DELETE'
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to remove from wishlist')
  }

  return response.json()
}

export async function checkWishlist(productId: string) {
  const response = await fetch(`/api/wishlist/check?productId=${productId}`)
  
  if (!response.ok) {
    return { inWishlist: false, wishlistItemId: null }
  }

  return response.json()
}

export async function getWishlist() {
  const response = await fetch('/api/wishlist')
  
  if (!response.ok) {
    throw new Error('Failed to fetch wishlist')
  }

  return response.json()
}
