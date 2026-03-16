# Setup Supabase Storage untuk Product Images

## Langkah-langkah Setup

### 1. Buat Storage Bucket

1. Buka Supabase Dashboard
2. Pergi ke **Storage** di sidebar
3. Klik **New bucket**
4. Isi detail bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Centang (agar gambar bisa diakses publik)
5. Klik **Create bucket**

### 2. Setup RLS Policies (Optional)

Jika ingin mengatur akses lebih ketat:

1. Klik bucket `product-images`
2. Pergi ke tab **Policies**
3. Tambahkan policy berikut:

**Policy untuk Upload (Admin Only):**
```sql
CREATE POLICY "Admin can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.jwt() ->> 'role' = 'ADMIN'
);
```

**Policy untuk Public Read:**
```sql
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

**Policy untuk Delete (Admin Only):**
```sql
CREATE POLICY "Admin can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images'
  AND auth.jwt() ->> 'role' = 'ADMIN'
);
```

### 3. Verifikasi Setup

1. Coba upload gambar dari dashboard admin
2. Pastikan gambar muncul di preview
3. Cek di Supabase Storage apakah file ter-upload

## Catatan

- Bucket `product-images` harus **public** agar gambar bisa ditampilkan di website
- File akan disimpan dengan format: `products/{timestamp}-{random}.{ext}`
- Maksimal ukuran file: 5MB (bisa diatur di form)
- Format yang didukung: PNG, JPG, JPEG, WEBP, GIF

## Troubleshooting

**Error: "Failed to upload image"**
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` sudah diset di `.env`
- Pastikan bucket `product-images` sudah dibuat
- Cek RLS policies tidak memblokir upload

**Gambar tidak muncul:**
- Pastikan bucket di-set sebagai **Public**
- Cek URL gambar di browser apakah bisa diakses
- Verifikasi RLS policy untuk SELECT
