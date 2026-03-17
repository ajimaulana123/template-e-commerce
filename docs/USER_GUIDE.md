# User Guide - Jakarta Notebook E-Commerce

Panduan lengkap untuk menggunakan platform e-commerce Jakarta Notebook.

## Navigasi Utama

### Profile Dropdown Menu

Klik icon User di navbar untuk membuka dropdown menu dengan opsi:

1. **Dashboard** (Admin only)
   - Akses panel admin untuk mengelola produk, kategori, dan orders
   - Hanya tersedia untuk user dengan role ADMIN

2. **My Profile**
   - Lihat informasi akun Anda
   - Email, role, dan tanggal bergabung
   - Quick actions: View Cart, Browse Products, Order History

3. **My Orders**
   - Lihat semua order yang pernah Anda buat
   - Filter berdasarkan status (All, Pending, Processing, Shipped, Delivered, Cancelled)
   - View detail order
   - Cancel order (hanya untuk status PENDING)

4. **Logout**
   - Keluar dari akun Anda

## Fitur Customer

### 1. Browse Products
- Lihat semua produk di halaman Products
- Filter berdasarkan kategori
- Lihat detail produk dengan klik pada produk

### 2. Shopping Cart
- Tambah produk ke cart dari halaman detail produk
- Update quantity di halaman cart
- Remove item dari cart
- Lihat total harga otomatis

### 3. Checkout Process
1. Klik "Checkout" di halaman cart
2. Isi form pengiriman:
   - Full Name (required)
   - Phone Number (required)
   - Address (required)
   - City (required)
   - Postal Code (optional)
   - Province (optional)
3. Pilih metode pembayaran (COD / Bank Transfer)
4. Review order summary
5. Klik "Place Order"
6. Redirect ke halaman konfirmasi order

### 4. Order Management
- **View Orders**: Lihat semua order di `/orders`
- **Filter Orders**: Filter berdasarkan status
- **View Details**: Klik "View Details" untuk melihat detail order
- **Cancel Order**: Klik "Cancel" untuk membatalkan order (hanya PENDING)
- **Order Confirmation**: Setelah checkout, lihat konfirmasi di `/orders/[id]/confirmation`

### 5. Profile Management
- **View Profile**: Lihat informasi akun di `/profile`
- **Quick Actions**: Akses cepat ke Cart, Products, dan Orders
- **Account Info**: Email, role, member since

## Fitur Admin

### 1. Dashboard Access
- Klik "Dashboard" di profile dropdown
- Atau akses langsung ke `/dashboard`

### 2. User Management
- Lihat daftar semua user
- Create user baru
- View user details

### 3. Category Management
- Create kategori baru dengan icon
- Edit kategori existing
- Delete kategori
- Real-time updates

### 4. Product Management
- Create produk baru dengan gambar
- Edit produk existing
- Delete produk
- Set harga, stok, badge
- Upload gambar produk ke Supabase Storage

### 5. Order Management
- View semua orders dari semua customer
- Filter orders by status
- Update order status (Pending → Processing → Shipped → Delivered)
- Update payment status
- View customer information
- View order details

## Status Order

### Order Status
- **PENDING**: Order baru dibuat, menunggu konfirmasi
- **PROCESSING**: Order sedang diproses
- **SHIPPED**: Order sudah dikirim
- **DELIVERED**: Order sudah sampai
- **CANCELLED**: Order dibatalkan

### Payment Status
- **PENDING**: Pembayaran belum diterima
- **PAID**: Pembayaran sudah diterima
- **FAILED**: Pembayaran gagal

## Tips & Tricks

### Untuk Customer
1. Selalu cek stok produk sebelum checkout
2. Isi alamat pengiriman dengan lengkap dan benar
3. Simpan order number untuk tracking
4. Cancel order segera jika ada kesalahan (hanya bisa saat PENDING)
5. Cek order history secara berkala

### Untuk Admin
1. Update order status secara berkala
2. Pastikan stok produk selalu update
3. Gunakan badge untuk highlight produk special
4. Monitor orders dashboard untuk order baru
5. Update payment status setelah konfirmasi pembayaran

## Troubleshooting

### Cart Issues
- **Cart tidak update**: Refresh halaman
- **Item hilang dari cart**: Login ulang
- **Quantity tidak berubah**: Cek koneksi internet

### Checkout Issues
- **Checkout gagal**: Cek stok produk
- **Form tidak submit**: Pastikan semua field required terisi
- **Redirect error**: Clear browser cache

### Order Issues
- **Order tidak muncul**: Refresh halaman orders
- **Cancel gagal**: Pastikan order masih PENDING
- **Detail tidak load**: Cek koneksi internet

## Security

### Password
- Gunakan password yang kuat
- Jangan share password dengan siapapun
- Logout setelah selesai menggunakan

### Personal Information
- Jangan share informasi pribadi di public
- Pastikan alamat pengiriman benar
- Simpan order number dengan aman

## Support

Jika mengalami masalah atau butuh bantuan:
1. Cek dokumentasi di folder `/docs`
2. Contact administrator
3. Report bug via GitHub issues

## Updates

Fitur yang akan datang:
- Email notification setelah order
- Order tracking dengan nomor resi
- Invoice download
- Payment gateway integration
- Product review & rating
- Wishlist feature
- Reorder functionality
