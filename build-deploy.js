import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables for the build process manually to avoid dotenv dependency issues
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  content.split('\n').forEach(line => {
    // Only process lines that have an equals sign and aren't commented out
    if (line.includes('=') && !line.trim().startsWith('#')) {
      const parts = line.split('=');
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
} else {
  console.warn('.env file not found, build may lack environment variables');
}

function buildAndPrepare(appName) {
  console.log(`\n--- Building ${appName} ---`);
  const appDir = path.join(__dirname, 'apps', appName);
  
  // Clone environment variables to customize for production build
  const buildEnv = { ...process.env };
  
  // Since build-deploy.js builds for server deployment, override NEXT_PUBLIC_API_URL
  // to use PROD_API_URL (defaulting to https://rajuleye.com if not set)
  const prodApiUrl = buildEnv.PROD_API_URL || 'https://rajuleye.com';
  console.log(`Setting NEXT_PUBLIC_API_URL to production API: ${prodApiUrl}`);
  buildEnv.NEXT_PUBLIC_API_URL = prodApiUrl;
  
  // Run next build
  try {
    execSync('npm run build', { cwd: appDir, stdio: 'inherit', env: buildEnv });
  } catch (error) {
    console.error(`Build failed for ${appName}`);
    process.exit(1);
  }

  console.log(`\n--- Preparing standalone build for ${appName} ---`);
  
  const standaloneDir = path.join(appDir, '.next', 'standalone');
  let standaloneAppDir = standaloneDir;
  
  // If monorepo workspaces are used, Next.js might nest it
  if (fs.existsSync(path.join(standaloneDir, 'apps', appName, 'server.js'))) {
    standaloneAppDir = path.join(standaloneDir, 'apps', appName);
  }

  const staticSrc = path.join(appDir, '.next', 'static');
  const staticDest = path.join(standaloneAppDir, '.next', 'static');
  const publicSrc = path.join(appDir, 'public');
  const publicDest = path.join(standaloneAppDir, 'public');

  // Copy .next/static
  if (fs.existsSync(staticSrc)) {
    console.log(`Copying static assets for ${appName}...`);
    fs.cpSync(staticSrc, staticDest, { recursive: true });
  }

  // Copy public folder
  if (fs.existsSync(publicSrc)) {
    console.log(`Copying public assets for ${appName}...`);
    fs.cpSync(publicSrc, publicDest, { recursive: true });
  }

  // Move the standalone build to a top-level 'deploy' folder so it can be tracked
  const deployDir = path.join(__dirname, 'deploy', appName);
  
  if (fs.existsSync(deployDir)) {
    fs.rmSync(deployDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(path.join(__dirname, 'deploy'), { recursive: true });
  
  // The standalone directory structure is `.next/standalone/apps/appName` due to monorepo/workspaces.
  // We'll move the entire standalone directory to deploy, or just the necessary parts.
  // Actually, Next.js standalone includes node_modules at `.next/standalone/node_modules`
  // and the app at `.next/standalone/apps/appName`. 
  // It's safer to copy the whole `.next/standalone` folder.
  fs.cpSync(standaloneDir, deployDir, { recursive: true });
  
  console.log(`✅ ${appName} is ready in deploy/${appName}`);
}

buildAndPrepare('web');
buildAndPrepare('admin');

console.log('\n🎉 All builds prepared in the "deploy" folder!');
console.log('You can now add the "deploy" folder to Git, commit, and push it.');
console.log('On your server, you just need to run:');
console.log('  node deploy/web/server.js (or deploy/web/apps/web/server.js if monorepo)');
console.log('  node deploy/admin/server.js (or deploy/admin/apps/admin/server.js if monorepo)');
