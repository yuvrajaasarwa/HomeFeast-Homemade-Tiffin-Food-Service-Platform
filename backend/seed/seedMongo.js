import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Provider, MenuItem, MealPlan, Order, Subscription, Review, Complaint, Notification, Coupon } from '../models/index.js';
import { seedDatabase } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homefeast';

async function seedMongo() {
  console.log('🍃 Connecting to MongoDB for database seeding...');
  console.log(`📌 URI: ${uri.replace(/:([^@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully!');

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Provider.deleteMany({}),
      MenuItem.deleteMany({}),
      MealPlan.deleteMany({}),
      Order.deleteMany({}),
      Subscription.deleteMany({}),
      Review.deleteMany({}),
      Complaint.deleteMany({}),
      Notification.deleteMany({}),
      Coupon.deleteMany({})
    ]);

    console.log('🌱 Generating rich seed dataset...');
    const seed = seedDatabase();

    const usersData = (seed.users || []).map(u => ({
      ...u,
      password: u.passwordHash
    }));

    const couponsData = [
      { code: 'WELCOME50', discountPercent: 50, maxDiscount: 100, minOrderAmount: 99, description: '50% off on your first thali order' },
      { code: 'FEAST20', discountPercent: 20, maxDiscount: 150, minOrderAmount: 149, description: '20% off on weekly meal pass' },
      { code: 'HOMESTYLE10', discountPercent: 10, maxDiscount: 200, minOrderAmount: 99, description: '10% off across all verified home kitchens' }
    ];

    console.log('📥 Inserting documents into MongoDB...');
    const [
      users,
      providers,
      menuItems,
      mealPlans,
      notifications,
      coupons
    ] = await Promise.all([
      usersData.length > 0 ? User.insertMany(usersData) : Promise.resolve([]),
      seed.providers?.length > 0 ? Provider.insertMany(seed.providers) : Promise.resolve([]),
      seed.menuItems?.length > 0 ? MenuItem.insertMany(seed.menuItems) : Promise.resolve([]),
      seed.mealPlans?.length > 0 ? MealPlan.insertMany(seed.mealPlans) : Promise.resolve([]),
      seed.notifications?.length > 0 ? Notification.insertMany(seed.notifications) : Promise.resolve([]),
      Coupon.insertMany(couponsData)
    ]);

    console.log('\n=============================================');
    console.log('🎉 MongoDB Seeding Completed Successfully!');
    console.log('=============================================');
    console.log(`👤 Users:         ${users.length}`);
    console.log(`👩‍🍳 Providers:     ${providers.length}`);
    console.log(`🍲 Menu Items:    ${menuItems.length}`);
    console.log(`📅 Meal Plans:    ${mealPlans.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`🎟️ Coupons:       ${coupons.length}`);
    console.log('=============================================\n');

    await mongoose.connection.close();
    console.log('🔒 MongoDB connection closed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB Seeding Error:', err.message);
    console.log('\n💡 Tip: If running locally, make sure your MongoDB service is running (e.g. `mongod` or MongoDB Compass).');
    console.log('💡 Or set MONGODB_URI in your .env to a free MongoDB Atlas connection string.\n');
    process.exit(1);
  }
}

seedMongo();
