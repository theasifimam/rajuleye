import mongoose from 'mongoose';

const FrameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const Frame = mongoose.models.Frame || mongoose.model('Frame', FrameSchema);

async function seed() {
    await mongoose.connect('mongodb+srv://asifimam:ETYF6evwtKRSeNJT@cluster0.x62bsab.mongodb.net/rajuleye', { family: 4 });
    console.log('Connected to DB');
    
    // Check if frames already exist
    const count = await Frame.countDocuments();
    if (count > 0) {
        console.log('Frames already exist, skipping seed.');
        process.exit(0);
    }

    const frames = [
        { name: 'C.R.H', description: 'Hard Coated Lenses', price: 1000, discount: 0 },
        { name: 'A.R.C', description: 'Anti-Reflective Coating', price: 1500, discount: 0 },
        { name: 'P.G. A.R.C', description: 'Photo-Grey ARC', price: 2000, discount: 0 },
    ];

    await Frame.insertMany(frames);
    console.log('Seeded frames successfully!');
    process.exit(0);
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
