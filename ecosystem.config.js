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
      // Adjust the path to server.js if it is nested like deploy/web/apps/web/server.js
      script: './deploy/web/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'rajuleye-admin',
      // Adjust the path to server.js if it is nested like deploy/admin/apps/admin/server.js
      script: './deploy/admin/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
