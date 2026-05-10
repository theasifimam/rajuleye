import './load-env.js';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/product.model.js';
import Category from './models/category.model.js';
import {
  PRODUCT_TYPES,
  GENDERS,
  STYLES,
  USAGES,
  FACE_SHAPES,
  MATERIALS,
  LENS_FEATURES,
  FRAME_TYPES,
  FITS
} from './utils/constants.js';

const getRandomItems = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateBrand = () => getRandomItem(['Rajul Eye', 'Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Tom Ford', 'Persol']);

const colorsList = ['Black', 'Tortoise', 'Gold', 'Silver', 'Clear', 'Blue', 'Red', 'Gunmetal', 'Rose Gold'];

const generateProducts = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    let categories = await Category.find();
    if (categories.length === 0) {
        // Create a default category if none exists
        const defaultCat = await Category.create({
            name: 'General',
            slug: 'general',
            description: 'General Category'
        });
        categories = [defaultCat];
    }

    const products = [];
    for (let i = 1; i <= 100; i++) {
      const type = getRandomItem(PRODUCT_TYPES);
      const gender = getRandomItems(GENDERS, Math.floor(Math.random() * 2) + 1);
      const styles = getRandomItems(STYLES, Math.floor(Math.random() * 3) + 1);
      const usage = getRandomItems(USAGES, Math.floor(Math.random() * 3) + 1);
      const faceShapes = getRandomItems(FACE_SHAPES, Math.floor(Math.random() * 3) + 1);
      const materials = getRandomItems(MATERIALS, Math.floor(Math.random() * 2) + 1);
      const lensFeatures = getRandomItems(LENS_FEATURES, Math.floor(Math.random() * 3) + 1);
      const colors = getRandomItems(colorsList, Math.floor(Math.random() * 3) + 1);
      
      const frameType = getRandomItem(FRAME_TYPES);
      const fit = getRandomItem(FITS);
      const brand = generateBrand();

      const name = `${brand} ${styles[0].charAt(0).toUpperCase() + styles[0].slice(1)} ${type.split('-')[0]} ${Math.floor(Math.random() * 1000)}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + '-' + i;

      const price = Math.floor(Math.random() * 5000) + 999; // 999 to 5999
      const discount = Math.floor(Math.random() * 40); // 0 to 40%

      products.push({
        name,
        slug,
        description: `Experience the perfect blend of style and comfort with these premium ${type}. Designed for ${gender.join(' and ')}, featuring a durable ${materials[0]} construction.`,
        brand,
        sku: `SKU-${Math.floor(Math.random() * 90000) + 10000}-${i}`,
        category: getRandomItem(categories)._id,
        type,
        gender,
        styles,
        usage,
        faceShapes,
        materials,
        colors,
        lensFeatures,
        frameType,
        fit,
        price,
        discount,
        stock: Math.floor(Math.random() * 50) + 5,
        isActive: true,
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'
        ],
        size: {
          lensWidth: Math.floor(Math.random() * 15) + 45, // 45 to 60
          bridge: Math.floor(Math.random() * 8) + 16, // 16 to 24
          templeLength: Math.floor(Math.random() * 15) + 135, // 135 to 150
          frameWidth: Math.floor(Math.random() * 20) + 130 // 130 to 150
        },
        weight: Math.floor(Math.random() * 20) + 15, // 15g to 35g
        avgRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        totalReviews: Math.floor(Math.random() * 100)
      });
    }

    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products with new categorization!`);

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

generateProducts();
