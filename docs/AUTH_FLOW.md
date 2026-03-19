# Authentication Flow Documentation

## Overview

Sistem autentikasi telah dikonfigurasi dengan flow sebagai berikut:

### Login Flow

1. **User mengakses halaman login** (`/login`)
   - Jika sudah login, redirect ke home (`/`)
   - Jika belum login, tampilkan form login

2. **Setelah login berhasil**
   - Redirect ke `returnUrl` (jika ada) atau home (`/`)
   - Tidak lagi redirect ke dashboard secara default

3. **Return URL**
   - Jika user mencoba akses halaman yang memerlukan auth, sistem akan redirect ke login dengan `returnUrl` parameter
   - Setelah login, user akan kembali ke halaman yang dituju

### Dashboard Access

Dashboard **hanya untuk ADMIN**:

- URL: `/dashboard/*`
- User biasa tidak bisa akses dashboard
- Jika user biasa mencoba akses dashboard, akan di-redirect ke home (`/`)

### Middleware Protection

File: `middleware.ts`

```typescript
// Dashboard routes - only admin can access
if (pathname.startsWith('/dashboard')) {
  if (!session) {
    // Not logged in - redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Logged in but not admin - redirect to home
  if (session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url))
  }
}
```

## User Roles

### ADMIN
- Dapat akses semua fitur
- Dapat akses dashboard (`/dashboard`)
- Dapat manage:
  - Analytics
  - Users
  - Categories
  - Products
  - Orders
  - Questions

### USER
- Dapat akses fitur publik:
  - Browse products
  - View product details
  - Add to cart
  - Checkout
  - View orders
  - Profile management
- **TIDAK** dapat akses dashboard

## Protected Routes

### Admin Only Routes
- `/dashboard` - Dashboard home
- `/dashboard/analytics` - Analytics dashboard
- `/dashboard/users` - User management
- `/dashboard/categories` - Category management
- `/dashboard/products` - Product management
- `/dashboard/orders` - Order management
- `/dashboard/questions` - Product questions management
- `/dashboard/profile` - Admin profile

### Public Routes (No Auth Required)
- `/` - Home page
- `/products` - Product listing
- `/products/[id]` - Product detail
- `/login` - Login page
- `/register` - Register page

### Authenticated Routes (Both Admin & User)
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/orders` - User orders (if implemented)
- `/profile` - User profile (if implemented)

## Navigation

### Admin Navigation
Admin dapat akses dashboard melalui:
1. User menu dropdown (navbar) - "Dashboard" link
2. Profile page - "Go to Dashboard" button
3. Direct URL: `/dashboard`

### User Navigation
User biasa tidak melihat link ke dashboard di UI.

## Implementation Files

### Core Files
- `middleware.ts` - Route protection
- `app/actions/auth-actions.ts` - Login/register actions
- `lib/session.ts` - Session management

### Auth Pages
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Register page

### Dashboard Pages
All pages in `app/dashboard/*` are protected and admin-only.

## Testing

### Test Admin Access
1. Login sebagai admin
2. Akses `/dashboard` - should work
3. Logout

### Test User Access
1. Login sebagai user biasa
2. Akses `/dashboard` - should redirect to `/`
3. Verify no dashboard links in UI

### Test Return URL
1. Logout
2. Akses `/dashboard/products` (or any protected route)
3. Should redirect to `/login?returnUrl=/dashboard/products`
4. Login sebagai admin
5. Should redirect back to `/dashboard/products`

## Security Notes

1. **Middleware Protection**: All dashboard routes are protected at middleware level
2. **Page-level Protection**: Each dashboard page also checks session and role
3. **Double Protection**: Both middleware and page-level checks ensure security
4. **No Client-side Only Protection**: Never rely only on hiding UI elements

## Future Enhancements

- [ ] Add user-specific dashboard for order history
- [ ] Add role-based permissions (e.g., MANAGER, STAFF)
- [ ] Add audit logging for admin actions
- [ ] Add session timeout handling
- [ ] Add remember me functionality
