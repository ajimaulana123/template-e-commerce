-- ============================================
-- RESET SUPABASE DATABASE
-- ============================================
-- WARNING: This will DELETE ALL DATA!
-- Use with caution, preferably in development only
-- ============================================

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS "OrderItem" CASCADE;
DROP TABLE IF EXISTS "Order" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Question" CASCADE;
DROP TABLE IF EXISTS "Wishlist" CASCADE;
DROP TABLE IF EXISTS "CartItem" CASCADE;
DROP TABLE IF EXISTS "Cart" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop custom types if any
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;

-- Verify all tables are dropped
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- ============================================
-- After running this, you need to:
-- 1. Run: npx prisma db push
-- 2. Run: npx prisma db seed
-- ============================================
