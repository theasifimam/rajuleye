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

const seedCategories = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        let rootEyeglasses = await Category.findOne({ slug: 'eyeglasses' });
        if (!rootEyeglasses) {
            console.log('Root eyeglasses category not found. Creating it.');
            rootEyeglasses = await Category.create({
                name: 'Eyeglasses',
                slug: 'eyeglasses',
                isActive: true,
            });
        }

        const categoriesToCreate = [
            { name: "Men's Eyeglasses", slug: "mens-eyeglasses", image: 'https://images.unsplash.com/photo-1542295669297-4d352b042bce?w=800&q=80' },
            { name: "Women's Eyeglasses", slug: "womens-eyeglasses", image: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&q=80' },
            { name: "Unisex Eyeglasses", slug: "unisex-eyeglasses", image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80' },
            { name: "Kids Eyeglasses", slug: "kids-eyeglasses", image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=800&q=80' }
        ];

        const categoryMap = {}; // Maps gender to category ID

        for (const cat of categoriesToCreate) {
            let category = await Category.findOne({ slug: cat.slug });
            if (!category) {
                category = await Category.create({
                    name: cat.name,
                    slug: cat.slug,
                    parent: rootEyeglasses._id,
                    image: cat.image,
                    isActive: true
                });
                console.log(`Created subcategory: ${cat.name}`);
            } else {
                console.log(`Subcategory ${cat.name} already exists.`);
            }

            // Determine gender mapping
            let genderKey;
            if (cat.name.includes("Men's")) genderKey = 'men';
            else if (cat.name.includes("Women's")) genderKey = 'women';
            else if (cat.name.includes("Kids")) genderKey = 'kids';
            else genderKey = 'unisex';

            categoryMap[genderKey] = category._id;
        }

        // Now update existing products
        const existingProducts = await Product.find({ type: 'eyeglasses' });
        let updatedCount = 0;

        for (const prod of existingProducts) {
            if (prod.gender && categoryMap[prod.gender]) {
                if (prod.category.toString() !== categoryMap[prod.gender].toString()) {
                    prod.category = categoryMap[prod.gender];
                    await prod.save();
                    updatedCount++;
                }
            }
        }

        console.log(`Successfully mapped ${updatedCount} products into their new subcategories based on gender.`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
