# Payroll Management Application

A Next.js application for managing employee records, attendance, and payroll workflows. The codebase includes separate admin and employee areas, API route handlers, authentication integration, and a Prisma data model backed by SQLite in the current development setup.

## Features represented in the codebase

- **Admin dashboard:** an overview area for administrators.
- **Employee management:** employee listing and management pages.
- **Attendance:** attendance management pages and API routes.
- **Payroll:** payroll management pages and API routes.
- **Employee dashboard:** a dedicated employee-facing area.
- **Authentication:** NextAuth route integration and middleware.
- **Data model:** Prisma models for users, employees, attendance, and payroll.

The repository structure documents these areas; verify each workflow in the running application before treating it as production-ready.

## Technology

- Next.js App Router and React
- TypeScript
- Prisma ORM
- SQLite for local development
- NextAuth
- bcryptjs

## Project structure

```text
.
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db
└── src/
    ├── app/
    │   ├── admin/
    │   │   ├── attendance/
    │   │   ├── dashboard/
    │   │   ├── employees/
    │   │   └── payroll/
    │   ├── employee/dashboard/
    │   ├── api/
    │   │   ├── attendance/
    │   │   ├── auth/
    │   │   ├── employee/
    │   │   ├── employees/
    │   │   └── payroll/
    │   └── login/
    └── middleware.ts
```

## Run locally

### Requirements

- Node.js compatible with the installed Next.js version
- npm
- A local SQLite database for the current Prisma configuration

### Setup

```bash
git clone https://github.com/padmanaban-mu/payroll-app-demo-.git
cd payroll-app-demo-
npm install
```

Create a `.env` file and configure the database URL and authentication secret required by the application. For the SQLite schema, the database URL commonly takes this form:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="replace_with_a_long_random_secret"
NEXTAUTH_URL="http://localhost:3000"
```

Generate the Prisma client and prepare the local database:

```bash
npx prisma generate
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Data and security considerations

The Prisma schema includes employee bank-account and salary fields. Use synthetic data for demos. Do not commit real employee information, bank details, credentials, or production database files. Before deployment, review authentication, role checks, input validation, audit logging, encryption, backups, and payroll calculation rules.

The repository currently tracks a SQLite database file. Confirm that it contains only safe sample data before sharing or publishing the repository; this documentation update does not alter or remove it.

## License

No license file was identified during this documentation update. Check licensing before reuse or redistribution.
