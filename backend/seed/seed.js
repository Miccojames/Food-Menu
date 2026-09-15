import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const categories = [
  { name: 'Main', description: 'Main dishes' },
  { name: 'Snacks', description: 'Quick bites and sides' },
  { name: 'Drinks', description: 'Beverages' },
  { name: 'Dessert', description: 'Sweet treats' },
];

const foodsByCategory = {
  Main: [
    {
      name: 'Chicken Rice Bowl',
      price: 149,
      description: 'Grilled chicken with steamed rice and veggies',
      image: '/chicken-rice-bowl.jpg',
      spicy: false,
      vegetarian: false,
      available: true,
    },
    {
      name: 'Spicy Ramen',
      price: 189,
      description: 'Hot noodles in spicy broth with soft egg',
      image: '/spicy-ramen.jpg',
      spicy: true,
      vegetarian: false,
      available: true,
    },
    {
      name: 'Burger Stack',
      price: 199,
      description: 'Juicy beef patty with cheese and sauce',
      image: '/burger-stack.png',
      spicy: false,
      vegetarian: false,
      available: true,
    },
    {
      name: 'Garlic Chicken Pasta',
      price: 175,
      description: 'Creamy pasta with tender chicken and garlic',
      image: '/chicken-pasta.jpg',
      spicy: false,
      vegetarian: false,
      available: true,
    },
  ],
  Snacks: [
    {
      name: 'Crispy Fries',
      price: 89,
      description: 'Golden crispy fries with sea salt',
      image: '/crispy-fries.jpg',
      spicy: false,
      vegetarian: true,
      available: true,
    },
    {
      name: 'Chicken Wings',
      price: 129,
      description: 'Crispy wings with sweet and savory glaze',
      image: '/chicken-wings.png',
      spicy: false,
      vegetarian: false,
      available: true,
    },
  ],
  Drinks: [
    {
      name: 'Iced Matcha',
      price: 99,
      description: 'Refreshing matcha tea with creamy milk',
      image: '/iced-matcha.png',
      spicy: false,
      vegetarian: true,
      available: true,
    },
    {
      name: 'Strawberry Soda',
      price: 79,
      description: 'Sweet fizzy soda with fresh fruit',
      image: '/strawberry-soda.png',
      spicy: false,
      vegetarian: true,
      available: true,
    },
  ],
  Dessert: [
    {
      name: 'Mango Cheesecake',
      price: 159,
      description: 'Creamy cheesecake with fresh mango',
      image: '/mango-cheesecake.jpg',
      spicy: false,
      vegetarian: true,
      available: true,
    },
    {
      name: 'Chocolate Brownie',
      price: 119,
      description: 'Rich fudgy brownie with gooey center',
      image: '/chocolate-brownie.jpg',
      spicy: false,
      vegetarian: true,
      available: true,
    },
  ],
};

async function seedDB() {
  try {
    console.log('🌱 Seeding Neon PostgreSQL...');

    // Clear existing data (order matters due to FK constraints)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.food.deleteMany();
    await prisma.category.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Insert categories and foods
    for (const cat of categories) {
      const created = await prisma.category.create({
        data: {
          name: cat.name,
          description: cat.description,
          foods: {
            create: foodsByCategory[cat.name] || [],
          },
        },
      });
      console.log(`✅ Seeded category: ${created.name}`);
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDB();
