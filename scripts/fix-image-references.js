const fs = require('fs');
const path = require('path');

const filesToFix = [
  'components/SearchDropdown.tsx',
  'components/ProductGrid.tsx',
  'components/HeroSlider.tsx',
  'app/wishlist/WishlistPageClient.tsx',
  'app/dashboard/questions/QuestionsPageClient.tsx',
  'app/dashboard/products/ProductList.tsx',
  'app/dashboard/products/ProductDetailModal.tsx',
  'app/checkout/CheckoutPageClient.tsx',
  'app/cart/CartPageClient.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace product.image with product.images[0]
  const updated = content.replace(/product\.image(?!s)/g, 'product.images[0]');
  
  // Replace item.product.image with item.product.images[0]
  const updated2 = updated.replace(/item\.product\.image(?!s)/g, 'item.product.images[0]');
  
  // Replace q.product.image with q.product.images[0]
  const updated3 = updated2.replace(/q\.product\.image(?!s)/g, 'q.product.images[0]');
  
  if (updated3 !== content) {
    fs.writeFileSync(filePath, updated3, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`ℹ️  No changes needed: ${file}`);
  }
});

console.log('\n✅ All files processed!');
