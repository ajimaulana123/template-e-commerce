import { verifySession } from './session'

export async function addToCart(productId: string, quantity: number = 1) {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })

    if (!response.ok) {
      const error = await response.json()
      
      // Check if session expired
      if (error.error === 'Session expired. Please login again.') {
        throw new Error('SessionExpired')
      }
      
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      
      throw new Error(error.error || 'Failed to add to cart')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function getCart() {
  try {
    const response = await fetch('/api/cart')
    
    if (!response.ok) {
      if (response.status === 401) {
        return null // Not logged in
      }
      throw new Error('Failed to fetch cart')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update cart item')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function removeFromCart(cartItemId: string) {
  try {
    const response = await fetch(`/api/cart/${cartItemId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to remove from cart')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function checkAuthForCart() {
  const session = await verifySession()
  return !!session
}