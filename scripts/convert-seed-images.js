const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');
let content = fs.readFileSync(seedPath, 'utf8');

// Replace all single image fields with images array
content = content.replace(
  /image: '(https:\/\/[^']+)'/g,
  (match, url) => {
    return `images: [\n          '${url}',\n          '${url}',\n          '${url}',\n          '${url}'\n        ]`;
  }
);

fs.writeFileSync(seedPath, content, 'utf8');
console.log('✅ Converted all image fields to images arrays');
