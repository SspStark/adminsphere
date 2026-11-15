## AdminSphere Frontend

A modern, responsive admin dashboard built with Next.js 16, React 19, and TypeScript for the AdminSphere backend. The frontend focuses on scalable architecture, type safety, reusable components, efficient server-state management and real-time application updates while consuming a secure REST API.

## Status
🚧 This project is under active development. New features, improvements, performance enhancements and bug fixes are added regularly as the application continues to evolve.

## Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- Zustand
- React Hook Form
- Zod
- Axios
- Socket.IO Client
- Radix UI
- Sonner

## Features
### Authentication
- Login & Logout
- Reset Password
- Protected Routes
- Guest Routes
- Persistent Authentication
- Current User (/me) Integration
- Global Authentication State using Zustand

### Dashboard
- Shared Dashboard Layout
- Responsive Navigation
- Reusable UI Components

### Task Management
- View Tasks
- Create Task
- Edit Task
- Delete Task
- Task Details
- Inline Status Updates
- Assign Users to Tasks
- Comments
- Attachments
- Filtering
- Pagination

### Notifications
- Persisted notifications
- Real-time notification delivery
- Unread notification count
- Real-time notification-list updates
- Offline notification recovery

### Real-Time Features

- Authenticated Socket.IO connections
- User and dashboard room communication
- Centralized real-time event handling
- Real-time dashboard updates
- Real-time task assignment updates
- Real-time notification delivery
- React Query cache synchronization
- Persisted notification state with offline recovery
  
### User Management
- View Users
- Create User
- Edit User
- Delete User
- User Details
- Profile & Account Management
- Profile Picture Upload & Removal

## Project Structure
- app/
- components/
- constants/
- hooks/
- lib/
- schemas/
- services/
- types/

#### The project follows a feature-oriented architecture with clear separation of responsibilities:

- Components – Reusable UI and feature components
- Hooks – React Query hooks, custom hooks and real-time event handling
- Services – API communication layer
- Schemas – Zod validation schemas
- Types – Shared TypeScript models
- Constants – Application constants
- Lib – Utilities, Axios configuration, React Query setup and Socket.IO setup

### Highlights
- Feature-based folder structure
- Type-safe API integration with TypeScript
- React Query for server-state management
- React Query cache synchronization for real-time updates
- Zustand for global client state
- Centralized API service layer
- Centralized Socket.IO event handling
- Reusable form components
- Zod-powered form validation
- Axios interceptors with automatic token refresh
- Persistent notification state with offline recovery
- Scalable component architecture
- Clear separation of UI, business logic, API communication and real-time event handling

### Production Deployment

- The frontend is deployed to Vercel and communicates with the production AdminSphere API.
- Production frontend: https://adminsphere.in
- Production API: https://api.adminsphere.in/api/v1
- Local development: http://localhost:3005
- Frontend deployments are automatically triggered through the GitHub → Vercel integration.
