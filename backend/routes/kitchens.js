import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/kitchens - Get cloud kitchens / partner restaurants with filters
router.get('/', (req, res) => {
  const { city, category, type } = req.query;
  const store = db.get();
  let list = store.kitchens || [];

  if (city) {
    const cleanCity = city.toLowerCase().replace(/\s+/g, '-');
    const matched = list.filter(k => k.city === cleanCity || k.city === city.toLowerCase());
    
    if (matched.length > 0) {
      list = matched;
    } else {
      // Dynamic Kitchen Hubs Generator for any of the 500+ Indian Cities
      const formatCityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      list = [
        {
          id: `k-${cleanCity}-1`,
          name: `${formatCityName} Annapurna Homestyle Kitchen`,
          category: 'homestyle',
          type: 'veg',
          city: cleanCity,
          locality: `${formatCityName} Central Hub & Station Road`,
          distance: '1.4 km away',
          deliveryTime: '20-25 mins',
          rating: 4.95,
          reviewsCount: '3.8k+',
          priceForTwo: '₹220 for two',
          featuredDish: 'Ghar Ki Shahi Thali & Fresh Phulkas',
          cuisine: ['Pure Homestyle', 'Desi Ghee Cooking', 'Mom Made Flavors'],
          image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
          offer: 'FLAT ₹50 OFF with code FIRSTGHAR50',
          isPureVeg: true,
          hasJain: true,
          hasFit: false,
          popularItems: ['Annapurna Special Royal Thali', 'Desi Ghee Phulka Thali', 'Dal Tadka & Jeera Rice']
        },
        {
          id: `k-${cleanCity}-2`,
          name: `${formatCityName} Dabba Express & Cloud Kitchen`,
          category: 'regional',
          type: 'veg',
          city: cleanCity,
          locality: `${formatCityName} Tech & Commercial Hub`,
          distance: '2.1 km away',
          deliveryTime: '25-30 mins',
          rating: 4.92,
          reviewsCount: '2.6k+',
          priceForTwo: '₹240 for two',
          featuredDish: 'Regional Special Deluxe Thali & Paneer Handi',
          cuisine: ['Regional Homestyle', 'Zero Soda', 'Stainless Steel Dabba'],
          image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
          offer: 'FREE Sweet Dish on all Monthly Passes',
          isPureVeg: true,
          hasJain: false,
          hasFit: true,
          popularItems: ['Express Executive Thali', 'Paneer Butter Masala Thali', 'Yellow Dal Tadka Bowl']
        },
        {
          id: `k-${cleanCity}-3`,
          name: `${formatCityName} Satvik Rasoi (Jain & Pure Veg)`,
          category: 'satvik',
          type: 'jain',
          city: cleanCity,
          locality: `${formatCityName} Heritage Market & Temple Road`,
          distance: '1.8 km away',
          deliveryTime: '20-30 mins',
          rating: 4.97,
          reviewsCount: '4.1k+',
          priceForTwo: '₹260 for two',
          featuredDish: 'Satvik No Onion No Garlic Special Thali',
          cuisine: ['Pure Satvik', 'Jain Compliant', 'Ayurvedic Spices'],
          image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
          offer: '10% Cashback on Prepaid Wallet',
          isPureVeg: true,
          hasJain: true,
          hasFit: false,
          popularItems: ['Satvik Jain Deluxe Thali', 'Panchmel Dal & Baati', 'Gatte Ki Sabzi Jain Thali']
        },
        {
          id: `k-${cleanCity}-4`,
          name: `${formatCityName} NutriFit Protein Kitchen`,
          category: 'fitness',
          type: 'fit_protein',
          city: cleanCity,
          locality: `${formatCityName} University & Gym Avenue`,
          distance: '2.5 km away',
          deliveryTime: '25-35 mins',
          rating: 4.91,
          reviewsCount: '1.9k+',
          priceForTwo: '₹280 for two',
          featuredDish: 'High Protein Paneer & Soya Diet Meal',
          cuisine: ['Macro Counted', 'Low Oil', 'Brown Rice Options'],
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
          offer: 'FITPASS code for ₹60 off',
          isPureVeg: true,
          hasJain: false,
          hasFit: true,
          popularItems: ['High Protein Paneer Thali', 'Sprouted Moong Salad Bowl', 'Multi-Grain Chapati Meal']
        }
      ];
    }
  }

  if (type && type !== 'all') {
    if (type === 'veg') {
      list = list.filter(k => k.isPureVeg || k.type === 'veg');
    } else if (type === 'non_veg') {
      list = list.filter(k => k.type === 'non_veg' || (!k.isPureVeg && k.type === 'mixed'));
    } else if (type === 'jain') {
      list = list.filter(k => k.hasJain || k.type === 'jain');
    } else if (type === 'fit_protein') {
      list = list.filter(k => k.hasFit || k.type === 'fit_protein');
    }
  }

  res.json({
    success: true,
    data: list
  });
});

// GET /api/kitchens/:id - Get specific kitchen details
router.get('/:id', (req, res) => {
  const store = db.get();
  const kitchen = store.kitchens.find(k => k.id === req.params.id);
  if (!kitchen) {
    return res.status(404).json({ success: false, message: 'Kitchen not found' });
  }
  res.json({ success: true, data: kitchen });
});

export default router;
