# Wishlist Feature Setup Guide

## Overview
Fitur wishlist memungkinkan user untuk menyimpan produk favorit mereka untuk dibeli nanti.

## Quick Setup

### Option 1: Using Migration Script (Recommended)
```bash
# Windows
scripts\migrate-wishlist.bat

# Linux/Mac
node scripts/migrate-wishlist.js
npx prisma generate
```

### Option 2: Manual Database Migration
Jalankan SQL berikut di database Anda:

```sql
-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS "wishlist_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

-- Create unique index to prevent duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");

-- Add foreign key constraints
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

Kemudian generate Prisma client:
```bash
npx prisma generate
```

### Option 3: Using Prisma Migration (If you prefer)
```bash
npx prisma db push
# or
npx prisma migrate dev --name add_wishlist
```

## Features Implemented

### 1. Database Schema
- Model `WishlistItem` dengan relasi ke `User` dan `Product`
- Unique constraint untuk mencegah duplikasi (userId + productId)

### 2. API Endpoints

#### GET /api/wishlist
Mendapatkan semua wishlist items user yang sedang login
- Response: Array of wishlist items dengan product details

#### POST /api/wishlist
Menambahkan produk ke wishlist
- Body: `{ productId: string }`
- Response: Created wishlist item

#### DELETE /api/wishlist/[id]
Menghapus item dari wishlist
- Params: wishlist item id
- Response: Success message

#### GET /api/wishlist/check
Mengecek apakah produk ada di wishlist
- Query: `?productId=xxx`
- Response: `{ inWishlist: boolean, wishlistItemId: string | null }`

### 3. Frontend Components

#### Custom Hooks
- `useWishlist(productId)` - Hook untuk manage wishlist state per product
  - Returns: `{ inWishlist, loading, toggleWishlist }`

#### Pages
- `/wishlist` - Halaman untuk melihat semua wishlist items
- Wishlist button di ProductCard
- Wishlist button di ProductDetailClient
- Wishlist link di navbar (desktop & mobile)
- Wishlist menu di UserMenu dropdown

### 4. UI Features
- Heart icon button di product card (outline/filled)
- Heart icon button di product detail page
- Wishlist page dengan grid layout
- Move to cart functionality
- Remove from wishlist
- Empty state handling

## Usage

### User Flow
1. User browse products
2. Click heart icon untuk add/remove dari wishlist
3. Access wishlist dari navbar atau user menu
4. Di wishlist page, user bisa:
   - View semua saved products
   - Remove dari wishlist
   - Move to cart (add to cart + remove from wishlist)
   - Click product untuk view detail

### Authentication
- Wishlist requires authentication
- Unauthenticated users akan di-redirect ke login page
- Return URL preserved untuk redirect kembali setelah login

## File Structure

```
app/
├── api/
│   └── wishlist/
│       ├── route.ts              # GET, POST
│       ├── [id]/route.ts         # DELETE
│       └── check/route.ts        # GET check status
├── wishlist/
│   ├── page.tsx                  # Wishlist page
│   └── WishlistPageClient.tsx    # Client component
└── products/
    └── hooks/
        └── useWishlist.ts        # Wishlist hook

lib/
└── wishlist.ts                   # Wishlist helper functions

components/
└── navbar/
    └── WishlistButton.tsx        # Navbar wishlist button

prisma/
└── schema.prisma                 # WishlistItem model
```

## Testing

1. Login sebagai user
2. Browse products dan click heart icon
3. Verify product masuk wishlist
4. Navigate ke /wishlist
5. Test remove from wishlist
6. Test move to cart
7. Test wishlist di product detail page

## Notes

- Wishlist tidak memiliki quantity (berbeda dengan cart)
- Satu user hanya bisa add satu product sekali ke wishlist
- Wishlist persisted di database (tidak di localStorage)
- Real-time sync dengan database
