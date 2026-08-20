import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@payroll.local' },
    update: {},
    create: {
      email: 'admin@payroll.local',
      passwordHash: 'hashed_password_placeholder', // In a real app, hash this!
      role: 'ADMIN',
    },
  })

  // Create Employee 1
  const user1 = await prisma.user.upsert({
    where: { email: 'john@payroll.local' },
    update: {},
    create: {
      email: 'john@payroll.local',
      passwordHash: 'hashed_password_placeholder',
      role: 'EMPLOYEE',
      Employee: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          department: 'Engineering',
          designation: 'Software Engineer',
          baseSalary: 5000,
          joinDate: new Date('2023-01-15'),
          bankAccount: '1234567890',
        }
      }
    }
  })

  // Create Employee 2
  const user2 = await prisma.user.upsert({
    where: { email: 'jane@payroll.local' },
    update: {},
    create: {
      email: 'jane@payroll.local',
      passwordHash: 'hashed_password_placeholder',
      role: 'EMPLOYEE',
      Employee: {
        create: {
          firstName: 'Jane',
          lastName: 'Smith',
          department: 'Marketing',
          designation: 'Marketing Manager',
          baseSalary: 6000,
          joinDate: new Date('2022-11-01'),
          bankAccount: '0987654321',
        }
      }
    }
  })

  console.log('Seed data created:', { admin: admin.email, user1: user1.email, user2: user2.email })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
