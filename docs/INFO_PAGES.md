# Halaman Informasi - Halal Mart Tokyo

Dokumentasi untuk halaman-halaman informasi yang dapat diakses dari ScrollBanner.

## Halaman yang Tersedia

### 1. Halal Certificate (`/halal-certificate`)

**Tujuan**: Memberikan informasi tentang sertifikasi halal produk

**Konten**:
- Lembaga Sertifikasi:
  - MUI (Majelis Ulama Indonesia)
  - JAKIM (Jabatan Kemajuan Islam Malaysia)
  - JMHC (Japan Muslim Halal Certification)
  - IFANCA (Islamic Food and Nutrition Council of America)

- Komitmen Halal Mart:
  - 100% Produk Halal
  - Verifikasi Berkala
  - Transparansi Penuh
  - Rantai Pasok Halal

- Cara Verifikasi:
  1. Cek logo halal pada kemasan
  2. Scan QR code untuk detail sertifikat
  3. Tanya staf untuk informasi lebih lanjut

- Kontak:
  - Email: halal@halalmart-tokyo.jp
  - Phone: +81-3-1234-5678

**File**: `app/halal-certificate/page.tsx`

---

### 2. Delivery Info (`/delivery-info`)

**Tujuan**: Memberikan informasi lengkap tentang pengiriman

**Konten**:

#### Area Pengiriman

1. **Same Day Delivery** (¥500)
   - Pesan sebelum 14:00
   - Area: Shinjuku, Shibuya, Minato, Chiyoda, Chuo, Meguro, Setagaya, Nakano, Suginami

2. **Next Day Delivery** (¥300)
   - Seluruh Tokyo 23 Ward
   - Kawasaki, Yokohama
   - Saitama, Chiba (area tertentu)

3. **Standard Delivery** (¥800-¥1,500)
   - 2-3 hari
   - Seluruh Jepang

#### Gratis Ongkir
- ¥5,000+ → Gratis Same Day
- ¥3,000+ → Gratis Next Day

#### Slot Waktu Pengiriman
- 08:00 - 12:00 (Pagi)
- 12:00 - 14:00 (Siang)
- 14:00 - 16:00 (Sore)
- 16:00 - 18:00 (Sore Akhir)
- 18:00 - 20:00 (Malam)
- 20:00 - 21:00 (Malam Akhir)

#### Metode Pembayaran
- Credit/Debit Card (Visa, Mastercard, JCB, AMEX)
- Cash on Delivery (+¥300)
- Bank Transfer
- E-Money (PayPay, Line Pay, Rakuten Pay)

#### Catatan Penting
- Produk frozen/chilled: +¥200
- Tidak tersedia saat libur nasional
- Estimasi waktu dapat berbeda untuk area luar Tokyo

**File**: `app/delivery-info/page.tsx`

---

### 3. Store Location (`/store-location`)

**Tujuan**: Memberikan informasi lokasi toko fisik

**Konten**:

#### Alamat
```
〒160-0022
Tokyo, Shinjuku City, Shinjuku 3-chōme-1-26
Shinjuku Maynds Tower, 1st Floor
```

#### Jam Operasional
- Senin - Minggu: 10:00 - 22:00
- Buka setiap hari termasuk hari libur

#### Akses Transportasi
- JR Shinjuku Station - 5 menit jalan kaki
- Tokyo Metro Marunouchi Line - 3 menit jalan kaki
- Toei Shinjuku Line - 7 menit jalan kaki

#### Kontak
- Tel: +81-3-1234-5678
- WhatsApp: +81-90-1234-5678
- Email: info@halalmart-tokyo.jp

#### Fasilitas
- Parkir tersedia (berbayar)
- Musholla di lantai 2
- Staf berbahasa Indonesia, Inggris, Jepang
- Pembayaran: Cash, Credit Card, E-Money (Suica, Pasmo)

#### Peta
- Koordinat: 35.6895° N, 139.7006° E
- Google Maps integration (placeholder)

**File**: `app/store-location/page.tsx`

---

### 4. Track Order (`/orders`)

**Tujuan**: Tracking pesanan pelanggan

**Status**: Halaman ini sudah ada di sistem (untuk user yang login)

**Fitur**:
- Lihat status pesanan
- Tracking number
- Estimasi pengiriman
- Riwayat pesanan

**File**: Existing order tracking system

---

## Link di ScrollBanner

ScrollBanner menampilkan link berbeda tergantung ukuran layar:

### Desktop (2xl+)
- Lokasi Toko
- Halal Certificate
- Delivery Info
- Track Order

### Large Desktop (xl-2xl)
- Halal Certificate
- Delivery
- Track Order

### Medium Desktop (lg-xl)
- Certificate
- Delivery
- Tracking

### Tablet (md-lg)
- Halal
- Tracking

### Mobile (sm-md)
- Halal
- Tracking

### Extra Small Mobile (<sm)
- Tracking

---

## Styling & Design

Semua halaman menggunakan:
- Tailwind CSS untuk styling
- Shadcn/ui components (Card, CardHeader, CardTitle, CardContent)
- Lucide icons untuk visual elements
- Responsive design untuk semua ukuran layar
- Green color scheme (green-600) untuk konsistensi brand Halal Mart

---

## Future Enhancements

- [ ] Integrasi Google Maps di Store Location
- [ ] QR Code generator untuk sertifikat halal
- [ ] Real-time delivery tracking
- [ ] Multi-language support (Indonesia, English, Japanese, Arabic)
- [ ] FAQ section untuk setiap halaman
- [ ] Downloadable PDF untuk sertifikat halal
- [ ] Store photos gallery
- [ ] Customer testimonials
- [ ] Live chat support

---

## SEO Considerations

Setiap halaman sebaiknya memiliki:
- Meta title yang descriptive
- Meta description yang menarik
- Open Graph tags untuk social sharing
- Structured data (JSON-LD) untuk rich snippets
- Alt text untuk semua images
- Proper heading hierarchy (h1, h2, h3)

---

## Maintenance

Update informasi secara berkala:
- Jam operasional (jika ada perubahan)
- Area pengiriman (ekspansi area)
- Biaya pengiriman (penyesuaian harga)
- Sertifikat halal (renewal)
- Kontak informasi (jika berubah)
