# Easyres

A full-stack job application tracking and career management platform built with modern web technologies. Easyres helps job seekers organize their job search, manage applications, and leverage AI to enhance their career documents.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Development](#development)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Backend Architecture](#backend-architecture)
  - [Controllers](#controllers)
  - [Services](#services)
  - [Repositories](#repositories)
  - [Entities](#entities)
  - [Database Configuration](#database-configuration)
  - [Middleware](#middleware)
  - [Mailer System](#mailer-system)
  - [Dependency Injection](#dependency-injection)
  - [API Response Pattern](#api-response-pattern)
- [License](#license)

## Overview

Easyres is a comprehensive job application management system designed to streamline the job search process. It provides tools for tracking applications, managing resumes and cover letters, and utilizing AI-powered assistance to improve career documents and provide job-related guidance.

## Problem Statement

Job searching is a complex and often overwhelming process. Job seekers typically face several challenges:

1. **Disorganization**: Tracking multiple applications across different platforms (LinkedIn, Glassdoor, company websites) is difficult and error-prone.

2. **Document Management**: Managing multiple versions of resumes and cover letters for different positions is time-consuming and leads to confusion.

3. **Lack of Insights**: Without proper tracking, candidates lose visibility into their application pipeline, success rates, and areas for improvement.

4. **Time-Consuming Tasks**: Writing tailored cover letters and optimizing resumes for each application requires significant effort.

5. **Status Tracking**: Keeping track of application statuses (applied, interviewing, rejected, offered) across dozens of applications is challenging.

Easyres solves these problems by providing:

- A centralized dashboard to track all job applications in one place
- Resume and cover letter management with cloud storage
- AI-powered chat assistance for career-related questions
- Analytics and insights into your job search progress
- Status tracking with customizable application pipelines
- Notifications to keep you updated on important events

## Features

### Application Tracking

- Create, update, and delete job applications
- Track application status (Applied, Interviewing, Offered, Rejected, etc.)
- Store job details including employer, title, location, salary range, and platform
- Add comments and notes to applications
- Link resumes and cover letters to specific applications

### Resume Management

- Upload and store multiple resumes
- Rename and organize resumes
- Cloud storage with Cloudflare R2

### Cover Letter Management

- Upload and manage cover letters
- Associate cover letters with specific applications
- Cloud-based storage for easy access

### AI-Powered Assistant

- Chat-based AI assistant powered by Google Gemini
- Career guidance and job search advice
- Resume and cover letter improvement suggestions
- Persistent chat history with session management

### User Management

- User authentication and authorization
- Email verification
- Session management
- Job preferences configuration

### Analytics and Dashboard

- Application tracking statistics
- Visual analytics charts
- Progress monitoring over time

### Notifications

- In-app notifications for important events
- Read/unread status tracking

## Tech Stack

### Backend

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript/TypeScript runtime
- **Framework**: [@razvan11/paladin](https://www.npmjs.com/package/@razvan11/paladin) - Backend framework built on top of Hono
- **HTTP**: [Hono](https://hono.dev) - Lightweight web framework
- **Database**: PostgreSQL with [TypeORM](https://typeorm.io)
- **Validation**: class-validator
- **AI**: Google Gemini AI (@google/genai)
- **Storage**: Cloudflare R2
- **Authentication**: Better Auth with JWT

### Frontend

- **Library**: React 19 with TypeScript
- **Router**: React Router v7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: HeroUI, Radix UI, Headless UI
- **Styling**: Tailwind CSS v4
- **Rich Text Editor**: TipTap
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Heroicons, Iconify, Lucide React
- **PDF Handling**: react-pdf, pdfjs-dist

### Development Tools

- **Linting/Formatting**: Biome
- **Build**: Bun bundler
- **CSS Processing**: Tailwind CLI
- **Testing**: Bun test runner
- **Git Hooks**: Husky

## Project Structure

```
easyres/
├── apps/
│   ├── common/           # Shared utilities and validators
│   │   └── EnvValidator.ts
│   ├── paladin/          # Backend application
│   │   ├── controllers/  # API route handlers
│   │   ├── entities/     # TypeORM database entities
│   │   ├── handlers/     # Request handlers
│   │   ├── mailer/       # Email templates and services
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   ├── repositories/ # Data access layer
│   │   ├── services/     # Business logic
│   │   └── shared/       # Shared backend utilities
│   ├── ruby/             # Frontend React application
│   │   ├── __init__/     # App entry point
│   │   ├── applications/ # Applications feature
│   │   ├── ask/          # AI chat feature
│   │   ├── dashboard/    # Dashboard views
│   │   ├── hero/         # Landing page
│   │   ├── jobs/         # Job listings
│   │   ├── notifications/# Notifications feature
│   │   ├── resources/    # Resume/Cover letter management
│   │   ├── settings/     # User settings
│   │   ├── shared/       # Shared components and utilities
│   │   ├── signin/       # Sign in page
│   │   └── signup/       # Sign up flow
│   └── sdk/              # API SDK types
├── dev/                  # Development configuration
├── migrations/           # Database migrations
└── tests/                # Test files
```

## Environment Variables

The application requires the following environment variables to be configured. Create a `.env` file in the project root with the following variables:

### Required Environment Variables

| Variable               | Description                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `APP_DATABASE_URL`     | PostgreSQL connection string for the primary database. Format: `postgresql://user:password@host:port/database` |
| `APP_URL`              | Base URL of the application (e.g., `http://localhost:3000` for development)                                    |
| `R2_ACCESS_KEY`        | Cloudflare R2 access key ID for file storage                                                                   |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret access key for file storage                                                               |
| `R2_ENDPOINT`          | Cloudflare R2 endpoint URL                                                                                     |
| `R2_BUCKET_NAME`       | Name of the R2 bucket for storing files (resumes, cover letters)                                               |
| `GEMINI_API_KEY`       | Google Gemini API key for AI chat functionality                                                                |

### Example `.env` File

```env
# Database
APP_DATABASE_URL=postgresql://postgres:password@localhost:5432/easyres

# Application
APP_URL=http://localhost:3000

# Cloudflare R2 Storage
R2_ACCESS_KEY=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_BUCKET_NAME=easyres-files

# Google AI
GEMINI_API_KEY=your_gemini_api_key
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.3.5 or higher
- [Docker](https://www.docker.com/) (for local PostgreSQL database)
- Node.js 18+ (optional, for some tooling)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/easyres.git
   cd easyres
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development environment:
   ```bash
   bun run dev
   ```

This command will:

- Start a PostgreSQL database in Docker
- Compile Tailwind CSS in watch mode
- Build the React frontend with hot reloading
- Start the backend server with auto-reload

## Development

### Available Scripts

| Command                 | Description                                        |
| ----------------------- | -------------------------------------------------- |
| `bun run dev`           | Start the full development environment             |
| `bun run fmt`           | Format code with Biome                             |
| `bun run lint`          | Lint code with Biome                               |
| `bun run test`          | Run tests                                          |
| `bun run test:watch`    | Run tests in watch mode                            |
| `bun run test:coverage` | Run tests with coverage                            |
| `bun run wrangler`      | Start Wrangler dev server (for Cloudflare Workers) |

### Development Architecture

The development environment uses `concurrently` to run multiple processes:

1. **Docker**: Manages PostgreSQL database container
2. **Tailwind**: Compiles CSS in watch mode
3. **Ruby (Frontend)**: Builds React app with Bun bundler
4. **Paladin (Backend)**: Runs the API server with hot reload

## Database Migrations

The project uses TypeORM for database management.

### Generate a Migration

```bash
bun run db:migrate
```

### Run Migrations

```bash
bun run db:run
```

### Revert Last Migration

```bash
bun run db:revert
```

## Testing

Run the test suite:

```bash
bun run test
```

Run tests in watch mode:

```bash
bun run test:watch
```

Run tests with coverage:

```bash
bun run test:coverage
```

## API Endpoints

### Authentication

- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signout` - Sign out user

### Applications

- `GET /api/applications/:userId` - Get all applications for a user
- `GET /api/applications/single/:id` - Get single application
- `POST /api/applications/create` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/delete` - Delete applications

### Resumes

- `GET /api/resumes/:userId` - Get all resumes for a user
- `GET /api/resumes/single/:id` - Get single resume
- `POST /api/resumes/upload` - Upload new resume
- `PUT /api/resumes/rename/:id` - Rename resume
- `DELETE /api/resumes/delete` - Delete resumes

### Cover Letters

- `GET /api/coverletters/:userId` - Get all cover letters for a user
- `GET /api/coverletters/single/:id` - Get single cover letter
- `POST /api/coverletters/upload` - Upload new cover letter
- `PUT /api/coverletters/rename/:id` - Rename cover letter
- `DELETE /api/coverletters/delete` - Delete cover letters

### Jobs

- `GET /api/jobs/listings` - Get job listings
- `GET /api/jobs/listing/:id` - Get single job listing
- `GET /api/jobs/matches/:userId` - Get job matches for user
- `GET /api/jobs/preferences/:userId` - Get user job preferences
- `PUT /api/jobs/preferences/:userId` - Update job preferences

### Chat History

- `GET /api/chat-history/sessions/:userId` - Get chat sessions
- `POST /api/chat-history/sessions` - Create new chat session
- `DELETE /api/chat-history/sessions/:sessionId` - Delete chat session

### Users

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user

### Analytics

- `GET /api/analytics/:userId` - Get user analytics data

### Notifications

- `GET /api/notifications/:userId` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

---

## Backend Architecture

The backend follows a layered architecture pattern using the `@razvan11/paladin` framework, which provides decorator-based dependency injection and routing on top of Hono.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Controllers                              │
│    (Handle HTTP requests, validate input, return responses)     │
├─────────────────────────────────────────────────────────────────┤
│                          Services                                │
│         (Business logic, external integrations, AI)             │
├─────────────────────────────────────────────────────────────────┤
│                        Repositories                              │
│            (Data access layer, database queries)                │
├─────────────────────────────────────────────────────────────────┤
│                          Entities                                │
│              (TypeORM models, database schema)                  │
├─────────────────────────────────────────────────────────────────┤
│                     PrimaryDatabase                              │
│           (Database connection and configuration)               │
└─────────────────────────────────────────────────────────────────┘
```

### Controllers

Controllers handle incoming HTTP requests and delegate business logic to services. They use decorators for routing and dependency injection.

| Controller                | Path                 | Description                                                                       |
| ------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| `AuthController`          | `/api/auth`          | User authentication (signup, signin, signout, email verification, password reset) |
| `ApplicationsController`  | `/api/applications`  | Job application CRUD operations                                                   |
| `ResumesController`       | `/api/resumes`       | Resume upload, retrieval, rename, and deletion                                    |
| `CoverlettersController`  | `/api/coverletters`  | Cover letter management                                                           |
| `ChatHistoryController`   | `/api/chat-history`  | AI chat session management                                                        |
| `AnalyticsController`     | `/api/analytics`     | User analytics and statistics                                                     |
| `JobsController`          | `/api/jobs`          | Job listings, matches, and preferences                                            |
| `NotificationsController` | `/api/notifications` | User notification management                                                      |
| `UsersController`         | `/api/users`         | User profile operations                                                           |
| `UploadController`        | `/api/upload`        | File upload handling                                                              |

**Controller Example:**

```typescript
import { controller, get, post, inject } from "@razvan11/paladin";
import type { Context } from "hono";

@controller("/api/applications")
export class ApplicationsController {
  constructor(
    @inject(PrimaryDatabase) private readonly db: PrimaryDatabase,
    @inject(UserRepository) private readonly userRepo: UserRepository,
    @inject(ApplicationRepository)
    private readonly appRepo: ApplicationRepository,
  ) {}

  @get("/:userId")
  async retrieveAll(
    c: Context,
  ): Promise<ApiResponse<ApplicationEntity[] | null>> {
    // Implementation
  }

  @post("/create")
  async create(
    c: Context,
  ): Promise<ApiResponse<{ newApplication: ApplicationEntity } | null>> {
    // Implementation
  }
}
```

### Services

Services encapsulate business logic and external integrations. They are decorated with `@service()` and injected into controllers.

| Service                | Purpose                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `AuthService`          | Authentication logic using Better Auth, email OTP verification, password management |
| `StorageService`       | File uploads to Cloudflare R2 (resumes, cover letters, avatars)                     |
| `AiChatSessionService` | AI chat session management, message history, context building                       |
| `AiMessageService`     | Google Gemini AI integration for generating responses                               |
| `NotificationService`  | Creating and managing user notifications                                            |
| `JobFetchingService`   | External job listing aggregation                                                    |

**AuthService Features:**

- User registration with email verification
- OTP-based email verification
- Password reset flow
- Session management with Better Auth
- Custom database field mappings

**StorageService Features:**

- S3-compatible client for Cloudflare R2
- Separate buckets for avatars, resumes, and cover letters
- Automatic file naming with timestamps

**AiChatSessionService Features:**

- Create and manage chat sessions
- Persistent message storage
- Conversation context building for AI
- Session caching for performance

### Repositories

Repositories provide a data access layer with common CRUD operations. They abstract database queries and use TypeORM.

| Repository              | Entity              | Key Methods                                              |
| ----------------------- | ------------------- | -------------------------------------------------------- |
| `ApplicationRepository` | `ApplicationEntity` | `findByUser()`, `findByUserAndStatus()`, `countByUser()` |
| `ResumeRepository`      | `ResumeEntity`      | `findByUserId()`, `findByIds()`                          |
| `CoverletterRepository` | `CoverletterEntity` | `findByUserId()`, `findByIds()`                          |
| `UserRepository`        | `UserEntity`        | `findOne()`, `findOneOrFail()`, `findByEmail()`          |
| `ChatSessionRepository` | `ChatSessionEntity` | `findByUserId()`, `findWithMessages()`                   |
| `ChatMessageRepository` | `ChatMessageEntity` | `findBySessionId()`, `createMessage()`                   |

**Repository Pattern:**

```typescript
import { inject, repository } from "@razvan11/paladin";
import { PrimaryDatabase } from "@paladin/shared/database/PrimaryDatabase";

@repository()
export class ApplicationRepository {
  constructor(@inject(PrimaryDatabase) private database: PrimaryDatabase) {}

  public async open(): Promise<Repository<ApplicationEntity>> {
    return await this.database.open(ApplicationEntity);
  }

  public async findByUser(userId: string): Promise<ApplicationEntity[]> {
    const repository = await this.open();
    return await repository.find({
      where: { user: { id: userId } },
      relations: { user: true, resume: true, coverletter: true },
      order: { createdAt: "DESC" },
    });
  }
}
```

### Entities

TypeORM entities define the database schema. All entities use `nanoid` for primary key generation.

| Entity                     | Table                  | Description                              |
| -------------------------- | ---------------------- | ---------------------------------------- |
| `UserEntity`               | `users`                | User profiles with authentication fields |
| `UserSessionEntity`        | `user_sessions`        | Active user sessions                     |
| `UserAccountEntity`        | `user_accounts`        | OAuth/provider accounts                  |
| `UserVerificationEntity`   | `user_verifications`   | Email verification tokens                |
| `UserJobPreferencesEntity` | `user_job_preferences` | Job search preferences                   |
| `ApplicationEntity`        | `applications`         | Job applications with status tracking    |
| `ResumeEntity`             | `resumes`              | Uploaded resume files                    |
| `CoverletterEntity`        | `coverletters`         | Uploaded cover letters                   |
| `ChatSessionEntity`        | `chat_sessions`        | AI chat sessions                         |
| `ChatMessageEntity`        | `chat_messages`        | Individual chat messages                 |
| `NotificationEntity`       | `notifications`        | User notifications                       |
| `JobListingEntity`         | `job_listings`         | Scraped job listings                     |
| `JobMatchEntity`           | `job_matches`          | User-job matching results                |

**ApplicationEntity Example:**

```typescript
@Entity({ name: "applications" })
export class ApplicationEntity {
  @PrimaryColumn({ name: "id", type: "varchar", length: 15 })
  id: string = random.nanoid(15);

  @ManyToOne("UserEntity", { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => ResumeEntity, { nullable: true })
  @JoinColumn({ name: "resume_id" })
  resume?: ResumeEntity;

  @Column({ name: "employer", type: "varchar" })
  employer: string;

  @Column({ name: "job_title", type: "varchar" })
  jobTitle: string;

  @Column({
    name: "status",
    type: "enum",
    enum: ["Applied", "Interviewing", "Accepted", "Rejected"],
    default: "Applied",
  })
  status: "Applied" | "Interviewing" | "Accepted" | "Rejected";

  @Column({ name: "comments", type: "text", array: true, default: "{}" })
  comments: string[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt?: Date | null; // Soft delete support
}
```

### Database Configuration

The `PrimaryDatabase` class manages database connections using TypeORM with PostgreSQL.

**Features:**

- Lazy connection initialization
- Connection pooling
- Migration support
- Entity manager access

```typescript
@database({ migrations: "migrations" })
export class PrimaryDatabase {
  constructor(
    @inject("APP_DATABASE_URL")
    private readonly url: string,
  ) {}

  public getSource(): DataSource {
    if (this.source) return this.source;

    this.source = new DataSource({
      type: "postgres",
      url: this.url,
      synchronize: false,
      entities: PrimaryEntities,
    });

    return this.source;
  }

  public async open<Entity>(
    entity: EntityTarget<Entity>,
  ): Promise<Repository<Entity>> {
    const source = this.getSource();
    if (!source.isInitialized) await source.initialize();
    return source.getRepository(entity);
  }
}
```

### Middleware

Authentication middleware validates user sessions and attaches user context to requests.

```typescript
export function createAuthMiddleware(authService: AuthService) {
  return async function authMiddleware(c: Context, next: Next) {
    const session = await authService.getSession(c.req.raw.headers);

    if (session?.user) {
      c.set("userId", session.user.id);
    }

    await next();
  };
}
```

### Mailer System

The mailer system handles transactional emails with support for multiple templates and localization.

| Component                        | Purpose                               |
| -------------------------------- | ------------------------------------- |
| `PrimaryMailer`                  | Production email sending via Resend   |
| `DevMailer`                      | Development mode with console logging |
| `SignupEmailCheckMailer`         | OTP verification for new signups      |
| `ForgetPasswordEmailCheckMailer` | Password reset OTP emails             |

**Mailer Structure:**

```
apps/paladin/mailer/
├── PrimaryMailer.ts      # Production mailer (Resend)
├── DevMailer.ts          # Development mailer (console)
├── getMailer.ts          # Mailer factory
├── renderers.ts          # Email template rendering
├── signupCheck/          # Signup verification templates
│   ├── SignupEmailCheckMailer.ts
│   └── templates/
└── forgotPassword/       # Password reset templates
    ├── ForgetPasswordEmailCheckMailer.ts
    └── templates/
```

### Dependency Injection

The `@razvan11/paladin` framework provides decorator-based dependency injection:

| Decorator              | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `@controller('/path')` | Registers a class as an HTTP controller       |
| `@service()`           | Registers a class as a singleton service      |
| `@repository()`        | Registers a class as a data repository        |
| `@database()`          | Registers a database connection provider      |
| `@inject(Token)`       | Injects a dependency by class or string token |
| `@get('/path')`        | Maps method to GET request                    |
| `@post('/path')`       | Maps method to POST request                   |
| `@put('/path')`        | Maps method to PUT request                    |
| `@del('/path')`        | Maps method to DELETE request                 |

### API Response Pattern

All API responses follow a consistent structure:

```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  isNotFound?: boolean;
  isServerError?: boolean;
  isClientError?: boolean;
  isUnauthorized?: boolean;
  isForbidden?: boolean;
}
```

**Usage in controllers:**

```typescript
return apiResponse(c, {
  data: applications,
  message: "Applications retrieved successfully",
});

// Error response
return apiResponse(
  c,
  {
    data: null,
    message: "User not found",
    isNotFound: true,
  },
  404,
);
```

---

## License

This project is private and proprietary.
