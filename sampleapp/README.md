# Multi-tenant TODO App

A Next.js application with multi-tenancy and role-based access control (RBAC) for managing TODOs.

## Features

- **Multi-tenancy**: Each user belongs to a tenant (organization)
- **Role-Based Access Control (RBAC)**:
  - **Owner**: Can do everything within a tenant
  - **Manager**: Can invite users and manage TODOs for all users
  - **User**: Can only manage their own TODOs
- **User Management**: Invite users to your tenant with specific roles
- **TODO Management**: Create, read, update, and delete TODOs

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Database**: SQLite3 with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/shisho-security/devin-playground-01.git
cd devin-playground-01
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Create and seed the database
npx prisma db push
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Registration

1. Navigate to `/register` to create a new account and tenant.
2. Fill in your details and tenant (organization) name.
3. After registration, you'll be redirected to the login page.

### Login

1. Navigate to `/auth//login` and enter your credentials.
2. After successful login, you'll be redirected to the dashboard.

### Dashboard

The dashboard displays all TODOs for the current user. If you're an owner or manager, you can see TODOs for all users in your tenant.

### User Management

1. If you're an owner or manager, you can access the user management page from the dashboard.
2. Here you can invite new users to your tenant.
3. Only owners can create managers.

### TODO Management

1. Create new TODOs from the dashboard.
2. Click on a TODO to view, edit, or delete it.
3. Mark TODOs as completed when done.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
