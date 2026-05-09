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

async function list() {
    await mongoose.connect('mongodb+srv://asifimam:ETYF6evwtKRSeNJT@cluster0.x62bsab.mongodb.net/rajuleye', { family: 4 });
    console.log('Connected to DB');
    
    const frames = await Frame.find({});
    console.log('Frames in DB:', JSON.stringify(frames, null, 2));
    process.exit(0);
}

list().catch(err => {
    console.error(err);
    process.exit(1);
});
