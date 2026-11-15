## AdminSphere

AdminSphere is an enterprise-style backend-heavy admin and task management system built to practice and demonstrate real-world backend engineering concepts such as authentication, authorization, session management, task workflows, event-driven architecture, real-time communication, background jobs, logging, document generation and scalable system design.

The primary focus of this project is backend architecture, correctness, maintainability and production-oriented patterns rather than UI polish.

## Status
🚧 This project is under active development. New features, improvements, performance enhancements and bug fixes are added regularly as the application continues to evolve.

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Redis (Upstash)
- JWT Authentication
- Google OAuth 2.0
- Nodemailer
- Socket.IO
- Cloudinary
- Puppeteer
- ExcelJS
- node-cron
- Winston (logging)
- Multer

---

# Core Features

## Authentication & Authorization

- Access & Refresh JWT authentication with HTTP-only cookies
- Refresh token rotation for enhanced session security
- Redis-backed multi-session management with per-device session tracking
- Server-side session validation using Redis
- Secure logout of current session and support for session revocation
- Google OAuth 2.0 authentication with automatic account linking
- Permission-based Role-Based Access Control (RBAC)
- Route-level authorization middleware
- Resource ownership policies for secure task operations
- Account lock after repeated failed login attempts
- Forgot password and secure password reset flow with email support

## Task Management System

### Task Features

- Create, update and soft delete tasks
- Task assignment & reassignment
- Task priorities and statuses
- Due dates and completion tracking
- Task comments system
- File attachments support
- Activity tracking for task lifecycle events

### Task Workflow

- Permission-based task creation and assignment
- Employees can update their assigned tasks
- Resource ownership policies enforce task access
- Activity logs track meaningful task events
- Event-driven notifications on assignment and updates

## File Uploads

- Profile image uploads using Multer memory storage
- Task attachment uploads with permission and ownership validation
- Cloudinary stream uploads with automatic old file cleanup
- File metadata tracking

# Real-Time Features

Socket.IO is used for authenticated real-time communication between the backend and frontend.

The real-time system currently supports:

- Authenticated Socket.IO connections
- User and dashboard room-based communication
- Real-time dashboard updates
- Real-time task assignment updates
- Real-time notification delivery
- Persisted notifications with offline recovery
- React Query cache synchronization on the frontend

The system is designed around application events, allowing additional real-time events and consumers to be introduced without tightly coupling them to business logic.

---

# Event-Driven Architecture

The system uses Node.js EventEmitter to decouple business logic from side effects.

Application events can trigger operations such as:

- Database updates
- Activity tracking
- Notifications
- Email notifications
- Real-time Socket.IO updates

The general flow is:

Backend mutation
      ↓
EventEmitter application event
      ↓
Database update / side effects
      ↓
Socket.IO emission
      ↓
Frontend event handler
      ↓
React Query cache update / refetch
      ↓
UI update

---

# Logging System

## Application Logs

Winston is used for:

- Application logs
- Error logs
- Rotating log files

Morgan is used for HTTP request logging.

## Activity Logs

Business-level activity logs track:

- Task creation
- Task assignment
- Task completion
- Comments & attachment activity

## Authentication Logs

Authentication-related events are tracked separately:

- Login success/failure
- OAuth logins

---

# Document Generation

## PDF Generation

- PDFs generated using Puppeteer
- EJS templates rendered to HTML
- In-memory PDF streaming

## Excel Generation

- Excel exports generated using ExcelJS
- Suitable for admin reports and exports

---

# Background Jobs

AdminSphere uses BullMQ with Upstash Redis for asynchronous background processing and node-cron is used for scheduled background jobs.

Background workers handle operations that are better executed outside the API request lifecycle:

* **Email jobs** — asynchronous welcome-email delivery with retries and exponential backoff.
* **PDF reports** — Puppeteer-based daily reports processed by a dedicated worker.
* **Worker concurrency** — tuned independently for I/O-bound and CPU/memory-intensive workloads.
* **Failure handling** — failed-job retention and automatic retries.
* **Graceful shutdown** — workers finish active jobs before shutting down.
* **Production workers** — API and background workers run as separate PM2-managed Node.js processes.

The daily report cron only queues the job; the actual report generation and email delivery are handled asynchronously by the reports worker.

See [`docs/background-jobs.md`](docs/background-jobs.md) for the detailed architecture and implementation.

---

# Security Features

- bcrypt password hashing
- Helmet security headers
- Rate limiting
- Validation using express-validator
- Email enumeration protection
- Secure HTTP-only cookies

---

# Architecture Overview

The project follows a layered architecture:

- Routes → API endpoints and access control
- Controllers → Request orchestration
- Services → Business logic
- Integrations → External systems (Email, PDF, Excel, Socket)
- Events → Application events
- Middlewares → Authentication, validation, security
- Cron Jobs → Background scheduled tasks
- Utilities → Shared helper functions

---

# Production Deployment

AdminSphere is deployed as a production full-stack application.

### Frontend
- Next.js application deployed on Vercel
- Production domain: `https://adminsphere.in`

### Backend
- Node.js / Express API deployed on AWS EC2
- Nginx reverse proxy
- PM2 process management
- HTTPS using Let's Encrypt / Certbot
- Production API: `https://api.adminsphere.in`

### Infrastructure
- MongoDB Atlas for database
- Upstash Redis for session management
- GoDaddy DNS
- GitHub → Vercel automated frontend deployments
- Backend deployments currently performed manually through SSH + Git + PM2

---

# Known Limitations & Future Improvements

- Cron jobs currently run per instance (no distributed leader election)
- Streaming-based exports can be added for large datasets
- Admin-configurable report recipients can be moved to database
- Additional notification events can be added as new real-time workflows are introduced
- Notification UI can be further polished as the application evolves
