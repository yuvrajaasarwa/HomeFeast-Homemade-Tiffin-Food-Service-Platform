import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import providersRouter from './routes/providers.js';
import menuRouter from './routes/menu.js';
import plansRouter from './routes/plans.js';
import ordersRouter from './routes/orders.js';
import subscriptionsRouter from './routes/subscriptions.js';
import reviewsRouter from './routes/reviews.js';
import complaintsRouter from './routes/complaints.js';
import notificationsRouter from './routes/notifications.js';
import adminRouter from './routes/admin.js';
import locationsRouter from './routes/locations.js';
import ridersRouter from './routes/riders.js';
import { db } from './db.js';
import { connectMongoDB, getMongoStatus } from './config/mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB on backend startup
connectMongoDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Core REST Routes
app.use('/api/auth', authRouter);
app.use('/api/providers', providersRouter);
app.use('/api/menu', menuRouter);
app.use('/api/plans', plansRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/riders', ridersRouter);

// Aliases for seamless backward compatibility
app.use('/api/kitchens', providersRouter);
app.get('/api/meals/weekly', (req, res) => {
  const store = db.get();
  res.json({ success: true, data: store.weeklyMenu || {} });
});
app.get('/api/meals/thali-builder', (req, res) => {
  const store = db.get();
  res.json({ success: true, data: store.thaliBuilder || {} });
});

// Dedicated MongoDB Connection & Status Endpoint
app.get('/api/mongodb-status', async (req, res) => {
  const status = await getMongoStatus();
  res.json({
    success: true,
    platform: 'HomeFeast – Homemade Tiffin & Food Service Platform',
    mongodb: status,
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const store = db.get();
  const mongoStatus = await getMongoStatus();

  res.json({
    status: 'healthy',
    platform: 'HomeFeast – Homemade Tiffin & Food Service Platform',
    database: {
      engine: mongoStatus.connected ? 'MongoDB (Mongoose)' : 'Persistent JSON Storage Engine (MongoDB Ready)',
      mongodb: mongoStatus
    },
    cities: Object.keys(store.locations || {}),
    stats: {
      providersCount: (store.providers || []).length,
      usersCount: (store.users || []).length,
      dishesCount: (store.menuItems || []).length,
      mealPlansCount: (store.mealPlans || []).length,
      ordersCount: (store.orders || []).length,
      subscriptionsCount: (store.subscriptions || []).length
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.send('🍲 HomeFeast – Homemade Tiffin & Food Service Platform API is running smoothly.');
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✨ HomeFeast API Server running at http://localhost:${PORT}`);
  });
}

export default app;
