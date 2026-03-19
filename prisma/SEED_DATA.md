# Seed Data Documentation

File ini berisi dokumentasi tentang dummy data yang dibuat untuk testing berbagai fitur produk.

## Cara Menjalankan Seed

```bash
# Install tsx jika belum ada
npm install -D tsx

# Jalankan seed
npm run db:seed
```

## Data yang Dibuat

### Users (2)
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

### Categories (6)
1. Elektronik
2. Fashion
3. Makanan & Minuman
4. Olahraga
5. Kecantikan
6. Rumah Tangga

### Products (23)

#### Karakteristik Produk untuk Testing:

##### 1. Flash Sale Products (9 produk)
Produk dengan badge "Flash Sale" dan memiliki `originalPrice` (diskon):
- Laptop Gaming ROG Strix G15 (Elektronik)
- iPhone 15 Pro Max (Elektronik)
- Sony WH-1000XM5 Headphones (Elektronik)
- Dress Wanita Elegant (Fashion)
- Kopi Arabica Premium (Makanan)
- Cokelat Premium Belgium (Makanan)
- Matras Yoga Premium (Olahraga)
- Serum Vitamin C Korea (Kecantikan)
- Masker Wajah Sheet Korea (Kecantikan)
- Air Fryer Digital 5L (Rumah Tangga)
- Set Panci Stainless Steel (Rumah Tangga)

##### 2. Best Seller / Produk Terpopuler (8 produk)
Produk dengan badge "Best Seller" dan `sold` tinggi:
- Samsung Galaxy S24 Ultra (sold: 167, rating: 4.7)
- Kemeja Flanel Premium (sold: 456, rating: 4.6)
- Sepatu Sneakers Putih (sold: 523, rating: 4.5)
- Madu Hutan Asli (sold: 234, rating: 4.9)
- Sepatu Lari Nike Air Zoom (sold: 267, rating: 4.8)
- Sunscreen SPF 50 (sold: 892, rating: 4.8)
- Lipstick Matte Long Lasting (sold: 1234, rating: 4.7)
- Blender Multifungsi (sold: 378, rating: 4.5)

##### 3. Produk Terbaru (5 produk)
Produk dengan badge "New" dan `createdAt` paling baru (< 7 hari):
- MacBook Air M3 (5 hari lalu)
- Tas Ransel Laptop (3 hari lalu)
- Dumbbell Set 20kg (7 hari lalu)
- Vacuum Cleaner Wireless (2 hari lalu)

##### 4. Related Products (Produk Terkait)
Produk dalam kategori yang sama dapat dijadikan related products:

**Elektronik (5 produk):**
- Laptop Gaming, iPhone, Samsung, MacBook, Headphones

**Fashion (4 produk):**
- Kemeja, Dress, Sneakers, Tas Ransel

**Makanan & Minuman (3 produk):**
- Kopi, Cokelat, Madu

**Olahraga (3 produk):**
- Matras Yoga, Dumbbell, Sepatu Lari

**Kecantikan (4 produk):**
- Serum Vitamin C, Sunscreen, Lipstick, Masker Wajah

**Rumah Tangga (4 produk):**
- Vacuum Cleaner, Air Fryer, Blender, Set Panci

##### 5. Produk Rekomendasi
Berdasarkan kombinasi rating tinggi dan sold tinggi:
- Sony WH-1000XM5 (rating: 4.8, sold: 312)
- Sunscreen SPF 50 (rating: 4.8, sold: 892)
- Lipstick Matte Long Lasting (rating: 4.7, sold: 1234)
- Sepatu Sneakers Putih (rating: 4.5, sold: 523)
- Kemeja Flanel Premium (rating: 4.6, sold: 456)

## Query Examples

### Get Flash Sale Products
```typescript
const flashSaleProducts = await prisma.product.findMany({
  where: {
    badge: 'Flash Sale',
    stock: { gt: 0 }
  },
  include: {
    category: true
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

### Get Best Seller Products
```typescript
const bestSellerProducts = await prisma.product.findMany({
  where: {
    badge: 'Best Seller'
  },
  include: {
    category: true
  },
  orderBy: [
    { sold: 'desc' },
    { rating: 'desc' }
  ],
  take: 10
});
```

### Get New Products
```typescript
const newProducts = await prisma.product.findMany({
  where: {
    badge: 'New'
  },
  include: {
    category: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10
});
```

### Get Related Products (by category)
```typescript
const relatedProducts = await prisma.product.findMany({
  where: {
    categoryId: currentProduct.categoryId,
    id: { not: currentProduct.id }
  },
  include: {
    category: true
  },
  take: 4
});
```

### Get Recommended Products
```typescript
const recommendedProducts = await prisma.product.findMany({
  where: {
    stock: { gt: 0 }
  },
  include: {
    category: true
  },
  orderBy: [
    { rating: 'desc' },
    { sold: 'desc' }
  ],
  take: 10
});
```

### Get Popular Products (by sold)
```typescript
const popularProducts = await prisma.product.findMany({
  where: {
    stock: { gt: 0 }
  },
  include: {
    category: true
  },
  orderBy: {
    sold: 'desc'
  },
  take: 10
});
```

## Testing Scenarios

### 1. Test Flash Sale Feature
- Filter produk dengan badge "Flash Sale"
- Tampilkan harga asli dan harga diskon
- Hitung persentase diskon

### 2. Test Related Products
- Ambil produk dari kategori yang sama
- Exclude produk yang sedang dilihat
- Limit 4-6 produk

### 3. Test Popular Products
- Sort by `sold` DESC
- Filter stock > 0
- Tampilkan badge "Best Seller"

### 4. Test New Arrivals
- Sort by `createdAt` DESC
- Filter produk < 30 hari
- Tampilkan badge "New"

### 5. Test Recommendations
- Kombinasi rating tinggi (> 4.5) dan sold tinggi (> 200)
- Diversifikasi kategori
- Personalisasi berdasarkan history user

## Notes

- Semua produk memiliki stock > 0 untuk testing
- Rating berkisar 4.5 - 4.9 (produk berkualitas)
- Sold bervariasi dari 145 - 1234 untuk testing sorting
- CreatedAt tersebar dari 2 hari - 65 hari lalu
- Image menggunakan Unsplash untuk placeholder
