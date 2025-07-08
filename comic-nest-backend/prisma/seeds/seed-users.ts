// prisma/seeds/seed-users.ts
import { Logger } from '@nestjs/common';
import { PrismaClient, Role, NextAction } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@comicnest.dev' },
    update: {},
    create: {
      email: 'admin@comicapp.dev',
      username: 'admin',
      firstName: 'Comic',
      lastName: 'Admin',
      passwordHash: password,
      emailVerified: true,
      emailVerifiedAt: new Date(),
      mobileVerified: true,
      mobileVerifiedAt: new Date(),
      role: Role.ADMIN,
      nextAction: NextAction.NONE,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@comicapp.dev' },
    update: {},
    create: {
      email: 'user@comicnest.dev',
      username: 'comicfan',
      firstName: 'Comic',
      lastName: 'Reader',
      passwordHash: password,
      emailVerified: false,
      role: Role.USER,
      nextAction: NextAction.EMAIL_VERIFICATION,
    },
  });

  console.log('Users seeded.');
}
