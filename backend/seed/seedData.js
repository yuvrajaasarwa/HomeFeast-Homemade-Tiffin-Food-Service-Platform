import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);
const defaultHash = bcrypt.hashSync('password123', salt);

export const seedDatabase = () => {
  const users = [
    {
      id: 'usr_admin',
      name: 'Priya Sharma (Platform Admin)',
      email: 'admin@homefeast.test',
      phone: '+91 98290 00001',
      passwordHash: defaultHash,
      role: 'ADMIN',
      city: 'jaipur',
      area: 'C-Scheme',
      address: 'HomeFeast HQ, 502 Apex Tower, Tonk Road, Jaipur',
      status: 'ACTIVE',
      createdAt: '2026-01-01T10:00:00Z',
      updatedAt: '2026-01-01T10:00:00Z'
    },
    {
      id: 'usr_provider_1',
      name: 'Sunita Agarwal',
      email: 'provider@homefeast.test',
      phone: '+91 98290 10001',
      passwordHash: defaultHash,
      role: 'PROVIDER',
      city: 'jaipur',
      area: 'Malviya Nagar',
      address: 'Plot 42, Sector 3, Malviya Nagar, Jaipur',
      status: 'ACTIVE',
      createdAt: '2026-01-05T08:30:00Z',
      updatedAt: '2026-01-05T08:30:00Z'
    },
    {
      id: 'usr_customer_1',
      name: 'Aarav Sharma',
      email: 'customer@homefeast.test',
      phone: '+91 98290 20001',
      passwordHash: defaultHash,
      role: 'CUSTOMER',
      city: 'ajmer',
      area: 'Ramganj & Subhash Nagar',
      address: 'Flat 304, Royal Palms, Panchsheel Nagar, Ajmer',
      status: 'ACTIVE',
      createdAt: '2026-01-10T12:00:00Z',
      updatedAt: '2026-01-10T12:00:00Z'
    },
    {
      id: 'usr_rider_1',
      name: 'Vikas Saini',
      email: 'rider@homefeast.test',
      phone: '+91 98290 30001',
      passwordHash: defaultHash,
      role: 'RIDER',
      city: 'jaipur',
      area: 'Malviya Nagar Hub',
      address: 'Shop 12, Rajasthan Delivery Hub, Malviya Nagar, Jaipur',
      vehicleType: 'EV Scooter (Eco Delivery)',
      vehicleNumber: 'RJ 14 EV 4022',
      rating: 4.95,
      totalDeliveries: 428,
      dutyStatus: 'ONLINE',
      status: 'ACTIVE',
      createdAt: '2026-01-08T07:00:00Z',
      updatedAt: '2026-01-08T07:00:00Z'
    }
  ];

  // 22 Verified Home Cooks Across All Cuisines, Diets & Pass Types
  const providers = [
    // 1. North Indian & Rajasthani Pure Veg
    {
      id: 'prov_1',
      userId: 'usr_provider_1',
      businessName: 'Annapurna Homestyle Rasoi',
      ownerName: 'Sunita Agarwal',
      email: 'sunita.rasoi@homefeast.test',
      phone: '+91 98290 10001',
      description: 'Pure vegetarian North Indian & Marwari homestyle meals cooked in pure cow ghee with hand-rolled soft phulkas, dal tadka, paneer and seasonal subzis.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      cuisines: ['North Indian', 'Rajasthani', 'Pure Veg', 'Healthy'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Panchsheel Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'delhi'],
        localities: ['Panchsheel Nagar', 'Civil Lines', 'Ramganj', 'Subhash Nagar', 'Ana Sagar', 'Adarsh Nagar', 'Malviya Nagar', 'Mansarovar'],
        deliveryRadiusKm: 12
      },
      deliveryTimings: { lunch: '12:15 PM - 01:45 PM', dinner: '07:30 PM - 09:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.96,
      totalReviews: 184,
      startingPrice: 85,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 80,
      fssaiNumber: '10023011000941',
      hygieneScore: '99.4%',
      packagingType: '100% Food-Grade Insulated Stainless Steel Dabba',
      createdAt: '2026-01-05T08:30:00Z'
    },

    // 2. Traditional Rajasthani Marwari
    {
      id: 'prov_2',
      userId: 'usr_prov_2',
      businessName: 'Dadi Ki Rasoi (Traditional Marwari)',
      ownerName: 'Kamla Devi Shekhawat',
      email: 'kamla.dadi@homefeast.test',
      phone: '+91 98290 10002',
      description: 'Grandmother’s authentic wood-fired Rajasthani thalis: Dal Baati Churma, Govind Gatte, Ker Sangri & hot Bajra Rotis with fresh white butter.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Rajasthani', 'North Indian', 'Marwari', 'Traditional'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Civil Lines',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Civil Lines', 'Panchsheel Nagar', 'Ramganj', 'Subhash Nagar', 'Ana Sagar', 'Adarsh Nagar', 'Mansarovar'],
        deliveryRadiusKm: 12
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:00 PM - 08:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.98,
      totalReviews: 242,
      startingPrice: 110,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 100,
      fssaiNumber: '10023011000452',
      hygieneScore: '99.8%',
      packagingType: 'Traditional Brass & Stainless Steel Insulated Tiffin',
      createdAt: '2026-01-06T10:00:00Z'
    },

    // 3. Punjabi & North Indian (Pure Veg + Non-Veg)
    {
      id: 'prov_3',
      userId: 'usr_prov_3',
      businessName: 'Punjab Mail Tiffin Hub',
      ownerName: 'Manpreet Kaur',
      email: 'manpreet.punjab@homefeast.test',
      phone: '+91 98290 10003',
      description: 'Hearty Punjabi homestyle meals with slow-simmered Rajma, Pindi Chole, Butter Chicken, Paneer Butter Masala & soft tawa parathas.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Punjabi', 'North Indian', 'Comfort Food'],
      mealType: 'both',
      city: 'ajmer',
      area: 'Ramganj & Subhash Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'delhi'],
        localities: ['Ramganj', 'Subhash Nagar', 'Panchsheel Nagar', 'Civil Lines', 'Adarsh Nagar', 'Ana Sagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:30 PM - 02:00 PM', dinner: '07:30 PM - 09:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.94,
      totalReviews: 195,
      startingPrice: 115,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 90,
      fssaiNumber: '10023011000889',
      hygieneScore: '99.2%',
      packagingType: '304 Insulated Airtight Container Box',
      createdAt: '2026-01-07T11:00:00Z'
    },

    // 4. Jain & Ayurvedic Satvik
    {
      id: 'prov_4',
      userId: 'usr_prov_4',
      businessName: 'Satvik Rasoi (Jain & Ayurvedic)',
      ownerName: 'Sharda Bai Jain',
      email: 'sharda.satvik@homefeast.test',
      phone: '+91 98290 10004',
      description: 'Strict 100% Satvik & Jain-compliant recipes prepared without onion, garlic, or root vegetables. Wholesome Ayurvedic digestive spices.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Jain', 'Satvik', 'Ayurvedic', 'Pure Veg'],
      mealType: 'jain',
      city: 'ajmer',
      area: 'Panchsheel Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Panchsheel Nagar', 'Vaishali Nagar', 'Civil Lines', 'Ana Sagar', 'Adarsh Nagar', 'Subhash Nagar', 'Ramganj'],
        deliveryRadiusKm: 12
      },
      deliveryTimings: { lunch: '11:45 AM - 01:15 PM', dinner: '06:30 PM - 08:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.97,
      totalReviews: 168,
      startingPrice: 95,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 80,
      fssaiNumber: '10023011000312',
      hygieneScore: '99.9%',
      packagingType: 'Stainless Steel Insulated Dabba',
      createdAt: '2026-01-08T09:30:00Z'
    },

    // 5. Rajasthani Marwari Pushkar
    {
      id: 'prov_5',
      userId: 'usr_prov_5',
      businessName: 'Pushkar Road Marwari Bhojanalaya',
      ownerName: 'Rukmani Devi Sharma',
      email: 'rukmani.marwar@homefeast.test',
      phone: '+91 98290 10015',
      description: 'Homestyle Ajmer & Pushkar traditional daily thalis: Sev Tamatar, Kadhi Pakoda, Methi Theplas, Gatta Curry and hot Phulkas with green chutney.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Rajasthani', 'Marwari', 'North Indian', 'Homestyle'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Ana Sagar & Pushkar Road',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Ana Sagar', 'Pushkar Road', 'Panchsheel Nagar', 'Ramganj', 'Civil Lines', 'Subhash Nagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:00 PM - 08:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.95,
      totalReviews: 142,
      startingPrice: 75,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 70,
      fssaiNumber: '10023011000418',
      hygieneScore: '99.6%',
      packagingType: 'Insulated 3-Tier Steel Tiffin',
      createdAt: '2026-01-10T08:00:00Z'
    },

    // 6. Student & Budget Friendly
    {
      id: 'prov_6',
      userId: 'usr_prov_6',
      businessName: 'Maa Saraswati Student & Budget Rasoi',
      ownerName: 'Anita Joshi',
      email: 'anita.student@homefeast.test',
      phone: '+91 98290 10016',
      description: 'Pocket-friendly homestyle tiffins for college students & office goers: 4 soft rotis, dal tadka, seasonal sabzi, steamed rice, and salad.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
      cuisines: ['North Indian', 'Student Special', 'Budget Homestyle'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Adarsh Nagar & MDS Area',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Adarsh Nagar', 'Panchsheel Nagar', 'MDS University Area', 'Subhash Nagar', 'Ramganj', 'Civil Lines'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:15 PM - 01:45 PM', dinner: '07:30 PM - 09:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.92,
      totalReviews: 210,
      startingPrice: 60,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 60,
      fssaiNumber: '10023011000523',
      hygieneScore: '99.3%',
      packagingType: 'Eco Steel Tiffin Box',
      createdAt: '2026-01-12T09:00:00Z'
    },

    // 7. Mughlai & North Indian Non-Veg
    {
      id: 'prov_7',
      userId: 'usr_prov_7',
      businessName: 'Khwaja Garib Nawaz Homestyle Mughlai',
      ownerName: 'Begum Salma Qureshi',
      email: 'salma.mughlai@homefeast.test',
      phone: '+91 98290 10017',
      description: 'Slow-cooked traditional Ajmer homestyle non-veg: Mutton Nihari, Chicken Dum Biryani, Shami Kebabs, and soft Khamiri Rotis.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Mughlai', 'North Indian', 'Non-Veg', 'Biryani'],
      mealType: 'non_veg',
      city: 'ajmer',
      area: 'Ramganj & Subhash Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Ramganj', 'Subhash Nagar', 'Dargah Bazar', 'Civil Lines', 'Panchsheel Nagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:30 PM - 02:00 PM', dinner: '07:30 PM - 09:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.96,
      totalReviews: 178,
      startingPrice: 135,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 110,
      fssaiNumber: '10023011000634',
      hygieneScore: '99.5%',
      packagingType: 'Thermal Sealed Hot Containers',
      createdAt: '2026-01-14T10:00:00Z'
    },

    // 8. Healthy Diet & Diabetic Care
    {
      id: 'prov_8',
      userId: 'usr_prov_8',
      businessName: 'Swasthya Diet & Diabetic Care Meals',
      ownerName: 'Dr. Neha Goyal & Cook Rama Devi',
      email: 'swasthya.diet@homefeast.test',
      phone: '+91 98290 10018',
      description: 'Certified low-oil, low-GI diabetic & fitness meal passes: Multigrain rotis (Jowar/Ragi), sprouted salad, Lauki Dal, Paneer Bhurji & buttermilk.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Healthy', 'Diet & Fitness', 'Diabetic Friendly', 'High Protein'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Panchsheel Nagar & Vaishali',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Panchsheel Nagar', 'Vaishali', 'Civil Lines', 'Adarsh Nagar', 'Ana Sagar', 'Subhash Nagar', 'Ramganj'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:00 PM - 08:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.98,
      totalReviews: 156,
      startingPrice: 110,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 90,
      fssaiNumber: '10023011000745',
      hygieneScore: '99.9%',
      packagingType: 'BPA-Free Airtight Steel Dabba',
      createdAt: '2026-01-15T11:00:00Z'
    },

    // 9. Sindhi Rasoi
    {
      id: 'prov_9',
      userId: 'usr_prov_9',
      businessName: 'Sindhi Rasoi & Dal Pakwan Ghar',
      ownerName: 'Mohini Advani',
      email: 'mohini.sindhi@homefeast.test',
      phone: '+91 98290 10019',
      description: 'Authentic Sindhi home kitchen: Crispy Dal Pakwan, Sindhi Kadhi with sweet boondi & rice, Sai Bhaji, Aloo Tuk, and Koki with curd.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Sindhi', 'North Indian', 'Homestyle'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Madar Gate & Ramganj',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Madar Gate', 'Ramganj', 'Civil Lines', 'Panchsheel Nagar', 'Subhash Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:15 PM - 01:45 PM', dinner: '07:30 PM - 09:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.93,
      totalReviews: 128,
      startingPrice: 85,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 75,
      fssaiNumber: '10023011000856',
      hygieneScore: '99.4%',
      packagingType: 'Stainless Steel Insulated Dabba',
      createdAt: '2026-01-17T08:30:00Z'
    },

    // 10. Pure Ghee Satvik & Jain
    {
      id: 'prov_10',
      userId: 'usr_prov_10',
      businessName: 'Bhakti Rasoi (Vrindavan Pure Desi Ghee)',
      ownerName: 'Radhika Dasi',
      email: 'radhika.bhakti@homefeast.test',
      phone: '+91 98290 10020',
      description: 'Pure Desi Ghee Satvik Prasadam: Moong Dal Khichdi, Rajasthani Kadhi, Paneer Tamatar, Soft Phulkas & Kheer. 100% No Onion-Garlic.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Satvik', 'Jain', 'Pure Ghee', 'Rajasthani'],
      mealType: 'jain',
      city: 'ajmer',
      area: 'Pushkar Road & Ana Sagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Pushkar Road', 'Ana Sagar', 'Panchsheel Nagar', 'Civil Lines', 'Ramganj', 'Subhash Nagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 12
      },
      deliveryTimings: { lunch: '11:30 AM - 01:00 PM', dinner: '06:30 PM - 08:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.99,
      totalReviews: 220,
      startingPrice: 105,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 85,
      fssaiNumber: '10023011000967',
      hygieneScore: '100%',
      packagingType: 'Sanitized Brass Hot-Pot Box',
      createdAt: '2026-01-18T10:00:00Z'
    },

    // 11. Rajasthani & North Indian Non-Veg (Laal Maas)
    {
      id: 'prov_11',
      userId: 'usr_prov_11',
      businessName: 'Royal Rajputana Non-Veg & Laal Maas',
      ownerName: 'Suman Rathore',
      email: 'suman.rajput@homefeast.test',
      phone: '+91 98290 10021',
      description: 'Heritage Rajput homestyle non-vegetarian thalis: Authentic Mathania Mirch Laal Maas, Jungli Chicken, Desi Ghee Keema Baati & Missi Rotis.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Rajasthani', 'North Indian', 'Non-Veg', 'Royal Rajput'],
      mealType: 'non_veg',
      city: 'ajmer',
      area: 'Civil Lines & Cantt',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Civil Lines', 'Cantt', 'Panchsheel Nagar', 'Ramganj', 'Subhash Nagar', 'Adarsh Nagar', 'Ana Sagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:30 PM - 02:00 PM', dinner: '07:30 PM - 09:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.97,
      totalReviews: 189,
      startingPrice: 150,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 120,
      fssaiNumber: '10023011000178',
      hygieneScore: '99.7%',
      packagingType: 'Stainless Steel Insulated Dabba',
      createdAt: '2026-01-20T12:00:00Z'
    },

    // 12. Comfort North Indian Homestyle
    {
      id: 'prov_12',
      userId: 'usr_prov_12',
      businessName: 'Maa Ki Mamta Homestyle Tiffins',
      ownerName: 'Geeta Devi Verma',
      email: 'geeta.mamta@homefeast.test',
      phone: '+91 98290 10022',
      description: 'Daily changing homestyle comfort food just like mom makes: 4 ghee phulkas, 2 seasonal subzis, Arhar Dal Tadka, Jeera Rice, pickle & salad.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80',
      cuisines: ['North Indian', 'Homestyle', 'Pure Veg', 'Comfort Food'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Subhash Nagar & Ramganj',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Subhash Nagar', 'Ramganj', 'Panchsheel Nagar', 'Adarsh Nagar', 'Civil Lines', 'Ana Sagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:15 PM - 08:45 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.95,
      totalReviews: 175,
      startingPrice: 70,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 65,
      fssaiNumber: '10023011000289',
      hygieneScore: '99.6%',
      packagingType: 'Eco Food-Grade Steel Box',
      createdAt: '2026-01-22T09:00:00Z'
    },

    // 13. High-Protein Fitness & Keto
    {
      id: 'prov_13',
      userId: 'usr_prov_13',
      businessName: 'FitFeast Keto & High-Protein Kitchen',
      ownerName: 'Chef Megha Saxena',
      email: 'megha.fitfeast@homefeast.test',
      phone: '+91 98290 10023',
      description: 'High-protein fitness meal subscriptions: Grilled Tofu/Paneer Steaks, Soya Chunks Curry, Quinoa Bowls, Almond Flour Rotis & Boiled Egg Curry.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Healthy', 'High Protein', 'Keto', 'North Indian'],
      mealType: 'both',
      city: 'ajmer',
      area: 'Panchsheel Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Panchsheel Nagar', 'Civil Lines', 'Ramganj', 'Subhash Nagar', 'Adarsh Nagar', 'Ana Sagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:15 PM - 01:45 PM', dinner: '07:00 PM - 08:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.96,
      totalReviews: 164,
      startingPrice: 140,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 100,
      fssaiNumber: '10023011000390',
      hygieneScore: '99.8%',
      packagingType: 'Calorie-Portioned Steel Container',
      createdAt: '2026-01-24T10:00:00Z'
    },

    // 14. Marwar Royal Bawarchi Khana
    {
      id: 'prov_14',
      userId: 'usr_prov_14',
      businessName: 'Marwar Royal Bawarchi Khana',
      ownerName: 'Chef Rajesh Meena',
      email: 'rajesh.bawarchi@homefeast.test',
      phone: '+91 98290 10010',
      description: 'Traditional Marwari royal recipes: Pithore Ki Sabzi, Bikaneri Mangodi Curry, Ker Sangri Dakh, and fresh Tandoori Missi Rotis in desi ghee.',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Rajasthani', 'North Indian', 'Marwari', 'Pure Veg'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Ana Sagar & Civil Lines',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur'],
        localities: ['Ana Sagar', 'Civil Lines', 'Panchsheel Nagar', 'Ramganj', 'Subhash Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:30 PM - 09:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.95,
      totalReviews: 180,
      startingPrice: 115,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 95,
      fssaiNumber: '10023011000501',
      hygieneScore: '99.5%',
      packagingType: 'Multi-Tier Steel Tiffin',
      createdAt: '2026-01-25T11:00:00Z'
    },

    // 15. South Indian Homestyle (Udupi / Tamil)
    {
      id: 'prov_15',
      userId: 'usr_prov_15',
      businessName: 'Dakshin Flavors (South Indian Homestyle)',
      ownerName: 'Meenakshi Sundaram',
      email: 'meenakshi.south@homefeast.test',
      phone: '+91 98290 10006',
      description: 'Authentic South Indian home meals: Podi Idli, Masala Dosa, Drumstick Sambar, Tomato Pepper Rasam, Poriyal, Lemon Rice & Curd Rice.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
      cuisines: ['South Indian', 'Pure Veg', 'Healthy'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Civil Lines & Panchsheel',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'bengaluru'],
        localities: ['Civil Lines', 'Panchsheel Nagar', 'Ramganj', 'Subhash Nagar', 'Adarsh Nagar', 'Ana Sagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:45 PM', dinner: '07:30 PM - 09:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.95,
      totalReviews: 167,
      startingPrice: 110,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 85,
      fssaiNumber: '10023011000654',
      hygieneScore: '99.6%',
      packagingType: 'Banana Leaf Lined Steel Tiffin',
      createdAt: '2026-01-26T12:00:00Z'
    },

    // 16. Bengali Homestyle
    {
      id: 'prov_16',
      userId: 'usr_prov_16',
      businessName: 'Bengali Homestyle Rasoi',
      ownerName: 'Kavita Roy',
      email: 'kavita.kolkata@homefeast.test',
      phone: '+91 98290 10009',
      description: 'Authentic Bengali home cooking: Shorshe Maach, Aloo Posto, Cholar Dal with Luchi, Kosha Mangsho & Gobindobhog Rice with Mishti Doi.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Bengali', 'Non-Veg', 'Fish & Seafood', 'Homestyle'],
      mealType: 'non_veg',
      city: 'ajmer',
      area: 'Adarsh Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'delhi'],
        localities: ['Adarsh Nagar', 'Civil Lines', 'Panchsheel Nagar', 'Ramganj', 'Subhash Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:30 PM - 02:00 PM', dinner: '07:30 PM - 09:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.94,
      totalReviews: 153,
      startingPrice: 145,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 100,
      fssaiNumber: '10023011000765',
      hygieneScore: '99.5%',
      packagingType: 'Leakproof Airtight Thermal Containers',
      createdAt: '2026-01-27T13:00:00Z'
    },

    // 17. [NEW] GUJARATI & SURTI HOMESTYLE
    {
      id: 'prov_17',
      userId: 'usr_prov_17',
      businessName: 'Lalita Ben’s Kathiyawadi & Surti Rasoi',
      ownerName: 'Lalita Ben Joshi',
      email: 'lalita.gujarati@homefeast.test',
      phone: '+91 98290 10024',
      description: 'Traditional Gujarati & Kathiyawadi homestyle meals: Ringna No Olo, Bajri Rotla with Makhan & Gud, Sev Tameta, Khatti Meethi Gujarati Dal, Thepla & Vaghareli Khichdi.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Gujarati', 'Jain', 'Pure Veg', 'Kathiyawadi'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Panchsheel Nagar & Civil Lines',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'ahmedabad'],
        localities: ['Panchsheel Nagar', 'Civil Lines', 'Ramganj', 'Subhash Nagar', 'Ana Sagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:15 PM - 08:45 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.97,
      totalReviews: 186,
      startingPrice: 90,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 80,
      fssaiNumber: '10023011000876',
      hygieneScore: '99.7%',
      packagingType: '3-Tier Stainless Steel Tiffin Box',
      createdAt: '2026-01-28T09:00:00Z'
    },

    // 18. [NEW] MAHARASHTRIAN POLI BHAJI & VARAN BHAAT
    {
      id: 'prov_18',
      userId: 'usr_prov_18',
      businessName: 'Aaji Chi Rasoi (Maharashtrian Poli Bhaji)',
      ownerName: 'Anuradha Kulkarni',
      email: 'anuradha.marathi@homefeast.test',
      phone: '+91 98290 10025',
      description: 'Authentic Maharashtrian home tiffins: Hot soft Poli (Chapatis), Pithla Bhakri, Varan Bhaat with pure Sajuk Tup, Batatyachi Bhaji, Kothimbir Vadi & Solkadhi.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Maharashtrian', 'North Indian', 'Pure Veg', 'Comfort Food'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Civil Lines & Ramganj',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'pune', 'mumbai'],
        localities: ['Civil Lines', 'Ramganj', 'Panchsheel Nagar', 'Subhash Nagar', 'Ana Sagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:15 PM - 01:45 PM', dinner: '07:30 PM - 09:00 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.96,
      totalReviews: 172,
      startingPrice: 80,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 75,
      fssaiNumber: '10023011000987',
      hygieneScore: '99.6%',
      packagingType: 'Insulated Stainless Steel Box',
      createdAt: '2026-01-29T10:00:00Z'
    },

    // 19. [NEW] PUNJABI DHABA (DESI GHEE BUTTER CHICKEN & DAL MAKHANI - BOTH)
    {
      id: 'prov_19',
      userId: 'usr_prov_19',
      businessName: 'Amritsari Desi Ghee Dhaba Tiffins',
      ownerName: 'Jasbir Kaur & Simranjit Singh',
      email: 'jasbir.amritsar@homefeast.test',
      phone: '+91 98290 10026',
      description: 'Authentic Amritsari slow-cooked Dal Makhani, Paneer Kulcha Thali, Homestyle Butter Chicken, Sarson Da Saag & Makki Di Roti with white makhan.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Punjabi', 'North Indian', 'Non-Veg', 'Pure Veg'],
      mealType: 'both',
      city: 'ajmer',
      area: 'Ramganj & Subhash Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'delhi'],
        localities: ['Ramganj', 'Subhash Nagar', 'Panchsheel Nagar', 'Civil Lines', 'Adarsh Nagar', 'Ana Sagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:30 PM - 02:00 PM', dinner: '07:30 PM - 09:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.98,
      totalReviews: 215,
      startingPrice: 125,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 95,
      fssaiNumber: '10023011001098',
      hygieneScore: '99.8%',
      packagingType: 'Thermal Double-Walled Steel Tiffin',
      createdAt: '2026-01-30T11:00:00Z'
    },

    // 20. [NEW] SOUTH INDIAN ANDHRA & UDUPI
    {
      id: 'prov_20',
      userId: 'usr_prov_20',
      businessName: 'Padmavathi Amma Tiffins (Andhra & Udupi)',
      ownerName: 'Padmavathi Amma',
      email: 'padmavathi.south@homefeast.test',
      phone: '+91 98290 10027',
      description: 'Traditional Andhra & Udupi home cooking: Gongura Rice, Pulihora, Steamed Ghee Idli with Peanut Chutney, Tomato Pappu Dal, Avial & Curd Rice.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
      cuisines: ['South Indian', 'Healthy', 'Pure Veg', 'Homestyle'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Panchsheel Nagar & Ana Sagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'bengaluru'],
        localities: ['Panchsheel Nagar', 'Ana Sagar', 'Civil Lines', 'Ramganj', 'Subhash Nagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:00 PM - 01:30 PM', dinner: '07:00 PM - 08:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.96,
      totalReviews: 160,
      startingPrice: 95,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 80,
      fssaiNumber: '10023011001109',
      hygieneScore: '99.5%',
      packagingType: 'Banana Leaf Lined Eco Boxes',
      createdAt: '2026-02-01T08:30:00Z'
    },

    // 21. [NEW] GUJARATI & JAIN SHUDDH SHAKAHARI
    {
      id: 'prov_21',
      userId: 'usr_prov_21',
      businessName: 'Shree Krishna Gujarati Bhojnalaya',
      ownerName: 'Hansa Patel & Bhavesh Patel',
      email: 'hansa.patel@homefeast.test',
      phone: '+91 98290 10028',
      description: 'Wholesome Gujarati Thali with Khandvi, Sev Khamani, Surti Undhiyu (seasonal), Phulka Roti with Desi Ghee, Sweet Kadhi & Moong Dal Halwa.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Gujarati', 'Jain', 'Pure Veg', 'North Indian'],
      mealType: 'veg',
      city: 'ajmer',
      area: 'Civil Lines & Panchsheel',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'ahmedabad'],
        localities: ['Civil Lines', 'Panchsheel Nagar', 'Ramganj', 'Subhash Nagar', 'Ana Sagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '11:45 AM - 01:15 PM', dinner: '06:45 PM - 08:15 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.97,
      totalReviews: 179,
      startingPrice: 100,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 85,
      fssaiNumber: '10023011001210',
      hygieneScore: '99.9%',
      packagingType: 'Stainless Steel Insulated Dabba',
      createdAt: '2026-02-02T10:00:00Z'
    },

    // 22. [NEW] MAHARASHTRIAN & KONKAN (VEG & NON-VEG FISH/CHICKEN)
    {
      id: 'prov_22',
      userId: 'usr_prov_22',
      businessName: 'Geeta Tai’s Konkani & Puneri Tiffin Ghar',
      ownerName: 'Geeta Vaze',
      email: 'geeta.vaze@homefeast.test',
      phone: '+91 98290 10029',
      description: 'Coastal Konkan & Puneri homestyle meals: Kolhapuri Sukka Chicken, Fresh Malvani Surmai Curry with Bhakri, Dalimbi Usal & Amti Bhaat.',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      cuisines: ['Maharashtrian', 'Non-Veg', 'North Indian', 'Fish & Seafood'],
      mealType: 'both',
      city: 'ajmer',
      area: 'Ramganj & Subhash Nagar',
      serviceArea: {
        city: 'ajmer',
        cities: ['ajmer', 'jaipur', 'mumbai', 'pune'],
        localities: ['Ramganj', 'Subhash Nagar', 'Civil Lines', 'Panchsheel Nagar', 'Adarsh Nagar'],
        deliveryRadiusKm: 10
      },
      deliveryTimings: { lunch: '12:30 PM - 02:00 PM', dinner: '07:30 PM - 09:30 PM' },
      approvalStatus: 'APPROVED',
      rating: 4.95,
      totalReviews: 165,
      startingPrice: 130,
      availableMealPlans: ['DAILY', 'WEEKLY', 'MONTHLY'],
      isAcceptingOrders: true,
      minOrder: 100,
      fssaiNumber: '10023011001321',
      hygieneScore: '99.6%',
      packagingType: 'Double-Sealed Insulated Container',
      createdAt: '2026-02-03T11:30:00Z'
    }
  ];

  // Menu Items for all providers
  const menuItems = [
    {
      id: 'dish_101',
      providerId: 'prov_1',
      name: 'Executive Homestyle Thali',
      description: '4 Whole Wheat Desi Ghee Phulkas, Paneer Butter Masala, Dal Tadka, Steamed Basmati Rice, Fresh Green Salad, Papad & Gulab Jamun.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      category: 'Thali',
      cuisine: 'North Indian',
      mealType: 'veg',
      price: 135,
      calories: 620,
      protein: '22g',
      carbs: '82g',
      fat: '18g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '20 mins',
      createdAt: '2026-01-05T09:00:00Z'
    },
    {
      id: 'dish_1701',
      providerId: 'prov_17',
      name: 'Authentic Kathiyawadi Ringna No Olo & Rotla',
      description: 'Smoky roasted eggplant mash cooked with garlic & spices, served with 2 hot Bajra Rotla, fresh white butter, jaggery and chaas.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      category: 'Thali',
      cuisine: 'Gujarati',
      mealType: 'veg',
      price: 120,
      calories: 540,
      protein: '14g',
      carbs: '76g',
      fat: '16g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '20 mins',
      createdAt: '2026-01-28T09:30:00Z'
    },
    {
      id: 'dish_1801',
      providerId: 'prov_18',
      name: 'Maharashtrian Pithla Bhakri & Thecha Meal',
      description: 'Steaming hot Besan Pithla cooked with green chillies & garlic, served with 2 Jowar Bhakris, fiery Hirvi Mirchi Thecha and kanda.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
      category: 'Thali',
      cuisine: 'Maharashtrian',
      mealType: 'veg',
      price: 110,
      calories: 490,
      protein: '16g',
      carbs: '72g',
      fat: '12g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '15 mins',
      createdAt: '2026-01-29T10:30:00Z'
    },
    {
      id: 'dish_1901',
      providerId: 'prov_19',
      name: 'Amritsari Butter Chicken & Dal Makhani Combo',
      description: 'Slow-simmered rich creamy Dal Makhani and tender Butter Chicken served with 3 butter phulkas, jeera rice & pickled onions.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      category: 'Thali',
      cuisine: 'Punjabi',
      mealType: 'non_veg',
      price: 165,
      calories: 720,
      protein: '36g',
      carbs: '68g',
      fat: '26g',
      availability: true,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      preparationTime: '20 mins',
      createdAt: '2026-01-30T11:30:00Z'
    }
  ];

  // Meal Passes for Subscriptions (4 Total Passes)
  const mealPlans = [
    {
      id: 'plan_1',
      providerId: 'prov_1',
      name: '7-Day Homestyle Trial Discovery Pass',
      tagline: 'Taste authentic North Indian homestyle meals with zero long-term lock-in.',
      description: '7 hot homestyle meals: 4 fresh tawa phulkas with desi ghee, dal tadka, seasonal sabzi, steamed rice, and fresh salad.',
      planType: 'WEEKLY',
      durationDays: 7,
      price: 599,
      totalPrice: 599,
      pricePerMeal: 85,
      savings: 'Save ₹100',
      badge: 'TRIAL PACK',
      idealFor: 'New customers testing daily food taste & quality',
      popular: false,
      features: [
        '7 Fresh Daily Homestyle Meals',
        '4 Desi Ghee Phulkas + Dal + Sabzi',
        'Zero Penalty Pause / Date Skip',
        'Free Hot Delivery in Insulated Dabba'
      ],
      status: 'ACTIVE'
    },
    {
      id: 'plan_2',
      providerId: 'prov_4',
      name: '14-Day Healthy Diet & Satvik Pass',
      tagline: 'Light, low-oil, 100% Satvik & Jain-compliant homestyle tiffin meals.',
      description: '14 days of wholesome digestive meals prepared in pure cow ghee with zero onion-garlic. High protein & light on stomach.',
      planType: 'WEEKLY',
      durationDays: 14,
      price: 1190,
      totalPrice: 1190,
      pricePerMeal: 85,
      savings: 'Save ₹210',
      badge: 'SATVIK & JAIN',
      idealFor: 'Health-conscious, elderly & Jain households',
      popular: false,
      features: [
        '100% Pure Satvik (No Onion / Garlic)',
        'Low-Oil Wholesome Ayurvedic Recipes',
        '1-Tap Instant Calendar Pause Anytime',
        'Sanitized Stainless Steel Hot Dabba'
      ],
      status: 'ACTIVE'
    },
    {
      id: 'plan_3',
      providerId: 'prov_1',
      name: '30-Day Office Executive Monthly Pass',
      tagline: 'Wholesome North Indian & Rajasthani executive thalis delivered daily.',
      description: '30 complete nutritious meals with rotating daily menu: Shahi Paneer, Dal Makhani, Govind Gatte, 4 soft phulkas, rice, salad & sweet.',
      planType: 'MONTHLY',
      durationDays: 30,
      price: 2399,
      totalPrice: 2399,
      pricePerMeal: 79,
      savings: 'Save ₹600',
      badge: 'BEST VALUE',
      idealFor: 'Daily corporate workers, students & families',
      popular: true,
      features: [
        '30 Executive Homestyle Thalis',
        'Paneer / Special Sabzi 3x Every Week',
        'Zero Penalty Pause / Rollover Credits',
        'Free Priority Doorstep Delivery'
      ],
      status: 'ACTIVE'
    },
    {
      id: 'plan_4',
      providerId: 'prov_19',
      name: 'Punjabi Dhaba Weekly Discovery Pass',
      tagline: 'Rich homestyle Butter Chicken, Paneer Makhani & slow-cooked Dal Makhani.',
      description: '7 authentic Punjabi meals prepared fresh with soft tawa parathas, slow-simmered rich dal, jeera rice & fresh mint raita.',
      planType: 'WEEKLY',
      durationDays: 7,
      price: 899,
      totalPrice: 899,
      pricePerMeal: 128,
      savings: 'Save ₹200',
      badge: 'PUNJABI TREAT',
      idealFor: 'Non-veg & rich Punjabi comfort food lovers',
      popular: false,
      features: [
        'Butter Chicken / Shahi Paneer Makhani',
        'Desi Ghee Amritsari Dal Makhani',
        'Soft Layered Tawa Parathas',
        'Fresh Curd Mint Raita & Pickles'
      ],
      status: 'ACTIVE'
    }
  ];

  const orders = [];
  const subscriptions = [];
  const reviews = [];
  const complaints = [];
  const notifications = [
    {
      id: 'notif_1',
      userId: 'usr_customer_1',
      role: 'CUSTOMER',
      title: 'Welcome to HomeFeast! 🍲',
      message: 'Explore 22+ verified home cooks and flexible daily meal passes in your city.',
      type: 'welcome',
      isRead: false,
      createdAt: '2026-08-16T10:00:00Z'
    }
  ];

  const categories = [
    { id: 'cat_all', name: 'All Dishes', icon: '🍲' },
    { id: 'cat_thali', name: 'Thalis & Combos', icon: '🍱' },
    { id: 'cat_sabzi', name: 'Sabzis & Curries', icon: '🥘' },
    { id: 'cat_dal', name: 'Dals & Kadhis', icon: '🥣' },
    { id: 'cat_roti', name: 'Phulkas & Breads', icon: '🫓' },
    { id: 'cat_rice', name: 'Biryani & Rice', icon: '🍚' },
    { id: 'cat_healthy', name: 'Healthy & Diet', icon: '🥗' },
    { id: 'cat_sweet', name: 'Sweets & Desserts', icon: '🍯' }
  ];

  const cuisines = [
    'All Cuisines',
    'North Indian',
    'Punjabi',
    'Jain',
    'Gujarati',
    'South Indian',
    'Maharashtrian',
    'Rajasthani',
    'Bengali',
    'Healthy',
    'Mughlai'
  ];

  const locations = {
    ajmer: {
      id: 'ajmer',
      name: 'Ajmer',
      state: 'Rajasthan',
      tagline: '22+ Verified Home Cooks • North Indian, Punjabi, Jain, Gujarati, South Indian & Maharashtrian',
      rating: 4.96,
      localities: [
        { name: 'Ramganj & Subhash Nagar', pincode: '305003', activeCooks: 12, popular: true },
        { name: 'Panchsheel Nagar & Vaishali', pincode: '305004', activeCooks: 14, popular: true },
        { name: 'Civil Lines & Collectorate', pincode: '305001', activeCooks: 10, popular: true },
        { name: 'Ana Sagar & Pushkar Road', pincode: '305022', activeCooks: 8, popular: true },
        { name: 'Adarsh Nagar & MDS Area', pincode: '305002', activeCooks: 8, popular: true }
      ]
    }
  };

  const adminStats = {
    totalUsers: 34,
    totalProviders: 22,
    approvedProviders: 22,
    activeSubscriptions: 16,
    totalOrders: 32,
    monthlyRevenue: 245000,
    dailyRevenue: 15400
  };

  return {
    users,
    providers,
    menuItems,
    mealPlans,
    orders,
    subscriptions,
    reviews,
    complaints,
    notifications,
    categories,
    cuisines,
    locations,
    adminStats
  };
};
