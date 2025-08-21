// prisma/seeds/seed-subscriptions.ts
import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSubscriptionTiers() {
  const tiers = [
    {
      name: 'Free',
      description: 'Read free comics forever.',
      price: 0,
      durationDays: 0,
    },
    {
      name: 'Silver',
      description: 'Premium comics for 3 months.',
      price: 199,
      durationDays: 90,
    },
    {
      name: 'Gold',
      description: 'Premium comics, posters, and extended cuts for 6 months.',
      price: 499,
      durationDays: 180,
    },
  ];

  for (const tier of tiers) {
    await prisma.subscriptionTier.upsert({
      where: { name: tier.name },
      update: {
        description: tier.description,
        price: tier.price,
        durationDays: tier.durationDays,
      },
      create: tier,
    });
  }

  console.log('Subscription tiers seeded.');
}
