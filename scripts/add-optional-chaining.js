const fs = require('fs');
const path = require('path');

const filesToFix = [
  'components/SearchDropdown.tsx',
  'components/HeroSlider.tsx',
  'app/wishlist/WishlistPageClient.tsx',
  'app/dashboard/questions/QuestionsPageClient.tsx',
  'app/dashboard/products/ProductList.tsx',
  'app/dashboard/products/ProductDetailModal.tsx',
  'app/checkout/CheckoutPageClient.tsx',
  'app/cart/CartPageClient.tsx',
  'app/products/components/ProductCard.tsx',
  'app/products/[id]/ProductDetailClient.tsx',
  'app/HomePageClient.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace product.images[0] with product.images?.[0] || '/placeholder.png'
  let updated = content.replace(/product\.images\[0\](?!\s*\|\|)/g, "product.images?.[0] || '/placeholder.png'");
  
  // Replace item.product.images[0] with item.product.images?.[0] || '/placeholder.png'
  updated = updated.replace(/item\.product\.images\[0\](?!\s*\|\|)/g, "item.product.images?.[0] || '/placeholder.png'");
  
  // Replace q.product.images[0] with q.product.images?.[0] || '/placeholder.png'
  updated = updated.replace(/q\.product\.images\[0\](?!\s*\|\|)/g, "q.product.images?.[0] || '/placeholder.png'");
  
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`ℹ️  No changes needed: ${file}`);
  }
});

console.log('\n✅ All files processed with optional chaining!');
