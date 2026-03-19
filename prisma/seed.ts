import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.productQuestion.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Cleared existing data');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      profile: {
        create: {
          fotoProfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        },
      },
    },
  });

  // Create regular user
  const regularUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
      profile: {
        create: {
          fotoProfil: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
        },
      },
    },
  });

  console.log('✅ Created users');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Elektronik',
        slug: 'elektronik',
        icon: 'Laptop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Fashion',
        slug: 'fashion',
        icon: 'Shirt',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Makanan & Minuman',
        slug: 'makanan-minuman',
        icon: 'Coffee',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Olahraga',
        slug: 'olahraga',
        icon: 'Dumbbell',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kecantikan',
        slug: 'kecantikan',
        icon: 'Sparkles',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Rumah Tangga',
        slug: 'rumah-tangga',
        icon: 'Home',
      },
    }),
  ]);

  console.log('✅ Created categories');

  // Helper function to create date in the past
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
  };

  // Helper function to generate multiple product images
  const generateProductImages = (mainImage: string): string[] => {
    // For demo, we'll use variations of similar images
    // In production, these would be actual different product photos
    return [
      mainImage,
      mainImage.replace('?w=500', '?w=500&sat=-100'), // B&W version
      mainImage.replace('?w=500', '?w=500&blur=2'),   // Slightly blurred
      mainImage.replace('?w=500', '?w=500&flip=h')    // Flipped
    ]
  }

  // Create products with various characteristics
  const products = await Promise.all([
    // ELEKTRONIK - Flash Sale & Popular
    prisma.product.create({
      data: {
        name: 'Laptop Gaming ROG Strix G15',
        description: 'Laptop gaming powerful dengan RTX 4060, Ryzen 9, RAM 16GB, SSD 512GB. Perfect untuk gaming dan content creation.',
        price: 15999000,
        originalPrice: 19999000,
        images: [
          'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
          'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
          'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
        ],
        categoryId: categories[0].id,
        stock: 15,
        sold: 234,
        rating: 4.8,
        totalReviews: 156,
        badge: 'Flash Sale',
        createdAt: daysAgo(45),
      },
    }),
    prisma.product.create({
      data: {
        name: 'iPhone 15 Pro Max 256GB',
        description: 'iPhone terbaru dengan chip A17 Pro, kamera 48MP, layar Super Retina XDR 6.7 inch.',
        price: 18999000,
        originalPrice: 21999000,
        images: [
          'https://images.unsplash.com/photo-1592286927505-4d13c8e1e0e0?w=500',
          'https://images.unsplash.com/photo-1592286927505-4d13c8e1e0e0?w=500',
          'https://images.unsplash.com/photo-1592286927505-4d13c8e1e0e0?w=500',
          'https://images.unsplash.com/photo-1592286927505-4d13c8e1e0e0?w=500'
        ],
        categoryId: categories[0].id,
        stock: 8,
        sold: 189,
        rating: 4.9,
        totalReviews: 142,
        badge: 'Flash Sale',
        createdAt: daysAgo(30),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Flagship Samsung dengan S Pen, kamera 200MP, Snapdragon 8 Gen 3, RAM 12GB.',
        price: 16499000,
        originalPrice: 18999000,
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'
        ],
        categoryId: categories[0].id,
        stock: 12,
        sold: 167,
        rating: 4.7,
        totalReviews: 98,
        badge: 'Best Seller',
        createdAt: daysAgo(25),
      },
    }),
    prisma.product.create({
      data: {
        name: 'MacBook Air M3 13 inch',
        description: 'MacBook Air terbaru dengan chip M3, layar Liquid Retina, battery life hingga 18 jam.',
        price: 17999000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
        ],
        categoryId: categories[0].id,
        stock: 20,
        sold: 145,
        rating: 4.9,
        totalReviews: 87,
        badge: 'New',
        createdAt: daysAgo(5),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Headphone noise cancelling terbaik dengan audio quality premium dan battery 30 jam.',
        price: 4299000,
        originalPrice: 5499000,
        images: [
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
          'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500'
        ],
        categoryId: categories[0].id,
        stock: 35,
        sold: 312,
        rating: 4.8,
        totalReviews: 234,
        badge: 'Flash Sale',
        createdAt: daysAgo(60),
      },
    }),

    // FASHION - Popular & New
    prisma.product.create({
      data: {
        name: 'Kemeja Flanel Premium Pria',
        description: 'Kemeja flanel berkualitas tinggi, nyaman dipakai, cocok untuk casual dan semi formal.',
        price: 189000,
        originalPrice: 299000,
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'
        ],
        categoryId: categories[1].id,
        stock: 50,
        sold: 456,
        rating: 4.6,
        totalReviews: 289,
        badge: 'Best Seller',
        createdAt: daysAgo(40),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dress Wanita Elegant Korean Style',
        description: 'Dress cantik dengan desain Korea, bahan premium, cocok untuk berbagai acara.',
        price: 249000,
        originalPrice: 399000,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
        ],
        categoryId: categories[1].id,
        stock: 40,
        sold: 389,
        rating: 4.7,
        totalReviews: 267,
        badge: 'Flash Sale',
        createdAt: daysAgo(35),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sepatu Sneakers Putih Unisex',
        description: 'Sneakers putih minimalis, nyaman untuk daily use, bahan berkualitas.',
        price: 299000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
        ],
        categoryId: categories[1].id,
        stock: 60,
        sold: 523,
        rating: 4.5,
        totalReviews: 412,
        badge: 'Best Seller',
        createdAt: daysAgo(50),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Tas Ransel Laptop Anti Air',
        description: 'Ransel multifungsi dengan kompartemen laptop 15 inch, anti air, banyak kantong.',
        price: 349000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
        ],
        categoryId: categories[1].id,
        stock: 45,
        sold: 278,
        rating: 4.6,
        totalReviews: 189,
        badge: 'New',
        createdAt: daysAgo(3),
      },
    }),

    // MAKANAN & MINUMAN - Flash Sale
    prisma.product.create({
      data: {
        name: 'Kopi Arabica Premium 500gr',
        description: 'Kopi arabica pilihan dari dataran tinggi, roasted fresh, aroma dan rasa premium.',
        price: 89000,
        originalPrice: 129000,
        images: [
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
        ],
        categoryId: categories[2].id,
        stock: 100,
        sold: 678,
        rating: 4.8,
        totalReviews: 456,
        badge: 'Flash Sale',
        createdAt: daysAgo(55),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Cokelat Premium Belgium 250gr',
        description: 'Cokelat import Belgium dengan cocoa content tinggi, rasa lembut dan premium.',
        price: 125000,
        originalPrice: 175000,
        images: [
          'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
          'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
          'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500',
          'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500'
        ],
        categoryId: categories[2].id,
        stock: 80,
        sold: 445,
        rating: 4.7,
        totalReviews: 312,
        badge: 'Flash Sale',
        createdAt: daysAgo(42),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Madu Hutan Asli 500ml',
        description: 'Madu murni dari hutan Indonesia, kaya manfaat, tanpa campuran.',
        price: 149000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=500',
          'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=500',
          'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=500',
          'https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=500'
        ],
        categoryId: categories[2].id,
        stock: 65,
        sold: 234,
        rating: 4.9,
        totalReviews: 178,
        badge: 'Best Seller',
        createdAt: daysAgo(28),
      },
    }),

    // OLAHRAGA - New & Popular
    prisma.product.create({
      data: {
        name: 'Matras Yoga Premium NBR 10mm',
        description: 'Matras yoga tebal 10mm, anti slip, nyaman, dengan tas carrying.',
        price: 179000,
        originalPrice: 249000,
        images: [
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
          'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
        ],
        categoryId: categories[3].id,
        stock: 55,
        sold: 345,
        rating: 4.6,
        totalReviews: 234,
        badge: 'Flash Sale',
        createdAt: daysAgo(38),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Dumbbell Set 20kg Adjustable',
        description: 'Set dumbbell adjustable 2.5kg - 20kg, hemat tempat, cocok untuk home gym.',
        price: 899000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500',
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
        ],
        categoryId: categories[3].id,
        stock: 30,
        sold: 189,
        rating: 4.7,
        totalReviews: 145,
        badge: 'New',
        createdAt: daysAgo(7),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sepatu Lari Nike Air Zoom',
        description: 'Sepatu lari dengan teknologi Air Zoom, ringan, responsif, cocok untuk marathon.',
        price: 1299000,
        originalPrice: 1599000,
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
        ],
        categoryId: categories[3].id,
        stock: 40,
        sold: 267,
        rating: 4.8,
        totalReviews: 198,
        badge: 'Best Seller',
        createdAt: daysAgo(33),
      },
    }),

    // KECANTIKAN - Flash Sale & New
    prisma.product.create({
      data: {
        name: 'Serum Vitamin C Korea 30ml',
        description: 'Serum brightening dengan vitamin C murni, mencerahkan dan meratakan warna kulit.',
        price: 149000,
        originalPrice: 249000,
        images: [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'
        ],
        categoryId: categories[4].id,
        stock: 120,
        sold: 789,
        rating: 4.9,
        totalReviews: 567,
        badge: 'Flash Sale',
        createdAt: daysAgo(48),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sunscreen SPF 50 PA++++',
        description: 'Sunscreen ringan, tidak lengket, melindungi dari UVA/UVB, cocok untuk daily use.',
        price: 89000,
        originalPrice: 129000,
        images: [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
        ],
        categoryId: categories[4].id,
        stock: 150,
        sold: 892,
        rating: 4.8,
        totalReviews: 678,
        badge: 'Best Seller',
        createdAt: daysAgo(52),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lipstick Matte Long Lasting',
        description: 'Lipstick matte dengan formula tahan lama, tidak kering, banyak pilihan warna.',
        price: 79000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
          'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'
        ],
        categoryId: categories[4].id,
        stock: 200,
        sold: 1234,
        rating: 4.7,
        totalReviews: 890,
        badge: 'Best Seller',
        createdAt: daysAgo(65),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Masker Wajah Sheet Korea 10pcs',
        description: 'Sheet mask dengan berbagai essence, melembabkan dan menutrisi kulit.',
        price: 99000,
        originalPrice: 149000,
        images: [
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500',
          'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500'
        ],
        categoryId: categories[4].id,
        stock: 180,
        sold: 567,
        rating: 4.6,
        totalReviews: 423,
        badge: 'Flash Sale',
        createdAt: daysAgo(20),
      },
    }),

    // RUMAH TANGGA - New & Popular
    prisma.product.create({
      data: {
        name: 'Vacuum Cleaner Wireless 2in1',
        description: 'Vacuum cleaner tanpa kabel, bisa untuk lantai dan handheld, suction power kuat.',
        price: 1499000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
          'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
          'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500',
          'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'
        ],
        categoryId: categories[5].id,
        stock: 25,
        sold: 156,
        rating: 4.7,
        totalReviews: 112,
        badge: 'New',
        createdAt: daysAgo(2),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Air Fryer Digital 5L',
        description: 'Air fryer dengan kapasitas 5L, digital control, masak tanpa minyak lebih sehat.',
        price: 899000,
        originalPrice: 1299000,
        images: [
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'
        ],
        categoryId: categories[5].id,
        stock: 35,
        sold: 423,
        rating: 4.8,
        totalReviews: 334,
        badge: 'Flash Sale',
        createdAt: daysAgo(44),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Blender Multifungsi 1.5L',
        description: 'Blender dengan berbagai fungsi, motor kuat, pisau stainless steel.',
        price: 449000,
        originalPrice: null,
        images: [
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500',
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500',
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500',
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500'
        ],
        categoryId: categories[5].id,
        stock: 50,
        sold: 378,
        rating: 4.5,
        totalReviews: 267,
        badge: 'Best Seller',
        createdAt: daysAgo(36),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Set Panci Stainless Steel 7pcs',
        description: 'Set panci lengkap 7 pieces, stainless steel premium, tahan lama.',
        price: 799000,
        originalPrice: 1099000,
        images: [
          'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f6?w=500',
          'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f6?w=500',
          'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f6?w=500',
          'https://images.unsplash.com/photo-1584990347449-39b4aa02d0f6?w=500'
        ],
        categoryId: categories[5].id,
        stock: 40,
        sold: 234,
        rating: 4.6,
        totalReviews: 178,
        badge: 'Flash Sale',
        createdAt: daysAgo(31),
      },
    }),
  ]);

  console.log('✅ Created products');

  // Create some orders for testing
  const order1 = await prisma.order.create({
    data: {
      userId: regularUser.id,
      orderNumber: 'ORD-2024-001',
      status: 'DELIVERED',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'PAID',
      subtotal: 4299000,
      shippingCost: 50000,
      total: 4349000,
      fullName: 'John Doe',
      phone: '081234567890',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      postalCode: '12345',
      province: 'DKI Jakarta',
      createdAt: daysAgo(15),
      items: {
        create: [
          {
            productId: products[4].id,
            productName: products[4].name,
            productImage: products[4].images[0],
            price: products[4].price,
            quantity: 1,
            subtotal: products[4].price,
          },
        ],
      },
    },
  });

  // Create reviews
  await prisma.productReview.create({
    data: {
      userId: regularUser.id,
      productId: products[4].id,
      orderId: order1.id,
      rating: 5,
      review: 'Headphone terbaik yang pernah saya beli! Noise cancelling nya luar biasa, suara jernih, dan nyaman dipakai seharian.',
      images: [],
    },
  });

  console.log('✅ Created orders and reviews');

  console.log('🎉 Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: 2 (1 admin, 1 user)`);
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Products: ${products.length}`);
  console.log(`- Flash Sale products: ${products.filter((p: any) => p.badge === 'Flash Sale').length}`);
  console.log(`- Best Seller products: ${products.filter((p: any) => p.badge === 'Best Seller').length}`);
  console.log(`- New products: ${products.filter((p: any) => p.badge === 'New').length}`);
  console.log('\n🔐 Login credentials:');
  console.log('Admin: admin@example.com / admin123');
  console.log('User: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
