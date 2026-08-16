import express from 'express';
import { db } from '../db.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to create all 6 diets for every single day and slot
const createDailySlotDishes = (dayKey, slotKey, dayName, slotName) => {
  const isLunch = slotKey === 'lunch';
  const prefix = `meal_${dayKey}_${slotKey}`;

  return [
    // 1. Rajasthani Royal Thali
    {
      id: `${prefix}_raj`,
      name: isLunch ? `${dayName} Rajasthani Dal Baati Churma Mahabhoj` : `${dayName} Govind Gatte & Bajra Roti Thali`,
      tagline: isLunch ? '4 Crispy Baatis in Gir Cow Desi Ghee, Panchmel Dal & Rose Gond Churma' : 'Mawa-stuffed Govind Gatte, 2 Bajra Rotis & White Butter',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
      price: isLunch ? 165 : 125,
      originalPrice: isLunch ? 200 : 155,
      diet: 'rajasthani',
      cuisine: 'rajasthani',
      isRajasthani: true,
      isChefSpecial: true,
      items: isLunch
        ? ['4 Desi Ghee Baatis', 'Spicy Panchmel Dal', 'Gond Rose Churma', 'Lehsun Chutney & Chaas']
        : ['Govind Gatte Curry', '2 Hot Bajra Rotis', 'Desi Ghee White Butter', 'Garlic Chutney'],
      calories: isLunch ? 780 : 610,
      protein: '22g',
      carbs: '95g',
      fat: '26g',
      chefNote: 'Authentic 3-generation wood-fired recipe.'
    },

    // 2. Pure Veg Homestyle
    {
      id: `${prefix}_veg`,
      name: isLunch ? `${dayName} Executive Desi Ghee Phulka Thali` : `${dayName} Homestyle Kadhi Pakoda & Rice Meal`,
      tagline: isLunch ? '4 Whole Wheat Phulkas, Shahi Paneer, Dal Tadka & Jeera Rice' : 'Sour Curd Kadhi Pakoda, 4 Phulkas & Seasonal Sabzi',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      price: isLunch ? 110 : 85,
      originalPrice: isLunch ? 140 : 110,
      diet: 'veg',
      cuisine: 'north_indian',
      isRajasthani: false,
      isChefSpecial: true,
      items: isLunch
        ? ['4 Soft Ghee Phulkas', 'Shahi Paneer (150g)', 'Yellow Dal Tadka', 'Jeera Basmati Rice', 'Gulab Jamun']
        : ['Kadhi Pakoda', 'Steamed Rice', '4 Soft Phulkas', 'Aloo Gobi Sabzi'],
      calories: isLunch ? 590 : 490,
      protein: '20g',
      carbs: '74g',
      fat: '14g',
      chefNote: 'Prepared fresh 30 minutes before delivery.'
    },

    // 3. Non-Veg Special
    {
      id: `${prefix}_nonveg`,
      name: isLunch ? `${dayName} Mughlai Chicken Dum Biryani Feast` : `${dayName} Homestyle Butter Chicken & Phulkas`,
      tagline: isLunch ? 'Aromatic long-grain saffron basmati rice with tender chicken & boondi raita' : 'Silky butter chicken in tomato-cashew gravy with 4 soft phulkas',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
      price: isLunch ? 165 : 175,
      originalPrice: isLunch ? 210 : 220,
      diet: 'non_veg',
      cuisine: 'north_indian',
      isRajasthani: false,
      isChefSpecial: true,
      items: isLunch
        ? ['Chicken Dum Biryani (2 pcs)', 'Boondi Raita', 'Mirchi Ka Salan', 'Pickled Onions']
        : ['Butter Chicken (3 pcs)', '4 Ghee Phulkas', 'Jeera Rice', 'Gulab Jamun'],
      calories: isLunch ? 720 : 710,
      protein: '36g',
      carbs: '78g',
      fat: '24g',
      chefNote: 'Fresh halal meat cooked with home-ground roasted garam masala.'
    },

    // 4. High Protein Fit
    {
      id: `${prefix}_protein`,
      name: `${dayName} High-Protein Herb Grilled Paneer & Sprouts Bowl`,
      tagline: '220g Grilled Malai Paneer, Sprouted Moong Quinoa Salad & 2 Jowar Rotis',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      price: 140,
      originalPrice: 175,
      diet: 'fit_protein',
      cuisine: 'north_indian',
      isRajasthani: false,
      isChefSpecial: true,
      items: ['220g Herb Grilled Paneer', 'Sprouted Moong & Chana Salad', '2 Jowar Multigrain Rotis', 'Spiced Buttermilk'],
      calories: 480,
      protein: '34g',
      carbs: '42g',
      fat: '12g',
      chefNote: 'Nutrient-counted fitness meal formulated for lean muscle and fat loss.'
    },

    // 5. 100% Jain Sattvic
    {
      id: `${prefix}_jain`,
      name: `${dayName} Pure Satvik Jain Lauki Chana Dal & Khichdi`,
      tagline: '100% Satvik, zero onion-garlic, cooked with pure cow ghee and Ayurvedic spices',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      price: 95,
      originalPrice: 120,
      diet: 'jain',
      cuisine: 'jain',
      isRajasthani: false,
      isChefSpecial: false,
      items: ['Lauki Chana Dal Tadka', 'Moong Dal Khichdi in Desi Ghee', '4 Soft Ghee Phulkas', 'Roasted Papad'],
      calories: 460,
      protein: '18g',
      carbs: '68g',
      fat: '9g',
      chefNote: 'Strictly complies with Jain fasting & Ayurvedic guidelines.'
    },

    // 6. Pizza (Farmhouse Paneer Thin-Crust)
    {
      id: `${prefix}_pizza`,
      name: `${dayName} Farmhouse Paneer Thin-Crust Pizza (8 Inch)`,
      tagline: 'Whole wheat hand-stretched crust with fresh mozzarella, grilled paneer, bell peppers, olives & corn',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      price: 149,
      originalPrice: 199,
      diet: 'street_fast',
      cuisine: 'fast_food',
      isRajasthani: false,
      isChefSpecial: true,
      items: ['8-Inch Whole Wheat Thin Crust Pizza', 'Extra Mozzarella & Cottage Cheese', 'Cheesy Garlic Dip', 'Oregano & Chilli Flakes'],
      calories: 590,
      protein: '24g',
      carbs: '68g',
      fat: '16g',
      chefNote: 'Made on fresh 100% whole wheat base without palm oil.'
    },

    // 7. Pasta (Creamy Alfredo White Sauce)
    {
      id: `${prefix}_pasta`,
      name: `${dayName} Creamy Alfredo White Sauce Penne Pasta`,
      tagline: 'Rich cheese & herb white sauce penne with broccoli, sweet corn, bell peppers & 2 garlic breads',
      image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=600&q=80',
      price: 135,
      originalPrice: 175,
      diet: 'street_fast',
      cuisine: 'fast_food',
      isRajasthani: false,
      isChefSpecial: true,
      items: ['Creamy Alfredo Penne Pasta (350g)', '2 Herb Butter Garlic Breads', 'Grated Parmesan & Herb Dusting', 'Chilli Flakes'],
      calories: 560,
      protein: '18g',
      carbs: '74g',
      fat: '15g',
      chefNote: 'Cooked al dente in rich cream & garlic butter sauce.'
    },

    // 8. Momos (Steamed Darjeeling Veg & Paneer)
    {
      id: `${prefix}_momos`,
      name: `${dayName} Steamed Darjeeling Paneer Momos (8 Pcs)`,
      tagline: 'Thin wrapper juicy steamed momos with finely minced paneer, cabbage & fiery garlic red chutney',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
      price: 99,
      originalPrice: 130,
      diet: 'street_fast',
      cuisine: 'fast_food',
      isRajasthani: false,
      isChefSpecial: true,
      items: ['8 Pcs Steamed Paneer & Veg Momos', 'Fiery Red Garlic Chilli Chutney', 'Creamy Mayo Dip', 'Clear Veg Soup Shot'],
      calories: 390,
      protein: '17g',
      carbs: '54g',
      fat: '8g',
      chefNote: 'Steamed fresh upon ordering with delicate thin wrappers.'
    },

    // 9. Samosa Chaat (Delhi Chandni Chowk Style)
    {
      id: `${prefix}_samosa_chaat`,
      name: `${dayName} Chandni Chowk Samosa Chaat Bowl`,
      tagline: '2 Golden crispy samosas crushed over spicy Amritsari chana, thick sweet curd, saunth & sev',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
      price: 79,
      originalPrice: 105,
      diet: 'street_fast',
      cuisine: 'street_food',
      isRajasthani: false,
      isChefSpecial: false,
      items: ['2 Crushed Punjabi Samosas', 'Spicy Amritsari Chana Masala', 'Thick Sweet Curd', 'Imli Saunth & Mint Chutney', 'Crispy Nylon Sev & Pomegranate'],
      calories: 460,
      protein: '14g',
      carbs: '65g',
      fat: '14g',
      chefNote: 'Crispy, tangy, sweet & spicy authentic Delhi chaat.'
    },

    // 10. Pav Bhaji (Desi Ghee Mixed Veg)
    {
      id: `${prefix}_pavbhaji`,
      name: `${dayName} Special Desi Ghee Pav Bhaji Feast`,
      tagline: 'Buttery mashed mixed veg bhaji with 4 toasted butter pavs & gulab jamun',
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
      price: 95,
      originalPrice: 125,
      diet: 'street_fast',
      cuisine: 'fast_food',
      isRajasthani: false,
      isChefSpecial: true,
      items: ['Desi Ghee Mixed Veg Pav Bhaji', '4 Butter-Toasted Pavs', 'Lemon & Chopped Onions', 'Gulab Jamun'],
      calories: 590,
      protein: '15g',
      carbs: '82g',
      fat: '18g',
      chefNote: 'Street taste prepared in clean home kitchen with 100% hygiene.'
    }
  ];
};

// 7-Day Complete Rotational Homestyle Menu Data
const getFullWeeklyMenuData = () => {
  const days = [
    { key: 'monday', name: 'Monday' },
    { key: 'tuesday', name: 'Tuesday' },
    { key: 'wednesday', name: 'Wednesday' },
    { key: 'thursday', name: 'Thursday' },
    { key: 'friday', name: 'Friday' },
    { key: 'saturday', name: 'Saturday' },
    { key: 'sunday', name: 'Sunday' }
  ];

  const result = {};
  days.forEach(d => {
    result[d.key] = {
      lunch: createDailySlotDishes(d.key, 'lunch', d.name, 'Lunch'),
      dinner: createDailySlotDishes(d.key, 'dinner', d.name, 'Dinner')
    };
  });

  return result;
};

// GET /api/menu/weekly - 7-day rotational daily tiffin menu
router.get('/weekly', (req, res) => {
  const weekly = getFullWeeklyMenuData();
  res.json({
    success: true,
    data: weekly
  });
});

// GET /api/menu/thali-builder - 4-Compartment Studio Customization Items
router.get('/thali-builder', (req, res) => {
  res.json({
    success: true,
    data: {
      curries: [
        { id: 'c-1', name: 'Shahi Paneer Makhani', img: '🥘', price: 45, cal: 260, type: 'veg' },
        { id: 'c-2', name: 'Rajasthani Govind Gatte', img: '🧆', price: 40, cal: 220, type: 'veg' },
        { id: 'c-3', name: 'Pindi Chole Masala', img: '🍲', price: 35, cal: 210, type: 'veg' },
        { id: 'c-4', name: 'Matar Paneer Homestyle', img: '🍛', price: 40, cal: 240, type: 'veg' },
        { id: 'c-5', name: 'Dhaba Murgh (Chicken Curry)', img: '🍗', price: 65, cal: 320, type: 'non_veg' },
        { id: 'c-6', name: 'Butter Chicken Gravy', img: '🥘', price: 70, cal: 340, type: 'non_veg' },
        { id: 'c-7', name: 'Satvik Lauki Chana Dal', img: '🥣', price: 30, cal: 180, type: 'jain' },
        { id: 'c-8', name: 'High-Protein Herb Grilled Paneer', img: '💪', price: 55, cal: 280, type: 'veg' }
      ],
      dals: [
        { id: 'd-1', name: 'Yellow Moong Dal Tadka (Desi Ghee)', img: '🥣', price: 25, cal: 160, type: 'veg' },
        { id: 'd-2', name: 'Dal Makhani Slow-Cooked', img: '🍲', price: 35, cal: 240, type: 'veg' },
        { id: 'd-3', name: 'Panchmel Rajasthani Dal', img: '🥣', price: 30, cal: 190, type: 'veg' },
        { id: 'd-4', name: 'Gujarati Khatti Meethi Dal', img: '🍛', price: 25, cal: 150, type: 'veg' }
      ],
      breadsAndRice: [
        { id: 'b-1', name: '4 Whole Wheat Desi Ghee Phulkas', img: '🫓', price: 25, cal: 240 },
        { id: 'b-2', name: '2 Hot Bajra Rotis with White Makhan', img: '🫓', price: 30, cal: 280 },
        { id: 'b-3', name: '2 Multigrain Jowar/Ragi Rotis', img: '🫓', price: 30, cal: 220 },
        { id: 'b-4', name: 'Steamed Long-Grain Basmati Rice', img: '🍚', price: 20, cal: 190 },
        { id: 'b-5', name: 'Aromatic Jeera Basmati Rice', img: '🍚', price: 25, cal: 210 }
      ],
      accompaniments: [
        { id: 'a-1', name: 'Boondi Raita & Roasted Papad', img: '🥗', price: 20, cal: 90 },
        { id: 'a-2', name: 'Fresh Green Salad & Mint Chutney', img: '🥒', price: 15, cal: 40 },
        { id: 'a-3', name: 'Warm Kesari Gulab Jamun (2 pcs)', img: '🍩', price: 30, cal: 210 },
        { id: 'a-4', name: 'Desi Ghee Rose Gond Churma', img: '🍯', price: 35, cal: 250 },
        { id: 'a-5', name: 'Spiced Buttermilk (Chaas)', img: '🥛', price: 15, cal: 50 }
      ]
    }
  });
});

// GET /api/menu - Get all dishes with optional filters
router.get('/', (req, res) => {
  const { providerId, category, cuisine, mealType, inStockOnly } = req.query;
  const store = db.get();
  let list = [...(store.menuItems || [])];

  if (providerId) {
    list = list.filter(m => m.providerId === providerId);
  }
  if (category && category !== 'all') {
    list = list.filter(m => (m.category || '').toLowerCase() === category.toLowerCase());
  }
  if (cuisine && cuisine !== 'all') {
    list = list.filter(m => (m.cuisine || '').toLowerCase() === cuisine.toLowerCase());
  }
  if (mealType && mealType !== 'all') {
    list = list.filter(m => m.mealType === mealType);
  }
  if (inStockOnly === 'true') {
    list = list.filter(m => m.availability);
  }

  res.json({
    success: true,
    data: list
  });
});

// GET /api/menu/:id
router.get('/:id', (req, res) => {
  const store = db.get();
  const item = store.menuItems.find(m => m.id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found.' });
  }
  res.json({ success: true, data: item });
});

// POST /api/menu - Add new dish
router.post('/', requireAuth, requireRole('PROVIDER', 'ADMIN'), (req, res) => {
  const {
    providerId,
    name,
    description,
    image,
    category = 'Thali',
    cuisine = 'North Indian',
    mealType = 'veg',
    price,
    calories,
    protein,
    carbs,
    fat,
    availableDays,
    preparationTime
  } = req.body;

  if (!name || price === undefined || price === null) {
    return res.status(400).json({ success: false, message: 'Dish name and price are required.' });
  }

  const store = db.get();
  let targetProvId = providerId;

  if (req.user.role === 'PROVIDER') {
    const prov = store.providers.find(p => p.userId === req.user.id);
    if (!prov) {
      return res.status(400).json({ success: false, message: 'No provider profile found for this user.' });
    }
    targetProvId = prov.id;
  }

  const newDish = {
    id: `dish_${Date.now()}`,
    providerId: targetProvId || 'prov_1',
    name: name.trim(),
    description: description || 'Fresh homestyle preparation cooked with love.',
    image: image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    category,
    cuisine,
    mealType,
    price: Number(price),
    calories: Number(calories) || 520,
    protein: protein || '18g',
    carbs: carbs || '65g',
    fat: fat || '14g',
    availability: true,
    availableDays: Array.isArray(availableDays) ? availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    preparationTime: preparationTime || '20 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.menuItems.unshift(newDish);
  db.save(store);

  res.status(201).json({
    success: true,
    message: `"${name}" added to menu successfully!`,
    data: newDish
  });
});

// PUT /api/menu/:id - Edit dish
router.put('/:id', optionalAuth, (req, res) => {
  const store = db.get();
  const dish = store.menuItems.find(m => m.id === req.params.id);

  if (!dish) {
    return res.status(404).json({ success: false, message: 'Dish not found.' });
  }

  const {
    name,
    description,
    image,
    category,
    cuisine,
    mealType,
    price,
    calories,
    protein,
    carbs,
    fat,
    availability,
    availableDays,
    preparationTime
  } = req.body;

  if (name) dish.name = name.trim();
  if (description) dish.description = description;
  if (image) dish.image = image;
  if (category) dish.category = category;
  if (cuisine) dish.cuisine = cuisine;
  if (mealType) dish.mealType = mealType;
  if (price !== undefined) dish.price = Number(price);
  if (calories !== undefined) dish.calories = Number(calories);
  if (protein) dish.protein = protein;
  if (carbs) dish.carbs = carbs;
  if (fat) dish.fat = fat;
  if (availability !== undefined) dish.availability = Boolean(availability);
  if (availableDays) dish.availableDays = Array.isArray(availableDays) ? availableDays : [availableDays];
  if (preparationTime) dish.preparationTime = preparationTime;
  dish.updatedAt = new Date().toISOString();

  db.save(store);

  res.json({
    success: true,
    message: `"${dish.name}" updated successfully!`,
    data: dish
  });
});

// PATCH /api/menu/:id/toggle-stock
router.patch('/:id/toggle-stock', optionalAuth, (req, res) => {
  const store = db.get();
  const dish = store.menuItems.find(m => m.id === req.params.id);

  if (!dish) {
    return res.status(404).json({ success: false, message: 'Dish not found.' });
  }

  dish.availability = !dish.availability;
  dish.updatedAt = new Date().toISOString();
  db.save(store);

  res.json({
    success: true,
    message: `Dish availability changed to ${dish.availability ? 'IN STOCK' : 'OUT OF STOCK'}`,
    data: dish
  });
});

// DELETE /api/menu/:id
router.delete('/:id', optionalAuth, (req, res) => {
  const store = db.get();
  const index = store.menuItems.findIndex(m => m.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Dish not found.' });
  }

  const dish = store.menuItems[index];
  store.menuItems.splice(index, 1);
  db.save(store);

  res.json({
    success: true,
    message: `"${dish.name}" removed from menu.`
  });
});

export default router;
