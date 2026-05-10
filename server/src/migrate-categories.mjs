import './load-env.js';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Product from './models/product.model.js';
import Category from './models/category.model.js';

const migrateCategories = async () => {
  try {
    await connectDB();
    console.log('Connected to DB');

    // Find all categories
    const categories = await Category.find();
    console.log('Existing Categories:', categories.map(c => c.name));

    const gendersToRemove = ['men', 'women', 'kids', 'kid', 'unisex'];
    
    // Find categories to remove
    const categoriesToRemove = categories.filter(c => gendersToRemove.includes(c.name.toLowerCase()) || gendersToRemove.includes(c.slug.toLowerCase()));
    
    if (categoriesToRemove.length > 0) {
        console.log('Categories to remove:', categoriesToRemove.map(c => c.name));
        
        // Find or create Eyeglasses and Sunglasses categories
        let eyeglassesCategory = categories.find(c => c.name.toLowerCase() === 'eyeglasses' || c.slug.toLowerCase() === 'eyeglasses');
        if (!eyeglassesCategory) {
            eyeglassesCategory = await Category.create({ name: 'Eyeglasses', slug: 'eyeglasses', description: 'Eyeglasses Category' });
        }
        
        let sunglassesCategory = categories.find(c => c.name.toLowerCase() === 'sunglasses' || c.slug.toLowerCase() === 'sunglasses');
        if (!sunglassesCategory) {
            sunglassesCategory = await Category.create({ name: 'Sunglasses', slug: 'sunglasses', description: 'Sunglasses Category' });
        }

        for (const catToRemove of categoriesToRemove) {
            const products = await Product.find({ category: catToRemove._id });
            console.log(`Found ${products.length} products in category ${catToRemove.name}`);
            
            for (const product of products) {
                // If product type is sunglasses, move to Sunglasses category, else Eyeglasses
                const newCategory = product.type === 'sunglasses' ? sunglassesCategory._id : eyeglassesCategory._id;
                
                // Add the gender from the category to the product's gender array if it's not already there
                const genderFromCat = catToRemove.name.toLowerCase() === 'kid' ? 'kids' : catToRemove.name.toLowerCase();
                
                const currentGenders = Array.isArray(product.gender) ? product.gender : [];
                if (!currentGenders.includes(genderFromCat) && gendersToRemove.includes(genderFromCat)) {
                    currentGenders.push(genderFromCat);
                }

                await Product.updateOne({ _id: product._id }, { 
                    $set: { 
                        category: newCategory,
                        gender: currentGenders
                    } 
                });
            }
            
            // Delete the category
            await Category.findByIdAndDelete(catToRemove._id);
            console.log(`Deleted category ${catToRemove.name}`);
        }
        
        console.log('Migration completed successfully!');
    } else {
        console.log('No gender-based categories found to migrate.');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error migrating categories:', error);
    process.exit(1);
  }
};

migrateCategories();
