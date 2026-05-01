module.exports = {
  apps: [
    {
      name: 'rajuleye-api',
      script: 'src/index.js',
      cwd: './server',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'rajuleye-web',
      script: './deploy/web/apps/web/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'rajuleye-admin',
      script: './deploy/admin/apps/admin/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
