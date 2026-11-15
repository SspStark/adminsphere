# Background Jobs

AdminSphere uses [BullMQ](https://bullmq.io/) with Upstash Redis for asynchronous background job processing.

The goal is to keep slow or retryable operations outside the API request lifecycle and allow them to run in dedicated worker processes.

## Architecture

```text
                    ┌──────────────────┐
                    │   AdminSphere    │
                    │      API         │
                    │    server.js     │
                    └────────┬─────────┘
                             │
                       Add job to queue
                             │
                             ▼
                    ┌──────────────────┐
                    │   Upstash Redis  │
                    │     BullMQ       │
                    └────────┬─────────┘
                             │
                       Consume jobs
                             │
                             ▼
                    ┌──────────────────┐
                    │ Background       │
                    │ Worker Process   │
                    │    worker.js     │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    ▼                  ▼
                 Email             PDF Report
```

The API and worker run as separate Node.js processes managed by PM2.

## Why Background Jobs?

Some operations should not block an HTTP request or cron process.

For example, generating the daily PDF report involves:

```text
MongoDB
   ↓
HTML generation
   ↓
Puppeteer / Chromium
   ↓
PDF generation
   ↓
Email delivery
```

This work previously ran synchronously and took approximately 6 seconds during testing.

With BullMQ:

```text
Cron
 ↓
Add job to queue
 ↓
Return immediately
 ↓
Worker processes job independently
```

The queue operation itself took approximately 49 ms during testing.

## Queues

AdminSphere currently uses two BullMQ queues.

### Email Queue

Queue:

```text
email
```

Location:

```text
src/queues/email/email.queue.js
```

Current job:

```text
send-welcome-email
```

The user creation flow adds a welcome-email job instead of sending the email synchronously.

### Reports Queue

Queue:

```text
reports
```

Location:

```text
src/queues/reports/reports.queue.js
```

Current job:

```text
daily-users-report
```

The daily cron schedule adds the report job to the queue.

## Workers

Workers are defined separately from the queues.

### Email Worker

Location:

```text
src/queues/email/email.worker.js
```

Concurrency:

```text
5
```

Email sending is primarily I/O-bound, so multiple email jobs can be processed concurrently.

### Reports Worker

Location:

```text
src/queues/reports/reports.worker.js
```

Concurrency:

```text
1
```

The report worker uses Puppeteer/Chromium, which is significantly heavier in terms of CPU and memory. Keeping concurrency at one is appropriate for the small EC2 instance currently hosting AdminSphere.

## Retry and Backoff

Queues use three attempts:

```js
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 5000
  }
}
```

A failed job is therefore retried automatically.

The exponential backoff avoids immediately hammering an unavailable external service.

Example:

```text
Attempt 1
   ↓
failure
   ↓
wait
   ↓
Attempt 2
   ↓
failure
   ↓
wait longer
   ↓
Attempt 3
```

After all attempts fail, BullMQ marks the job as failed.

## Failed Job Retention

Completed and failed jobs are retained for a limited period/count:

```js
removeOnComplete: 100,
removeOnFail: 500
```

This provides useful failure history without keeping every completed job indefinitely.

A dedicated Dead Letter Queue has not been implemented because the current project does not require the additional infrastructure.

## Job IDs

The welcome email uses a deterministic job ID:

```text
welcome-email:<userId>
```

This prevents another identical job from being added while the existing job with that ID is still retained.

This is not intended to be a complete idempotency system. Full idempotency is outside the current AdminSphere scope.

## Worker Concurrency

Current configuration:

| Worker  | Concurrency | Reason                                     |
| ------- | ----------: | ------------------------------------------ |
| Email   |           5 | Mostly I/O-bound                           |
| Reports |           1 | Puppeteer/Chromium is CPU/memory intensive |

Concurrency is controlled inside the BullMQ worker rather than by creating multiple PM2 instances.

## Graceful Shutdown

The root worker process handles:

```text
SIGINT
SIGTERM
```

During shutdown:

```text
Signal received
      ↓
worker.close()
      ↓
Stop accepting new jobs
      ↓
Allow active jobs to finish
      ↓
Close workers
      ↓
Process exits
```

This prevents active jobs from being unnecessarily interrupted during deployments or process restarts.

Graceful shutdown was tested with a deliberately long-running job. The worker received the shutdown signal, allowed the active job to complete, and then exited.

## PM2 Production Setup

Production runs two PM2 applications:

```text
PM2
├── adminsphere
│   └── server.js
│
└── adminsphere-worker
    └── worker.js
```

Both applications use:

```text
exec_mode: fork
instances: 1
autorestart: true
watch: false
```

The worker is therefore independently restartable from the API.

If the worker crashes, PM2 automatically restarts it.

## Cron Integration

The daily users report is scheduled with `node-cron`.

The cron process does not generate the report itself.

Instead:

```text
8 PM Cron
    ↓
reportsQueue.add()
    ↓
Redis
    ↓
Reports Worker
    ↓
MongoDB
    ↓
HTML
    ↓
Puppeteer
    ↓
PDF
    ↓
Email
```

This keeps the cron callback lightweight.

## Excel Exports

AdminSphere already has a synchronous Excel export using ExcelJS.

It was intentionally not moved to BullMQ.

Current flow:

```text
Request
   ↓
MongoDB
   ↓
ExcelJS
   ↓
XLSX buffer
   ↓
HTTP response
```

Excel generation is currently lightweight enough for the expected project workload.

If exports become significantly larger in the future, they can be converted into asynchronous export jobs.

## Current Scope

The background-job system intentionally avoids unnecessary complexity.

Implemented:

- BullMQ queues
- Dedicated workers
- Redis-backed job storage
- Email jobs
- PDF report jobs
- Retry and exponential backoff
- Job IDs
- Concurrency control
- Failed-job retention
- Worker error handling
- Winston logging
- Graceful shutdown
- PM2 process management
- Production deployment

Not currently implemented:

- Dedicated Dead Letter Queue
- Full idempotency framework
- Queue monitoring dashboard
- Real-time job progress UI
- Asynchronous Excel exports

These can be introduced if actual application requirements justify them.
