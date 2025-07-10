import { Logger } from '@nestjs/common';
import { PrismaClient, Role, NextAction } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  const password = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@comicapp.dev',
      username: 'admin',
      firstName: 'Comic',
      lastName: 'Admin',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      mobileVerified: true,
      mobileVerifiedAt: new Date(),
      role: Role.ADMIN,
      nextAction: NextAction.NONE,
    },
    {
      email: 'user@comicapp.dev',
      firstName: 'Comic',
      lastName: 'Reader',
      emailVerified: false,
      role: Role.USER,
      nextAction: NextAction.EMAIL_VERIFICATION,
    },
  ];

  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          emailVerified: user.emailVerified,
          emailVerifiedAt: user.emailVerifiedAt,
          mobileVerified: user.mobileVerified,
          mobileVerifiedAt: user.mobileVerifiedAt,
          role: user.role,
          nextAction: user.nextAction,
          // Update passwordHash only if necessary
          password: password,
        },
        create: {
          ...user,
          password: password,
        },
      });

      console.log(`Seeded user: ${user.email}`);
    } catch (error) {
      console.log(`Error seeding user: ${user.email}`, error);
    }
  }

  console.log('User seeding completed.');
}
