import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rajuleye';

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: String, required: true },
    frameShape: { type: String },
    frameMaterial: { type: String },
    frameColor: { type: String },
    gender: { type: String, default: 'unisex' },
    size: {
        lensWidth: Number,
        bridge: Number,
        templeLength: Number,
        frameWidth: Number,
    },
    weight: { type: Number },
    images: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
});

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const seedProducts = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        let eyeglassesCategory = await Category.findOne({ slug: 'eyeglasses' });
        if (!eyeglassesCategory) {
            eyeglassesCategory = await Category.create({
                name: 'Eyeglasses',
                slug: 'eyeglasses',
                isActive: true,
            });
            console.log('Created Eyeglasses category');
        }

        const categoryId = eyeglassesCategory._id;

        const products = [];
        const brands = ['Ray-Ban', 'Oakley', 'Persol', 'Tom Ford', 'Gucci', 'Prada', 'Burberry', 'Versace'];
        const shapes = ['round', 'square', 'rectangle', 'oval', 'cat-eye', 'wayfarer', 'aviator', 'clubmaster'];
        const materials = ['metal', 'acetate', 'tr90', 'wood', 'titanium', 'mixed'];
        const genders = ['men', 'women', 'unisex', 'kids'];

        for (let i = 1; i <= 30; i++) {
            const brand = brands[Math.floor(Math.random() * brands.length)];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const gender = genders[Math.floor(Math.random() * genders.length)];

            const price = Math.floor(Math.random() * 200) + 50;
            const discount = Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0;
            const name = `${brand} ${shape.charAt(0).toUpperCase() + shape.slice(1)} ${material} Eyeglasses Model ${Date.now()}${i}`;

            products.push({
                name,
                slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now() + i, // Unique slug
                description: `A premium pair of ${shape} eyeglasses from ${brand}, made from high-quality ${material}. Designed for comfort and durability. Perfect for ${gender}.`,
                brand,
                sku: `RJL-EG-${1000 + i}-${Date.now()}${i}`, // Unique SKU
                category: categoryId,
                type: 'eyeglasses',
                frameShape: shape,
                frameMaterial: material,
                frameColor: 'Black',
                gender,
                size: {
                    lensWidth: Math.floor(Math.random() * 10) + 45,
                    bridge: Math.floor(Math.random() * 5) + 15,
                    templeLength: Math.floor(Math.random() * 10) + 135,
                    frameWidth: Math.floor(Math.random() * 10) + 130,
                },
                weight: Math.floor(Math.random() * 15) + 15,
                images: [],
                price,
                discount,
                stock: Math.floor(Math.random() * 100) + 10,
                tags: ['eyeglasses', brand.toLowerCase(), shape, material],
                isActive: true,
            });
        }

        await Product.insertMany(products);
        console.log(`Successfully seeded ${products.length} products`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
