# User Management App

A Vue 3 application for browsing users and managing their posts.

## Features

- Browse users with search functionality
- View user details and company information
- Responsive design

## Tech Stack

- Vue 3 + TypeScript
- TanStack Query for data fetching
- PrimeVue for UI components
- Zod for validation
- Vite for development

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── post/           # Post-related components
│   └── ui/             # Layout components
├── composables/        # Vue composables for state logic
├── pages/              # Route components
├── schemas/            # Zod validation schemas
├── services/           # API service layer
└── types/              # TypeScript type definitions
```

## API

Uses [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for demo data.
