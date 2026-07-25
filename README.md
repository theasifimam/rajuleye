# Rajuleye Monorepo

Welcome to the Rajuleye monorepo. This project contains the entire stack for the application, organized as a workspace-based monorepo using **Turborepo** and **NPM Workspaces**.

## Project Structure

- `apps/admin`: The admin dashboard (Next.js)
- `apps/web`: The consumer-facing web application (Next.js)
- `apps/mobile`: The mobile application (Expo/React Native)
- `server`: The backend API server (Express/TypeScript)

## Getting Started

To get started with the project, follow these steps:

### Prerequisites

- Node.js (v18 or higher)
- npm (v7 or higher)

### Installation

Install dependencies for all projects from the root:

```bash
npm install
```

### Initializing Environment

Each application might require its own `.env` file. Please refer to the individual package directories for `.env.example` files or required environment variables.

### Development

Run all applications in development mode simultaneously:

```bash
npm run dev
```

Or run a specific project using filtering:

```bash
npx turbo run dev --filter=server
npx turbo run dev --filter=web
```

### Building

Build a specific application independently:

```bash
# Build web app
cd apps/web && npm run build

# Build admin app
cd apps/admin && npm run build
```

## Server Deployment with PM2

Each app in this monorepo runs as an independent PM2 service.

### PM2 Service Names
- `rajuleye-api`: Backend API (`./server`)
- `rajuleye-web`: Consumer Web App (`./apps/web`)
- `rajuleye-admin`: Admin Dashboard (`./apps/admin`)

### Initial PM2 Start
```bash
pm2 start ecosystem.config.cjs
```

### Updating an Independent App on Server

1. **Pull latest code**:
   ```bash
   git pull
   ```

2. **Build the specific app**:
   ```bash
   # For Web
   cd apps/web && npm run build

   # For Admin
   cd apps/admin && npm run build
   ```

3. **Restart PM2 service**:
   ```bash
   pm2 restart rajuleye-web
   # or
   pm2 restart rajuleye-admin
   # or
   pm2 restart rajuleye-api
   ```

## Tools

- **Turborepo**: High-performance build system for JavaScript and TypeScript codebases.
- **NPM Workspaces**: Native workspace support for managing multiple packages within a single repository.
