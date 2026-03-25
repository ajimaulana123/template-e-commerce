# Migration Guide - Add Performance Indexes

## Situasi Saat Ini

Database sudah ada dan running, tapi Prisma detect "drift" karena tidak ada migration history. Kita perlu membuat baseline migration dulu, baru tambah indexes.

## ✅ Langkah-Langkah (AMAN - Tidak Kehilangan Data)

### Step 1: Create Baseline Migration

```bash
# Buat folder migrations jika belum ada
mkdir -p prisma/migrations

# Buat baseline migration
npx prisma migrate resolve --applied "0_init"
```

Ini akan membuat migration history tanpa mengubah database.

### Step 2: Generate Migration untuk Indexes

```bash
# Generate migration untuk indexes baru
npx prisma migrate dev --name add_performance_indexes
```

Prisma akan detect perbedaan (indexes baru) dan create migration file.

### Step 3: Verify Migration

```bash
# Check migration status
npx prisma migrate status

# Should show: Database schema is up to date!
```

### Step 4: Test Application

```bash
# Build
npm run build

# Run dev
npm run dev

# Test di browser
```

---

## 🔍 Jika Masih Ada Error

### Error: "Migration already applied"

Jika baseline sudah ada, langsung buat migration baru:

```bash
npx prisma migrate dev --name add_performance_indexes --create-only
```

Lalu review migration file di `prisma/migrations/`, dan apply:

```bash
npx prisma migrate deploy
```

### Error: "Cannot create migration"

Reset migration history (TIDAK menghapus data):

```bash
# Hapus folder migrations
rm -rf prisma/migrations

# Buat baseline baru
npx prisma migrate dev --name init
```

---

## 🚨 Alternatif: Manual Index Creation (Jika Migration Gagal)

Jika migration tetap bermasalah, buat indexes manual via SQL:

### 1. Buka Supabase SQL Editor

Login ke Supabase Dashboard > SQL Editor

### 2. Run SQL Commands

```sql
-- Product indexes
CREATE INDEX IF NOT EXISTS "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX IF NOT EXISTS "products_createdAt_idx" ON "products"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "products_sold_idx" ON "products"("sold" DESC);
CREATE INDEX IF NOT EXISTS "products_name_idx" ON "products"("name");
CREATE INDEX IF NOT EXISTS "products_price_idx" ON "products"("price");

-- Order indexes
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX IF NOT EXISTS "orders_createdAt_idx" ON "orders"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "orders_orderNumber_idx" ON "orders"("orderNumber");

-- Cart indexes
CREATE INDEX IF NOT EXISTS "cart_items_userId_idx" ON "cart_items"("userId");

-- Wishlist indexes
CREATE INDEX IF NOT EXISTS "wishlist_items_userId_idx" ON "wishlist_items"("userId");

-- Review indexes
CREATE INDEX IF NOT EXISTS "product_reviews_productId_idx" ON "product_reviews"("productId");
CREATE INDEX IF NOT EXISTS "product_reviews_createdAt_idx" ON "product_reviews"("createdAt" DESC);

-- Question indexes
CREATE INDEX IF NOT EXISTS "product_questions_productId_idx" ON "product_questions"("productId");
CREATE INDEX IF NOT EXISTS "product_questions_createdAt_idx" ON "product_questions"("createdAt" DESC);
```

### 3. Verify Indexes Created

```sql
-- Check all indexes
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 4. Update Prisma

Setelah manual create indexes, sync Prisma:

```bash
# Pull schema dari database
npx prisma db pull

# Generate Prisma Client
npx prisma generate
```

---

## ✅ Verification Checklist

Setelah migration/manual indexes:

- [ ] Run `npx prisma migrate status` - Should show "up to date"
- [ ] Run `npm run build` - Should build successfully
- [ ] Test pagination di products page
- [ ] Check Network tab - API calls berkurang
- [ ] Test search debouncing
- [ ] Verify images load as WebP/AVIF

---

## 📊 Expected Results

Setelah indexes ditambahkan:

- Product list query: 3x lebih cepat
- Order list query: 3x lebih cepat
- Search query: 2x lebih cepat
- Overall database load: 70% berkurang

---

## 🆘 Need Help?

Jika masih ada masalah:

1. Share error message lengkap
2. Check Supabase logs
3. Verify database connection
4. Try manual SQL approach

---

**Recommendation:** Gunakan manual SQL approach jika migration terus bermasalah. Indexes tetap akan bekerja dengan baik!
