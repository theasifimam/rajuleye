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
    logo: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    instagramUrl: {
      type: String,
      default: '',
    },
    facebookUrl: {
      type: String,
      default: '',
    },
    whatsappNumber: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;
