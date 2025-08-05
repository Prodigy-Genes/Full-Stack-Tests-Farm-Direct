import prisma from './db';
import { hashPassword } from './utils/auth';

async function main() {
  try {
    console.log('🌱 Starting database seed...');

    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🧹 Cleaning existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    console.log('👥 Creating users...');

    // Create test farmers
    const hashedPassword = await hashPassword('password123');
    
    const farmer1 = await prisma.user.create({
      data: {
        email: 'farmer1@example.com',
        password: hashedPassword,
        name: 'John Smith',
        role: 'FARMER',
        farmName: 'Green Valley Farm',
        farmAddress: '123 Farm Road, Rural Valley, CA 95423',
        phone: '+1-555-0101',
      },
    });

    const farmer2 = await prisma.user.create({
      data: {
        email: 'farmer2@example.com',
        password: hashedPassword,
        name: 'Maria Rodriguez',
        role: 'FARMER',
        farmName: 'Sunset Organic Farm',
        farmAddress: '456 Organic Lane, Farmville, CA 95424',
        phone: '+1-555-0102',
      },
    });

    const farmer3 = await prisma.user.create({
      data: {
        email: 'farmer3@example.com',
        password: hashedPassword,
        name: 'David Chen',
        role: 'FARMER',
        farmName: 'Mountain View Agriculture',
        farmAddress: '789 Mountain View Rd, Hillside, CA 95425',
        phone: '+1-555-0103',
      },
    });

    // Create test customers
    const customer1 = await prisma.user.create({
      data: {
        email: 'customer1@example.com',
        password: hashedPassword,
        name: 'Sarah Johnson',
        role: 'CUSTOMER',
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        email: 'customer2@example.com',
        password: hashedPassword,
        name: 'Mike Wilson',
        role: 'CUSTOMER',
      },
    });

    console.log('🥬 Creating products...');

    // Create products for farmer1 (Green Valley Farm)
    const farmer1Products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Fresh Tomatoes',
          description: 'Vine-ripened organic tomatoes, perfect for salads and cooking. Grown using sustainable farming practices.',
          price: 4.99,
          category: 'VEGETABLES',
          quantity: 50,
          farmerId: farmer1.id,
          harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
      }),
      prisma.product.create({
        data: {
          name: 'Sweet Corn',
          description: 'Freshly picked sweet corn from our fields. Non-GMO and pesticide-free.',
          price: 3.49,
          category: 'VEGETABLES',
          quantity: 30,
          farmerId: farmer1.id,
          harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
      }),
      prisma.product.create({
        data: {
          name: 'Farm Fresh Eggs',
          description: 'Free-range chicken eggs from our happy hens. Rich in omega-3 and protein.',
          price: 6.99,
          category: 'DAIRY',
          quantity: 25,
          farmerId: farmer1.id,
          harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
        },
      }),
      prisma.product.create({
        data: {
          name: 'Organic Carrots',
          description: 'Crunchy, sweet carrots grown in rich soil. Perfect for snacking or cooking.',
          price: 2.99,
          category: 'VEGETABLES',
          quantity: 40,
          farmerId: farmer1.id,
          harvestDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    // Create products for farmer2 (Sunset Organic Farm)
    const farmer2Products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Honeycrisp Apples',
          description: 'Crisp and sweet apples from our organic orchard. Great for eating fresh or baking.',
          price: 5.99,
          category: 'FRUITS',
          quantity: 60,
          farmerId: farmer2.id,
          harvestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks
        },
      }),
      prisma.product.create({
        data: {
          name: 'Fresh Strawberries',
          description: 'Juicy, sweet strawberries picked at peak ripeness. Perfect for desserts or eating fresh.',
          price: 7.99,
          category: 'FRUITS',
          quantity: 20,
          farmerId: farmer2.id,
          harvestDate: new Date(),
          expiryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days (expires soon!)
        },
      }),
      prisma.product.create({
        data: {
          name: 'Organic Spinach',
          description: 'Fresh baby spinach leaves, perfect for salads and smoothies. Packed with nutrients.',
          price: 3.99,
          category: 'VEGETABLES',
          quantity: 35,
          farmerId: farmer2.id,
          harvestDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.product.create({
        data: {
          name: 'Whole Milk',
          description: 'Fresh whole milk from our grass-fed cows. Rich, creamy, and nutritious.',
          price: 4.49,
          category: 'DAIRY',
          quantity: 15,
          farmerId: farmer2.id,
          harvestDate: new Date(),
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.product.create({
        data: {
          name: 'Organic Blueberries',
          description: 'Antioxidant-rich blueberries, perfect for breakfast or snacking.',
          price: 8.99,
          category: 'FRUITS',
          quantity: 0, // Out of stock
          farmerId: farmer2.id,
          harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    // Create products for farmer3 (Mountain View Agriculture)
    const farmer3Products = await Promise.all([
      prisma.product.create({
        data: {
          name: 'Quinoa Grain',
          description: 'Premium organic quinoa, a complete protein grain. Gluten-free and nutritious.',
          price: 12.99,
          category: 'GRAINS',
          quantity: 80,
          farmerId: farmer3.id,
          harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        },
      }),
      prisma.product.create({
        data: {
          name: 'Brown Rice',
          description: 'Whole grain brown rice, organically grown. Rich in fiber and nutrients.',
          price: 8.99,
          category: 'GRAINS',
          quantity: 100,
          farmerId: farmer3.id,
          harvestDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.product.create({
        data: {
          name: 'Bell Peppers Mix',
          description: 'Colorful mix of red, yellow, and green bell peppers. Sweet and crunchy.',
          price: 6.49,
          category: 'VEGETABLES',
          quantity: 45,
          farmerId: farmer3.id,
          harvestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.product.create({
        data: {
          name: 'Artisan Cheese',
          description: 'Handcrafted cheese made from our farm-fresh milk. Aged to perfection.',
          price: 15.99,
          category: 'DAIRY',
          quantity: 12,
          farmerId: farmer3.id,
          harvestDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      }),
      prisma.product.create({
        data: {
          name: 'Mixed Citrus',
          description: 'Fresh oranges, lemons, and limes from our citrus grove. Vitamin C packed!',
          price: 9.99,
          category: 'FRUITS',
          quantity: 55,
          farmerId: farmer3.id,
          harvestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    console.log('📦 Creating sample orders...');

    // Create some sample orders
    const order1 = await prisma.order.create({
      data: {
        customerId: customer1.id,
        totalPrice: 18.47,
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        orderItems: {
          create: [
            {
              productId: farmer1Products[0].id, // Tomatoes
              quantity: 2,
              price: 4.99,
            },
            {
              productId: farmer2Products[0].id, // Apples
              quantity: 1,
              price: 5.99,
            },
            {
              productId: farmer1Products[3].id, // Carrots
              quantity: 1,
              price: 2.99,
            },
          ],
        },
      },
    });

    const order2 = await prisma.order.create({
      data: {
        customerId: customer2.id,
        totalPrice: 24.97,
        status: 'SHIPPED',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        orderItems: {
          create: [
            {
              productId: farmer3Products[0].id, // Quinoa
              quantity: 1,
              price: 12.99,
            },
            {
              productId: farmer2Products[1].id, // Strawberries
              quantity: 1,
              price: 7.99,
            },
            {
              productId: farmer1Products[2].id, // Eggs
              quantity: 1,
              price: 6.99,
            },
          ],
        },
      },
    });

    const order3 = await prisma.order.create({
      data: {
        customerId: customer1.id,
        totalPrice: 13.48,
        status: 'CONFIRMED',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        orderItems: {
          create: [
            {
              productId: farmer1Products[1].id, // Corn
              quantity: 2,
              price: 3.49,
            },
            {
              productId: farmer3Products[2].id, // Bell Peppers
              quantity: 1,
              price: 6.49,
            },
          ],
        },
      },
    });

    console.log('✅ Database seed completed successfully!');
    console.log('\n📊 Seed Summary:');
    console.log(`👥 Users created: ${await prisma.user.count()}`);
    console.log(`   - Farmers: ${await prisma.user.count({ where: { role: 'FARMER' } })}`);
    console.log(`   - Customers: ${await prisma.user.count({ where: { role: 'CUSTOMER' } })}`);
    console.log(`🥬 Products created: ${await prisma.product.count()}`);
    console.log(`📦 Orders created: ${await prisma.order.count()}`);
    console.log(`🛒 Order items created: ${await prisma.orderItem.count()}`);

    console.log('\n🔐 Test Account Credentials:');
    console.log('Farmers:');
    console.log('  - farmer1@example.com / password123 (Green Valley Farm)');
    console.log('  - farmer2@example.com / password123 (Sunset Organic Farm)');
    console.log('  - farmer3@example.com / password123 (Mountain View Agriculture)');
    console.log('Customers:');
    console.log('  - customer1@example.com / password123');
    console.log('  - customer2@example.com / password123');

    console.log('\n🌟 Features to test:');
    console.log('  - Products with different categories (Vegetables, Fruits, Grains, Dairy)');
    console.log('  - Products with different expiry dates (some expiring soon)');
    console.log('  - Out of stock products');
    console.log('  - Products from different farms');
    console.log('  - Sample orders with different statuses');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });