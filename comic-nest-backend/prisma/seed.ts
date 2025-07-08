import { seedSubscriptionTiers } from "./seeds/seed-subscriptionTiers";
import { seedUsers } from "./seeds/seed-users";

async function main() {
  await seedSubscriptionTiers();
  await seedUsers();
}

main()
  .then(() => {
    console.log('Seeding complete.');
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  });