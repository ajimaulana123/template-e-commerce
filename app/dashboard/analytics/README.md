# Dashboard Analitik

Dashboard analitik untuk admin yang menampilkan statistik dan metrik bisnis secara real-time.

## Fitur

### 1. Overview Cards
- **Total Pendapatan**: Menampilkan total pendapatan dan pertumbuhan bulanan
- **Total Pesanan**: Jumlah pesanan dengan perbandingan bulan sebelumnya
- **Total Produk**: Jumlah produk dengan alert stok rendah
- **Total Pengguna**: Jumlah pengguna dengan registrasi bulanan

### 2. Visualisasi Data

#### Status Pesanan
Menampilkan distribusi pesanan berdasarkan status:
- PENDING
- PROCESSING
- SHIPPED
- DELIVERED
- COMPLETED
- CANCELLED

#### Produk Terlaris
Top 5 produk dengan penjualan tertinggi, menampilkan:
- Gambar produk
- Nama produk
- Jumlah terjual
- Harga

#### Pendapatan per Kategori
Bar chart menampilkan pendapatan dari setiap kategori produk.

#### Pesanan Terbaru
Tabel 10 pesanan terbaru dengan informasi:
- Nomor pesanan
- Email pelanggan
- Total pembayaran
- Status
- Tanggal pemesanan

### 3. Fitur Export
- Export data produk terlaris ke CSV
- Export data pesanan terbaru ke CSV
- Format file: `[nama]_YYYY-MM-DD.csv`

### 4. Refresh Data
Tombol refresh untuk memuat ulang data analytics secara manual.

## Akses

Hanya admin yang dapat mengakses halaman ini. User biasa akan di-redirect ke dashboard utama.

**URL**: `/dashboard/analytics`

## API Endpoint

### GET `/api/analytics`

Mengambil semua data analytics.

**Response**:
```json
{
  "overview": {
    "totalRevenue": number,
    "monthlyRevenue": number,
    "revenueGrowth": number,
    "totalOrders": number,
    "monthlyOrders": number,
    "ordersGrowth": number,
    "totalProducts": number,
    "lowStockProducts": number,
    "totalUsers": number,
    "monthlyUsers": number
  },
  "ordersByStatus": [
    { "status": string, "count": number }
  ],
  "topProducts": [
    {
      "id": string,
      "name": string,
      "sold": number,
      "price": number,
      "images": string[]
    }
  ],
  "categoryRevenue": [
    { "name": string, "revenue": number }
  ],
  "recentOrders": [
    {
      "id": string,
      "orderNumber": string,
      "total": number,
      "status": string,
      "createdAt": string,
      "user": { "email": string }
    }
  ]
}
```

## Perhitungan Metrik

### Revenue Growth
```
((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
```

### Orders Growth
```
((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100
```

### Low Stock Alert
Produk dengan stok ≤ 10 unit akan ditandai sebagai stok rendah.

## Teknologi

- **Frontend**: React, Next.js 14, TypeScript
- **UI Components**: Shadcn/ui, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM
- **Export**: CSV format dengan encoding UTF-8

## File Structure

```
app/dashboard/analytics/
├── page.tsx                    # Server component (auth check)
├── AnalyticsPageClient.tsx     # Client component (main UI)
├── utils.ts                    # Utility functions (export, format)
└── README.md                   # Documentation

app/api/analytics/
└── route.ts                    # API endpoint
```

## Future Enhancements

- [ ] Filter berdasarkan periode waktu (7 hari, 30 hari, custom)
- [ ] Grafik line chart untuk trend pendapatan
- [ ] Perbandingan year-over-year
- [ ] Export PDF report
- [ ] Real-time updates dengan WebSocket
- [ ] Dashboard customization
- [ ] Email report scheduling
