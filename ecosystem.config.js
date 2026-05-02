const fs = require('fs');
const path = require('path');

// Manually parse .env file to avoid dependency issues on VPS
const envPath = path.join(__dirname, '.env');
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) {
      env[key.trim()] = value.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const mode = env.MODE || process.env.MODE || 'development';
const isProd = mode === 'production';

module.exports = {
  apps: [
    {
      name: 'rajuleye-api',
      script: 'src/index.js',
      cwd: './server',
      env: {
        NODE_ENV: isProd ? 'production' : 'development',
        PORT: env.API_PORT || 5000,
        MONGODB_URI: env.MONGODB_URI,
        JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
        JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
        JWT_ACCESS_EXPIRY: env.JWT_ACCESS_EXPIRY,
        JWT_REFRESH_EXPIRY: env.JWT_REFRESH_EXPIRY,
        OTP_EXPIRY_MINUTES: env.OTP_EXPIRY_MINUTES,
        COOKIE_EXPIRE_DAYS: env.COOKIE_EXPIRE_DAYS,
        EMAIL_HOST: env.EMAIL_HOST,
        EMAIL_PORT: env.EMAIL_PORT,
        EMAIL_USER: env.EMAIL_USER,
        EMAIL_PASSWORD: env.EMAIL_PASSWORD,
        EMAIL_FROM: env.EMAIL_FROM,
        CLIENT_URL: isProd ? env.PROD_CLIENT_URL : env.DEV_CLIENT_URL,
      }
    },
    {
      name: 'rajuleye-web',
      script: './deploy/web/apps/web/server.js',
      env: {
        NODE_ENV: isProd ? 'production' : 'development',
        PORT: env.WEB_PORT || 3000,
        NEXT_PUBLIC_API_URL: isProd ? env.PROD_API_URL : env.DEV_API_URL
      }
    },
    {
      name: 'rajuleye-admin',
      script: './deploy/admin/apps/admin/server.js',
      env: {
        NODE_ENV: isProd ? 'production' : 'development',
        PORT: env.ADMIN_PORT || 3001,
        NEXT_PUBLIC_API_URL: isProd ? env.PROD_API_URL : env.DEV_API_URL
      }
    }
  ]
};
