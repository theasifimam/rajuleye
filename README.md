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

Build all applications:

```bash
npm run build
```

## Tools

- **Turborepo**: High-performance build system for JavaScript and TypeScript codebases.
- **NPM Workspaces**: Native workspace support for managing multiple packages within a single repository.
