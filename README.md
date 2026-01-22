# Smart Internal Workflow Approval System

A full-stack web application for managing internal workflow approvals with file uploads and Telegram notifications.

## Features

- ✅ User Authentication (JWT)
- ✅ Multi-step Workflow Approval
- ✅ File Upload & Management
- ✅ Advanced Search & Filtering
- ✅ Telegram Notifications
- ✅ Audit Trail
- ✅ Role-based Access Control

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3.2.1
- PostgreSQL
- Spring Security + JWT
- Telegram Bots API

**Frontend:**
- React 18
- React Router
- Axios

## Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
   cd backend
```

2. Create PostgreSQL database:
```sql
   CREATE DATABASE workflow_db;
```

3. Update `application.properties` with your database credentials

4. Run the application:
```bash
   mvn spring-boot:run
```

Backend will start at: http://localhost:8080

### Frontend Setup

1. Navigate to frontend directory:
```bash
   cd frontend
```

2. Install dependencies:
```bash
   npm install
```

3. Start development server:
```bash
   npm start
```

Frontend will start at: http://localhost:3000

## API Documentation

Coming soon...

## License

MIT