# Wishlist UX Improvement

## Problem
Ketika user yang belum login mencoba menambahkan produk ke wishlist, aplikasi menampilkan error tanpa penjelasan yang jelas.

## Solution
Menambahkan user-friendly confirmation dialog sebelum redirect ke halaman login.

## Changes Made

### 1. lib/wishlist.ts
- Menambahkan explicit check untuk status 401 (Unauthorized)
- Throw error "Unauthorized" untuk handling yang lebih baik

### 2. app/products/hooks/useWishlist.ts
- Menambahkan confirmation dialog dengan pesan yang jelas:
  - "You need to login to add items to wishlist. Would you like to login now?"
- User bisa memilih untuk login atau cancel
- Jika user memilih login, akan di-redirect ke halaman login dengan return URL

## User Flow

### Before Fix:
1. User (not logged in) clicks wishlist button
2. Error terjadi tanpa penjelasan
3. User bingung

### After Fix:
1. User (not logged in) clicks wishlist button
2. Confirmation dialog muncul: "You need to login to add items to wishlist. Would you like to login now?"
3. User memilih:
   - **OK**: Redirect ke login page dengan return URL
   - **Cancel**: Tetap di halaman saat ini

## Affected Components

Semua komponen yang menggunakan `useWishlist` hook:
- `app/products/[id]/ProductDetailClient.tsx` - Product detail page
- `app/products/components/ProductCard.tsx` - Product card di listing

## Testing

1. Logout dari aplikasi
2. Buka halaman produk atau product listing
3. Click tombol wishlist (heart icon)
4. Verify confirmation dialog muncul
5. Click OK - verify redirect ke login dengan return URL
6. Click Cancel - verify tetap di halaman yang sama

## Notes

- Wishlist feature hanya tersedia untuk logged-in users (by design)
- Cart feature juga menggunakan pattern yang sama untuk consistency
- Return URL memastikan user kembali ke halaman yang sama setelah login
