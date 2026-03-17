# Order Management System

Sistem manajemen order lengkap untuk e-commerce platform.

## Fitur Utama

### 1. Checkout Process
- Form pengiriman lengkap (nama, telepon, alamat, kota, kode pos, provinsi)
- Pilihan metode pembayaran (COD / Bank Transfer)
- Kalkulasi otomatis subtotal, ongkir, dan total
- Validasi stok produk sebelum order dibuat
- Integrasi dengan cart system

### 2. Order Creation
- Generate order number unik
- Simpan detail pengiriman
- Buat order items dari cart
- Update stok produk otomatis
- Update jumlah terjual (sold count)
- Clear cart setelah order berhasil
- Transaction-based untuk data consistency

### 3. Order Confirmation
- Halaman konfirmasi order dengan detail lengkap
- Tampilkan order number
- Status order dan payment
- Detail pengiriman
- List items yang dipesan
- Summary harga

### 4. Order History (Customer)
- List semua order user
- Filter berdasarkan status (All, Pending, Processing, Shipped, Delivered, Cancelled)
- View order details
- Cancel order (hanya untuk status PENDING)
- Restore stok otomatis saat cancel

### 5. Order Management (Admin)
- Dashboard admin untuk manage semua orders
- Filter orders by status
- View order details
- Update order status
- Track payment status
- View customer information

## Database Schema

### Order Model
```prisma
model Order {
  id            String        @id @default(uuid())
  userId        String
  orderNumber   String        @unique
  status        OrderStatus   @default(PENDING)
  paymentMethod PaymentMethod
  paymentStatus PaymentStatus @default(PENDING)
  subtotal      Int
  shippingCost  Int
  total         Int
  
  // Shipping Address
  fullName      String
  phone         String
  address       String
  city          String
  postalCode    String?
  province      String?
  
  notes         String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  user          User          @relation(...)
  items         OrderItem[]
}
```

### OrderItem Model
```prisma
model OrderItem {
  id            String   @id @default(uuid())
  orderId       String
  productId     String
  productName   String
  productImage  String
  price         Int
  quantity      Int
  subtotal      Int
  createdAt     DateTime @default(now())
  
  order         Order    @relation(...)
  product       Product  @relation(...)
}
```

### Enums
```prisma
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentMethod {
  COD
  BANK_TRANSFER
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
}
```

## API Endpoints

### Customer Endpoints

#### GET /api/orders
Fetch semua orders user yang sedang login.

Response:
```json
[
  {
    "id": "uuid",
    "orderNumber": "ORD-1234567890-ABC123",
    "status": "PENDING",
    "paymentMethod": "COD",
    "paymentStatus": "PENDING",
    "total": 150000,
    "createdAt": "2024-01-01T00:00:00Z",
    "items": [...]
  }
]
```

#### POST /api/orders
Create order baru dari cart.

Request:
```json
{
  "cartItems": [...],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "08123456789",
    "address": "Jl. Example No. 123",
    "city": "Jakarta",
    "postalCode": "12345",
    "province": "DKI Jakarta"
  },
  "paymentMethod": "cod",
  "subtotal": 135000,
  "shippingCost": 15000,
  "total": 150000,
  "notes": "Optional notes"
}
```

Response:
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-1234567890-ABC123"
  }
}
```

#### GET /api/orders/[id]
Get detail order by ID.

Response:
```json
{
  "id": "uuid",
  "orderNumber": "ORD-1234567890-ABC123",
  "status": "PENDING",
  "paymentMethod": "COD",
  "paymentStatus": "PENDING",
  "subtotal": 135000,
  "shippingCost": 15000,
  "total": 150000,
  "fullName": "John Doe",
  "phone": "08123456789",
  "address": "Jl. Example No. 123",
  "city": "Jakarta",
  "postalCode": "12345",
  "province": "DKI Jakarta",
  "createdAt": "2024-01-01T00:00:00Z",
  "items": [
    {
      "id": "uuid",
      "productName": "Product Name",
      "productImage": "url",
      "price": 45000,
      "quantity": 3,
      "subtotal": 135000
    }
  ]
}
```

#### DELETE /api/orders/[id]
Cancel order (hanya untuk status PENDING).

Response:
```json
{
  "success": true
}
```

### Admin Endpoints

#### GET /api/orders/admin
Fetch semua orders (admin only).

Query params:
- `status` (optional): Filter by status

Response: Array of orders dengan user info

#### PUT /api/orders/[id]
Update order status (admin only).

Request:
```json
{
  "status": "PROCESSING",
  "paymentStatus": "PAID"
}
```

## Pages

### Customer Pages

1. `/checkout` - Checkout page dengan form pengiriman
2. `/orders` - Order history page
3. `/orders/[id]/confirmation` - Order confirmation page

### Admin Pages

1. `/dashboard/orders` - Admin order management dashboard

## Features

### Checkout Flow
1. User mengisi form pengiriman
2. Pilih metode pembayaran
3. Review order summary
4. Submit order
5. Redirect ke confirmation page

### Order Processing
1. Validate cart items
2. Check stock availability
3. Create order dengan transaction
4. Create order items
5. Update product stock & sold count
6. Clear user cart
7. Return order details

### Cancel Order
1. Check order status (hanya PENDING yang bisa cancel)
2. Restore product stock
3. Update sold count
4. Update order status ke CANCELLED

### Admin Order Management
1. View all orders
2. Filter by status
3. View order details
4. Update order status
5. Track payment status

## Security

- Authentication required untuk semua endpoints
- User hanya bisa akses order miliknya sendiri
- Admin bisa akses semua orders
- Stock validation sebelum create order
- Transaction-based untuk data consistency
- Secure logging untuk order activities

## Error Handling

- Cart empty validation
- Shipping address validation
- Stock availability check
- Order ownership verification
- Status validation untuk cancel

## Next Steps

1. Email notification setelah order dibuat
2. Order tracking dengan nomor resi
3. Invoice generation & download
4. Payment gateway integration
5. Shipping cost calculation API
6. Order rating & review system
7. Reorder functionality
8. Order export untuk admin
