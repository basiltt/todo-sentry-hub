
# NestJS Backend for Todo Application

This is the NestJS backend for the Todo application with role-based access control.

## Installation

```bash
cd nest-server
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Features

- Authentication (login/register)
- Todo management with RBAC
- JWT-based authorization

## API Endpoints

### Authentication
- POST /auth/login - Login with email and password
- POST /auth/register - Register a new user
- GET /auth/me - Get current user info (requires authentication)

### Todo Management
- GET /todos - Get all todos (filtered by user role)
- POST /todos - Create a new todo
- PATCH /todos/:id - Update a todo
- PATCH /todos/:id/toggle - Toggle todo completion status
- DELETE /todos/:id - Delete a todo

## Role-Based Access
- Admin users can see and manage all todos
- Regular users can only see and manage their own todos

## TypeScript Configuration
The project is configured to work properly with NestJS decorators. Make sure the following settings are present in your tsconfig.json:

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false
  }
}
```

## Development Notes
- The backend uses JWT for authentication
- Default users are available for testing (admin@example.com and user@example.com, both with password "password")
- For production, consider implementing proper password hashing and using environment variables for secrets
