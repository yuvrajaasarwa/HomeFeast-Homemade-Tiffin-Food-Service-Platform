import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/meals/weekly - Get full weekly menu
router.get('/weekly', (req, res) => {
  const store = db.get();
  res.json({
    success: true,
    data: store.weeklyMenu
  });
});

// GET /api/meals/today?day=monday&slot=lunch&diet=veg
router.get('/today', (req, res) => {
  const store = db.get();
  const day = (req.query.day || 'monday').toLowerCase();
  const slot = (req.query.slot || 'lunch').toLowerCase();
  const diet = req.query.diet;

  const dayMenu = store.weeklyMenu[day];
  if (!dayMenu) {
    return res.status(404).json({ success: false, message: `Day '${day}' not found.` });
  }

  let items = dayMenu[slot] || [];
  if (diet && diet !== 'all') {
    items = items.filter(m => m.diet === diet);
  }

  res.json({
    success: true,
    day,
    slot,
    count: items.length,
    data: items
  });
});

// GET /api/meals/thali-builder - Get custom thali components
router.get('/thali-builder', (req, res) => {
  const store = db.get();
  const defaultThaliBuilder = {
    curries: [
      { id: 'c-1', name: 'Royal Shahi Paneer (Cashew Gravy)', type: 'veg', cal: 240, price: 49, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-2', name: 'Dal Makhani (Overnight Simmered)', type: 'veg', cal: 210, price: 39, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-3', name: 'Marwadi Govind Gatte Curry', type: 'veg', cal: 190, price: 39, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-4', name: 'Rajasthani Ker Sangri', type: 'veg', cal: 180, price: 49, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-5', name: 'Butter Chicken Masala', type: 'non_veg', cal: 280, price: 69, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-6', name: 'Laal Maas Rajputana Special', type: 'non_veg', cal: 310, price: 79, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-7', name: 'Jain Paneer Butter Masala (No Onion/Garlic)', type: 'jain', cal: 220, price: 49, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' },
      { id: 'c-8', name: 'High-Protein Paneer Bhurji (Low Oil)', type: 'fit_protein', cal: 190, price: 49, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' }
    ],
    dals: [
      { id: 'd-1', name: 'Rajasthani Panchmel Dal Tadka', cal: 140, price: 29, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'd-2', name: 'Yellow Moong Dal with Hing Jeera', cal: 120, price: 25, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80' },
      { id: 'd-3', name: 'Iron-Rich Dal Palak (Spinach Dal)', cal: 130, price: 29, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
      { id: 'd-4', name: 'Amritsari Tariwala Rajma', cal: 160, price: 29, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80' }
    ],
    breadsAndRice: [
      { id: 'b-1', name: '4 Bilona Gir Cow Ghee Phulkas', cal: 240, price: 29, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'b-2', name: '3 Missi Rotis with White Butter', cal: 260, price: 35, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'b-3', name: '3 Multigrain Oats & Ragi Rotis', cal: 190, price: 35, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
      { id: 'b-4', name: 'Jeera Basmati Rice Bowl', cal: 210, price: 29, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'b-5', name: 'Steamed Organic Quinoa Bowl', cal: 180, price: 45, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' }
    ],
    accompaniments: [
      { id: 'a-1', name: 'Desi Ghee Churma Ladoo (60g)', cal: 180, price: 30, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'a-2', name: 'Chilled Boondi Raita', cal: 90, price: 20, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'a-3', name: 'Gulab Jamun (2 Pcs)', cal: 160, price: 25, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
      { id: 'a-4', name: 'Sprouted Moong & Cucumber Salad', cal: 60, price: 20, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
      { id: 'a-5', name: 'Spiced Buttermilk (Chaas) Bottle', cal: 40, price: 15, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' }
    ]
  };

  res.json({
    success: true,
    data: store.thaliBuilder || defaultThaliBuilder
  });
});

// GET /api/meals/:id - Get specific meal item details
router.get('/:id', (req, res) => {
  const store = db.get();
  const { id } = req.params;

  for (const day of Object.keys(store.weeklyMenu)) {
    for (const slot of ['lunch', 'dinner']) {
      const found = (store.weeklyMenu[day][slot] || []).find(m => m.id === id);
      if (found) {
        return res.json({ success: true, data: found });
      }
    }
  }

  res.status(404).json({ success: false, message: 'Meal item not found.' });
});

export default router;
