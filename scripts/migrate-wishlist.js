const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function runMigration() {
  try {
    console.log('🚀 Running wishlist migration...')
    
    // Read SQL file
    const sqlPath = path.join(process.cwd(), 'migrate-wishlist.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...')
        await prisma.$executeRawUnsafe(statement.trim())
      }
    }
    
    console.log('✅ Wishlist migration completed successfully!')
    
    // Test the migration
    console.log('🧪 Testing migration...')
    const result = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_name = 'wishlist_items'`
    
    if (result.length > 0) {
      console.log('✅ wishlist_items table created successfully!')
    } else {
      console.log('❌ wishlist_items table not found!')
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

runMigration()