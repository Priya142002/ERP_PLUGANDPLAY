# Admin Dashboard UI

A comprehensive Super Admin & Admin Management Module for ERP systems. This is a frontend-only, plug-and-play UI component built with React, TypeScript, and Tailwind CSS.

## Features

- **Frontend-Only Architecture**: No backend dependencies, uses LocalStorage for data persistence
- **Professional ERP Styling**: Clean, modern interface following enterprise design patterns
- **Responsive Design**: Optimized for both desktop and mobile usage
- **TypeScript**: Full type safety and excellent developer experience
- **Component-Based Architecture**: Modular, reusable components

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom ERP theme
- **State Management**: React Context API with useReducer
- **Data Validation**: Zod for runtime type validation
- **UI Components**: Custom component library built on Headless UI
- **Routing**: React Router DOM
- **Development Tools**: ESLint, Prettier, TypeScript

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Modal, etc.)
│   ├── layout/         # Layout components (Dashboard, Sidebar, Header)
│   └── forms/          # Form components
├── pages/              # Page components
│   ├── companies/      # Company management pages
│   ├── admins/         # Admin management pages
│   └── subscriptions/  # Subscription management pages
├── context/            # React Context providers
├── services/           # Business logic and data services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### Building

Build for production:
```bash
npm run build
```

### Code Quality

Run TypeScript type checking:
```bash
npm run type-check
```

Run ESLint:
```bash
npm run lint
```

## Implementation Status

✅ **Task 1: Project Setup and Core Infrastructure** - COMPLETED
- React TypeScript project with Vite build tool
- Tailwind CSS configuration with professional ERP styling
- Required dependencies installed (Zod, React Router, Headless UI)
- Component-based directory structure
- ESLint and Prettier configuration
- Development environment setup

🔄 **Next Tasks:**
- Task 2: Core Data Models and Types
- Task 3: Data Persistence Layer
- Task 4: State Management Foundation
- Task 5: Core UI Components

## Key Dependencies

### Production Dependencies
- `react` & `react-dom` - Core React framework
- `react-router-dom` - Client-side routing
- `zod` - Runtime type validation
- `@headlessui/react` - Unstyled, accessible UI components
- `lucide-react` - Icon library

### Development Dependencies
- `typescript` - Type safety and developer experience
- `vite` - Fast build tool and dev server
- `tailwindcss` - Utility-first CSS framework
- `eslint` & `prettier` - Code quality and formatting
- `@typescript-eslint/*` - TypeScript-specific linting rules

## Design Principles

1. **Frontend-Only**: Complete independence from backend services
2. **Type Safety**: Full TypeScript coverage for reliability
3. **Accessibility**: WCAG 2.1 AA compliance target
4. **Performance**: Optimized for large datasets and responsive interactions
5. **Modularity**: Plug-and-play components for easy integration
6. **Professional UX**: Enterprise-grade user interface design

## License

This project is part of the admin-dashboard-ui specification implementation.