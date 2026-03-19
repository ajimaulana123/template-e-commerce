import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Fixing products with null/empty images...');

  // Get products with null or empty images
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { images: { equals: [] } },
        { images: null as any }
      ]
    }
  });

  console.log(`Found ${products.length} products with missing images`);

  if (products.length === 0) {
    console.log('✅ All products have images!');
    return;
  }

  // Update each product with a placeholder image
  for (const product of products) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500']
      }
    });
    console.log(`✅ Fixed: ${product.name}`);
  }

  console.log('\n✅ All products now have images!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
