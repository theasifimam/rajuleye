import './src/load-env.js';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import User from './src/models/user.model.js';
import bcrypt from 'bcryptjs';

async function createAdmin() {
  try {
    await connectDB();
    console.log('Connected to Rajul Eye DB');

    const adminEmail = 'admin@mazlis.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        name: 'Rajul Eye Admin',
        email: adminEmail,
        password: hashedPassword,
        mobile: '9876543210',
        role: 'admin',
        isMobileVerified: true,
      });
      console.log('Created Rajul Eye admin user:', adminEmail);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
