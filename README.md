# Payroll Management Application

A Next.js application for managing employee information, attendance, and payroll-related workflows. The project has separate admin and employee areas, API route handlers, and a Prisma data layer using SQLite for the current development setup.

## Areas in the application

- Admin pages for the dashboard, employees, attendance, and payroll
- An employee-facing dashboard
- API routes for attendance, employees, authentication, and payroll
- Prisma models for users, employees, attendance, and payroll

These describe the structure present in the repository. Check the running application before assuming every workflow is complete or ready for real payroll use.

## Stack

- Next.js App Router and React
- TypeScript
- Prisma ORM
- SQLite
- NextAuth
- bcryptjs

## Main folders

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
    │   └── login/
    └── middleware.ts
```

## Run locally

You will need Node.js, npm, and a local SQLite database.

```bash
git clone https://github.com/padmanaban-mu/payroll-app-demo-.git
cd payroll-app-demo-
npm install
```

Create a local `.env` file with the database URL and authentication settings expected by the app. For the current SQLite setup, the values generally look like this:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="use_a_long_random_secret"
NEXTAUTH_URL="http://localhost:3000"
```

Generate the Prisma client and apply the schema:

```bash
npx prisma generate
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Handling payroll data

The data model includes employee salary and bank-account fields. Use fictional records while testing or demonstrating the project. Do not put real employee details, bank information, passwords, or production database backups in a public repository.

The repository contains a SQLite database file. Check that it contains only safe sample data before sharing the repository. Before using this for actual payroll, review role-based access, authentication, validation, audit trails, calculation rules, encryption, backups, and applicable legal requirements.

## License

No license file was identified for this repository during this update. Add a license if you want to specify the terms under which others may use the project.
