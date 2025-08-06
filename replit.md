# Real Estate CRM - Multi-Tenant SaaS Application

## Overview

This is a full-stack multi-tenant SaaS Real Estate CRM web application built with React frontend and Express.js backend. The system allows multiple real estate companies to manage their leads, properties, deals, and teams through isolated tenant-specific environments. Each tenant can have their own subdomain/custom domain and branding while sharing the same codebase infrastructure.

The application supports role-based access control with four user roles (superadmin, admin, supervisor, sales) and provides comprehensive CRM functionality including lead management, property listings, deal tracking with commission calculations, team management, and analytics dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**January 6, 2025**: Successfully completed Real Estate CRM migration and modern design enhancement
- Configured dual database system: MongoDB Atlas (primary) + PostgreSQL (fallback)
- Set up secure credential storage using Replit Secrets (MONGODB_URI, SESSION_SECRET, DATABASE_URL)
- Created complete database schema with Drizzle ORM migrations
- Established multi-tenant architecture with proper data isolation
- Application fully functional with working API endpoints and authentication system
- Server running successfully on port 5000 with hot reload enabled
- **Design Enhancement**: Applied modern UI patterns from successful open source CRM projects
- Implemented gradient-based modern sidebar with improved navigation and user experience
- Enhanced dashboard with glassmorphism effects, animated cards, and improved visual hierarchy
- Added skeleton loading states and hover animations for better user feedback
- **Role-Based System**: Implemented complete role-based dashboard system
- Created four distinct dashboards: SuperAdmin, Admin, Supervisor, and Sales roles
- Added URL-based role routing (/admin, /supervisor, /sales, /superadmin)
- Implemented role-specific metrics, colors, and permissions for each user type

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript for the API server
- **Authentication**: OpenID Connect integration with Replit Auth using Passport.js
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **API Design**: RESTful API with role-based route protection middleware
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Development**: Hot reload with Vite integration for seamless development experience

### Database & ORM
- **Primary Database**: MongoDB Atlas for scalable document storage
- **Fallback Database**: PostgreSQL for reliable data persistence  
- **MongoDB Connection**: Direct connection using mongodb driver with secure environment variables
- **PostgreSQL ORM**: Drizzle ORM with Drizzle Kit for schema management and migrations
- **Schema Design**: Multi-tenant architecture with tenant isolation via tenant ID
- **Data Models**: Users, tenants, leads, properties, deals, exchange rates, activities, and sessions

### Multi-Tenancy Strategy
- **Tenant Isolation**: Row-level security using tenant ID in all tenant-specific tables
- **Subdomain Support**: Dynamic subdomain routing for tenant identification
- **Custom Domain Support**: Configurable custom domains per tenant
- **Branding**: Per-tenant logo and color theme customization
- **Data Separation**: Complete data isolation between tenants while sharing infrastructure

### Authentication & Authorization
- **Authentication Provider**: Replit OpenID Connect for secure authentication
- **Session Storage**: Server-side sessions stored in PostgreSQL
- **Role-Based Access Control**: Four-tier role system (superadmin, admin, supervisor, sales)
- **Route Protection**: Middleware-based route protection with role validation
- **JWT Integration**: OpenID Connect tokens for secure user identification

### State Management & Data Flow
- **Server State**: TanStack React Query for API data caching and synchronization
- **Client State**: React hooks and context for local component state
- **Form State**: React Hook Form for complex form state management
- **Optimistic Updates**: Client-side optimistic updates with server reconciliation
- **Error Boundaries**: Comprehensive error handling and user feedback

## External Dependencies

### Database & Storage
- **MongoDB Atlas**: Primary cloud database with automatic scaling and replication
- **Neon PostgreSQL**: Fallback serverless PostgreSQL database with automatic scaling
- **Database Connection**: mongodb driver for primary storage, @neondatabase/serverless for fallback
- **Session Store**: PostgreSQL-backed session storage for secure session management
- **Environment Variables**: Secure credential storage using Replit Secrets

### Authentication Services
- **Replit Auth**: OpenID Connect provider for user authentication
- **Passport.js**: Authentication middleware with OpenID Connect strategy
- **Session Management**: Express-session with PostgreSQL persistence

### UI & Design System
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework for consistent styling
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide Icons**: Modern icon library for consistent iconography

### Development & Build Tools
- **TypeScript**: Static type checking for both frontend and backend
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS integration

### Validation & Forms
- **Zod**: TypeScript-first schema validation library
- **React Hook Form**: Performant forms library with minimal re-renders
- **Hookform Resolvers**: Integration between React Hook Form and Zod validation

### Utility Libraries
- **date-fns**: Modern date utility library for date manipulation
- **clsx & tailwind-merge**: Utility for conditional CSS class names
- **nanoid**: Secure URL-friendly unique ID generator
- **memoizee**: Function memoization for performance optimization