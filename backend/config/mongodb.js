import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Provider, MenuItem, MealPlan, Order, Subscription, Review, Complaint, Notification, Coupon } from '../models/index.js';
import { seedDatabase } from '../seed/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

let isConnected = false;

// Setup Mongoose Connection Event Listeners
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log(`🍃 [MongoDB] Connection established successfully with host: ${mongoose.connection.host}, database: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.warn(`⚠️ [MongoDB] Connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('ℹ️ [MongoDB] Disconnected from database.');
});

/**
 * Automatically seeds MongoDB with initial HomeFeast models if collections are empty
 */
export const autoSeedMongoDB = async () => {
  try {
    const userCount = await User.countDocuments();
    const providerCount = await Provider.countDocuments();

    if (userCount === 0 || providerCount === 0) {
      console.log('🌱 [MongoDB] Seeding initial HomeFeast database collections...');
      const seed = seedDatabase();

      if (seed.users && seed.users.length > 0) {
        await User.deleteMany({});
        await User.insertMany(seed.users.map(u => ({ ...u, password: u.passwordHash })));
      }

      if (seed.providers && seed.providers.length > 0) {
        await Provider.deleteMany({});
        await Provider.insertMany(seed.providers);
      }

      if (seed.menuItems && seed.menuItems.length > 0) {
        await MenuItem.deleteMany({});
        await MenuItem.insertMany(seed.menuItems);
      }

      if (seed.mealPlans && seed.mealPlans.length > 0) {
        await MealPlan.deleteMany({});
        await MealPlan.insertMany(seed.mealPlans);
      }

      if (seed.notifications && seed.notifications.length > 0) {
        await Notification.deleteMany({});
        await Notification.insertMany(seed.notifications);
      }

      console.log('✅ [MongoDB] Initial collections populated successfully!');
    }
  } catch (err) {
    console.warn('⚠️ [MongoDB] Auto-seed warning:', err.message);
  }
};

/**
 * Connect to MongoDB instance (Local or Atlas)
 */
export const connectMongoDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homefeast';

  if (isConnected && mongoose.connection.readyState === 1) {
    return {
      success: true,
      message: 'MongoDB is already connected.',
      uri: uri.replace(/:([^@]+)@/, ':****@'),
      host: mongoose.connection.host,
      database: mongoose.connection.name
    };
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000, // Quick timeout for graceful fallback
      connectTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`🍃 [MongoDB Connected] Database host: ${conn.connection.host}, Name: ${conn.connection.name}`);
    
    // Auto-seed if collections are empty
    await autoSeedMongoDB();

    return {
      success: true,
      message: 'Connected to MongoDB successfully!',
      host: conn.connection.host,
      database: conn.connection.name
    };
  } catch (err) {
    isConnected = false;
    console.log(`ℹ️ [MongoDB Info] MongoDB connection not active (${err.message}). Using persistent JSON storage engine fallback.`);
    return {
      success: false,
      message: err.message,
      note: 'Using persistent JSON store fallback. To connect to MongoDB, ensure local mongod service is running or set MONGODB_URI in .env with your MongoDB Atlas connection string.'
    };
  }
};

/**
 * Get current MongoDB connection state & statistics
 */
export const getMongoStatus = async () => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const status = {
    connected: mongoose.connection.readyState === 1,
    readyState: readyStateMap[mongoose.connection.readyState] || 'disconnected',
    host: mongoose.connection.host || '127.0.0.1',
    database: mongoose.connection.name || 'homefeast',
    uri: (process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/homefeast').replace(/:([^@]+)@/, ':****@')
  };

  if (mongoose.connection.readyState === 1) {
    try {
      status.counts = {
        users: await User.countDocuments(),
        providers: await Provider.countDocuments(),
        menuItems: await MenuItem.countDocuments(),
        mealPlans: await MealPlan.countDocuments(),
        orders: await Order.countDocuments(),
        subscriptions: await Subscription.countDocuments(),
        reviews: await Review.countDocuments(),
        complaints: await Complaint.countDocuments(),
        notifications: await Notification.countDocuments(),
        coupons: await Coupon.countDocuments()
      };
    } catch (e) {
      status.countsError = e.message;
    }
  }

  return status;
};

export default connectMongoDB;
