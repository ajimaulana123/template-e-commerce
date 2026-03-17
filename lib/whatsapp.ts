// WhatsApp helper functions

export const getWhatsAppNumber = () => {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628123456789'
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

interface Product {
  name: string
  price: number
  quantity?: number
  image?: string
}

interface CartItem {
  quantity: number
  product: {
    name: string
    price: number
    image: string
  }
}

export const generateProductWhatsAppMessage = (product: Product, quantity: number = 1) => {
  const message = `Halo, saya tertarik dengan produk ini:

📦 *${product.name}*
💰 Harga: ${formatPrice(product.price)}
📊 Jumlah: ${quantity}
💵 Total: ${formatPrice(product.price * quantity)}

Apakah produk ini masih tersedia?`

  return encodeURIComponent(message)
}

export const generateCartWhatsAppMessage = (cartItems: CartItem[]) => {
  let message = `Halo, saya ingin memesan produk berikut:\n\n`
  
  let subtotal = 0
  
  cartItems.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity
    subtotal += itemTotal
    
    message += `${index + 1}. *${item.product.name}*\n`
    message += `   ${formatPrice(item.product.price)} x ${item.quantity} = ${formatPrice(itemTotal)}\n\n`
  })
  
  const shipping = subtotal > 500000 ? 0 : 15000
  const total = subtotal + shipping
  
  message += `━━━━━━━━━━━━━━━━━━━━\n`
  message += `Subtotal: ${formatPrice(subtotal)}\n`
  message += `Ongkir: ${shipping === 0 ? 'GRATIS' : formatPrice(shipping)}\n`
  message += `*Total: ${formatPrice(total)}*\n\n`
  message += `Mohon informasi untuk proses pemesanan. Terima kasih!`
  
  return encodeURIComponent(message)
}

export const openWhatsApp = (message: string) => {
  const phoneNumber = getWhatsAppNumber()
  const url = `https://wa.me/${phoneNumber}?text=${message}`
  window.open(url, '_blank')
}
