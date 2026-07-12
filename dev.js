import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apps = [
  {
    name: 'Server',
    command: 'npm',
    args: ['run', 'dev'],
    cwd: path.join(__dirname, 'server'),
    color: '\x1b[32m', // Green
  },
  {
    name: 'Admin',
    command: 'npm',
    args: ['run', 'dev', '--', '-p', '3001'],
    cwd: path.join(__dirname, 'apps/admin'),
    color: '\x1b[34m', // Blue
  },
  {
    name: 'Web',
    command: 'npm',
    args: ['run', 'dev', '--', '-p', '3000'],
    cwd: path.join(__dirname, 'apps/web'),
    color: '\x1b[35m', // Magenta
  }
];

console.log('\x1b[1m\x1b[36m%s\x1b[0m', 'Starting Rajuleye Development Stack...');

apps.forEach(app => {
  const child = spawn(app.command, app.args, {
    cwd: app.cwd,
    shell: true,
    stdio: 'pipe'
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${app.color}[${app.name}]\x1b[0m ${line}`);
      }
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.error(`${app.color}[${app.name}] ERROR:\x1b[0m ${line}`);
      }
    });
  });

  child.on('close', (code) => {
    console.log(`${app.color}[${app.name}]\x1b[0m process exited with code ${code}`);
  });
});

process.on('SIGINT', () => {
  console.log('\n\x1b[31mStopping all processes...\x1b[0m');
  process.exit();
});
