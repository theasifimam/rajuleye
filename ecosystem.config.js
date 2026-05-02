const path = require('path');
require('./server/node_modules/dotenv').config({ path: path.join(__dirname, '.env') });

const mode = process.env.MODE || 'development';
const isProd = mode === 'production';

module.exports = {
  apps: [
    {
      name: 'rajuleye-api',
      script: 'src/index.js',
      cwd: './server',
      env: {
        NODE_ENV: isProd ? 'production' : 'development',
        PORT: process.env.API_PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
        JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
        OTP_EXPIRY_MINUTES: process.env.OTP_EXPIRY_MINUTES,
        COOKIE_EXPIRE_DAYS: process.env.COOKIE_EXPIRE_DAYS,
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        EMAIL_FROM: process.env.EMAIL_FROM,
        CLIENT_URL: isProd ? process.env.PROD_CLIENT_URL : process.env.DEV_CLIENT_URL,
      }
    },
    {
      name: 'rajuleye-web',
      script: './deploy/web/apps/web/server.js',
      env: {
        NODE_ENV: isProd ? 'production' : 'development',
        PORT: process.env.WEB_PORT || 3000,
        NEXT_PUBLIC_API_URL: isProd ? process.env.PROD_API_URL : process.env.DEV_API_URL
      }
    },
    {
      name: 'rajuleye-admin',
      script: './deploy/admin/apps/admin/server.js',
      env: {
        NODE_ENV: isProd ? 'production' : 'development',
        PORT: process.env.ADMIN_PORT || 3001,
        NEXT_PUBLIC_API_URL: isProd ? process.env.PROD_API_URL : process.env.DEV_API_URL
      }
    }
  ]
};
