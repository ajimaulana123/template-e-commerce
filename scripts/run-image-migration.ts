import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting image migration...');

  try {
    // Step 1: Add images column
    console.log('Step 1: Adding images column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "images" TEXT[];
    `);

    // Step 2: Copy existing image data to images array
    console.log('Step 2: Copying existing image data...');
    await prisma.$executeRawUnsafe(`
      UPDATE "products" 
      SET "images" = ARRAY["image"]::TEXT[] 
      WHERE "image" IS NOT NULL AND "images" IS NULL;
    `);

    // Step 3: Set default for NULL images
    console.log('Step 3: Setting defaults...');
    await prisma.$executeRawUnsafe(`
      UPDATE "products" 
      SET "images" = ARRAY[]::TEXT[] 
      WHERE "images" IS NULL;
    `);

    // Step 4: Make images column NOT NULL
    console.log('Step 4: Making images NOT NULL...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products" ALTER COLUMN "images" SET NOT NULL;
    `);

    // Step 5: Drop old image column
    console.log('Step 5: Dropping old image column...');
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "products" DROP COLUMN IF EXISTS "image";
    `);

    // Verify
    console.log('\n✅ Migration completed successfully!');
    console.log('\nVerifying data:');
    
    const products = await prisma.$queryRawUnsafe(`
      SELECT id, name, array_length(images, 1) as image_count 
      FROM "products" 
      LIMIT 5;
    `);
    
    console.table(products);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
