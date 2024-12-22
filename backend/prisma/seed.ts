import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      bio: 'John Doe bio',
      firstName: 'John',
      lastName: 'Doe',
      subscriptionPlan: 'premium',
      role: 'admin',
      password: '453532423', // Make sure this is hashed in a real scenario
      workspaces: {
        create: [
          {
            title: 'Workspace 1',
            details: 'Details of workspace 1',
            testimonial: {
              create: [
                {
                  name: 'Alice',
                  email: 'alice@example.com',
                  ratings: 4.5,
                  review: 'Great service!',
                },
                {
                  name: 'Bob',
                  email: 'bob@example.com',
                  ratings: 4.0,
                  review: 'Good experience.',
                },
              ],
            },
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.doe@example.com',
      bio: 'Jane Doe bio',
      firstName: 'Jane',
      lastName: 'Doe',
      subscriptionPlan: 'free',
      role: 'user',
      password: '1233424', // Make sure this is hashed in a real scenario
      workspaces: {
        create: [
          {
            title: 'Workspace 2',
            details: 'Details of workspace 2',
            testimonial: {
              create: [
                {
                  name: 'Charlie',
                  email: 'charlie@example.com',
                  ratings: 5.0,
                  review: 'Excellent!',
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
