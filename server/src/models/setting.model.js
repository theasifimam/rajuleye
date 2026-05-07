import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    primaryColor: {
      type: String,
      default: '#000000',
    },
    homePageHeadingTitle: {
      type: String,
      default: 'Welcome to Rajul Eye',
    },
    description: {
      type: String,
      default: 'Best eye glasses collection',
    },
    previewImage: {
      type: String, 
      default: '',
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
