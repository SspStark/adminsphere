# CI/CD

AdminSphere uses GitHub Actions for continuous integration (CI) and continuous
deployment (CD).

The goal is to automatically validate backend changes and deploy successful
changes to the production EC2 server.

---

## Overview

The deployment flow is:

```text
Developer
   │
   │ git push
   ▼
GitHub
   │
   ▼
Backend CI
   │
   ├── Checkout repository
   ├── Setup Node.js from .nvmrc
   ├── Install dependencies with npm ci
   ├── Check syntax
   └── Run Vitest tests
   │
   │ success on main
   ▼
Backend CD
   │
   ▼
Self-hosted runner on EC2
   │
   ├── Fetch latest origin/main
   ├── Checkout main
   ├── Reset production to origin/main
   ├── Install dependencies with npm ci
   ├── Restart adminsphere with PM2
   └── Verify /health endpoint
   │
   ▼
Production
```
