# WhatsApp Order Feature

Fitur untuk memesan produk langsung via WhatsApp dengan pesan yang sudah terformat otomatis.

## Setup

### 1. Konfigurasi Nomor WhatsApp

Tambahkan nomor WhatsApp bisnis di file `.env`:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER="628123456789"
```

Format nomor:
- Gunakan kode negara tanpa tanda `+`
- Contoh: `628123456789` untuk nomor Indonesia `+62 812-3456-789`
- Pastikan nomor sudah terdaftar di WhatsApp

### 2. Verifikasi Setup

Cek apakah nomor sudah benar di `lib/whatsapp.ts`:

```typescript
export const getWhatsAppNumber = () => {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '628123456789'
}
```

## Fitur

### 1. Order dari Product Detail

User bisa klik tombol "Order via WhatsApp" di halaman detail produk.

Pesan yang digenerate:
```
Halo, saya tertarik dengan produk ini:

📦 *Nama Produk*
💰 Harga: Rp 100.000
📊 Jumlah: 2
💵 Total: Rp 200.000

Apakah produk ini masih tersedia?
```

### 2. Order dari Cart

User bisa klik tombol "Order via WhatsApp" di halaman cart untuk order semua item sekaligus.

Pesan yang digenerate:
```
Halo, saya ingin memesan produk berikut:

1. *Produk A*
   Rp 100.000 x 2 = Rp 200.000

2. *Produk B*
   Rp 50.000 x 1 = Rp 50.000

━━━━━━━━━━━━━━━━━━━━
Subtotal: Rp 250.000
Ongkir: Rp 15.000
*Total: Rp 265.000*

Mohon informasi untuk proses pemesanan. Terima kasih!
```

## Implementasi

### Helper Functions

File: `lib/whatsapp.ts`

```typescript
// Generate pesan untuk single product
generateProductWhatsAppMessage(product, quantity)

// Generate pesan untuk cart items
generateCartWhatsAppMessage(cartItems)

// Open WhatsApp dengan pesan
openWhatsApp(message)
```

### Product Detail Page

File: `app/products/[id]/ProductDetailClient.tsx`

```typescript
const handleOrderWhatsApp = () => {
  if (!product) return
  const message = generateProductWhatsAppMessage(product, quantity)
  openWhatsApp(message)
}
```

### Cart Page

File: `app/cart/CartPageClient.tsx`

```typescript
const handleOrderWhatsApp = () => {
  const message = generateCartWhatsAppMessage(cartItems)
  openWhatsApp(message)
}
```

## User Flow

### Flow 1: Order dari Product Detail
1. User browse produk
2. Klik produk untuk lihat detail
3. Pilih quantity
4. Klik "Order via WhatsApp"
5. Redirect ke WhatsApp dengan pesan pre-filled
6. User bisa edit pesan atau langsung kirim
7. Admin terima pesan di WhatsApp

### Flow 2: Order dari Cart
1. User add multiple products ke cart
2. Go to cart page
3. Review items & total
4. Klik "Order via WhatsApp"
5. Redirect ke WhatsApp dengan semua items
6. User bisa edit pesan atau langsung kirim
7. Admin terima pesan di WhatsApp

## Keuntungan

### Untuk Customer:
- Lebih personal & direct communication
- Bisa tanya langsung sebelum order
- Tidak perlu isi form panjang
- Familiar dengan WhatsApp interface
- Bisa nego harga atau tanya detail

### Untuk Admin:
- Direct communication dengan customer
- Bisa follow up lebih cepat
- Lebih fleksibel dalam handle order
- Build relationship dengan customer
- Easy untuk handle custom request

## Best Practices

### 1. Response Time
- Balas pesan WhatsApp secepat mungkin
- Set auto-reply untuk di luar jam kerja
- Inform customer tentang jam operasional

### 2. Message Template
- Gunakan template untuk reply cepat
- Simpan template untuk pertanyaan umum
- Personalize setiap response

### 3. Order Management
- Catat setiap order dari WhatsApp
- Update status order via WhatsApp
- Kirim bukti pengiriman via WhatsApp

### 4. Customer Service
- Ramah dan profesional
- Jelas dalam komunikasi
- Follow up sampai order selesai

## Customization

### Ubah Format Pesan

Edit di `lib/whatsapp.ts`:

```typescript
export const generateProductWhatsAppMessage = (product, quantity) => {
  const message = `
    // Custom format di sini
  `
  return encodeURIComponent(message)
}
```

### Tambah Info Tambahan

Bisa tambah info seperti:
- Link produk
- Gambar produk (via URL)
- Promo yang sedang berlangsung
- Estimasi pengiriman
- Metode pembayaran

### Multiple WhatsApp Numbers

Untuk multiple admin/CS:

```typescript
export const getWhatsAppNumber = (department?: string) => {
  const numbers = {
    sales: '628123456789',
    support: '628987654321',
    default: '628123456789'
  }
  return numbers[department || 'default']
}
```

## Troubleshooting

### Nomor WhatsApp tidak valid
- Pastikan format nomor benar (628xxx)
- Cek nomor sudah terdaftar di WhatsApp
- Test dengan nomor sendiri dulu

### Pesan tidak terkirim
- Cek koneksi internet user
- Pastikan WhatsApp terinstall
- Cek browser support untuk `window.open`

### Pesan terpotong
- Cek encoding URL
- Pastikan tidak ada karakter special
- Test dengan pesan lebih pendek

## Future Enhancements

1. **WhatsApp Business API Integration**
   - Automated responses
   - Order tracking via WhatsApp
   - Payment confirmation

2. **Analytics**
   - Track WhatsApp order conversion
   - Popular products via WhatsApp
   - Response time metrics

3. **Multi-language Support**
   - English messages
   - Other languages

4. **Rich Media**
   - Send product images
   - Send catalog
   - Send location

## Security Notes

- Jangan expose nomor WhatsApp di public
- Gunakan WhatsApp Business untuk profesional
- Set privacy settings dengan benar
- Backup chat history secara berkala
- Train staff untuk handle customer data

## Support

Jika ada masalah dengan fitur WhatsApp Order:
1. Cek dokumentasi ini
2. Test dengan nomor sendiri
3. Cek browser console untuk error
4. Contact developer untuk support
