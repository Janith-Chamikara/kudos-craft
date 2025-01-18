import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

const companyTypes = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Retail',
  'Manufacturing',
];
const workspaceNames = [
  'Customer Feedback Hub',
  'Voice of Customer',
  'User Research Lab',
  'Product Insights',
  'Market Analysis',
  'Customer Experience',
  'Service Feedback',
  'Review Management',
  'Support Insights',
  'Quality Assurance',
  'Customer Success',
  'Satisfaction Metrics',
  'Experience Analytics',
  'Feedback Loop',
  'Performance Insights',
];

const workspaceDescriptions = [
  'Centralizing customer feedback to drive product improvements',
  'Analyzing customer sentiment and satisfaction metrics',
  'Managing and tracking user research initiatives',
  'Gathering insights for product development and iteration',
  'Monitoring market trends and customer preferences',
  'Optimizing customer experience through feedback analysis',
];

const reviewerNames = [
  'Sarah Johnson',
  'Michael Chen',
  'Emma Davis',
  'James Wilson',
  'Maria Garcia',
  'David Kim',
  'Lisa Brown',
  'Robert Taylor',
  'Jennifer Lee',
  'William Anderson',
  'Patricia Martinez',
  'John Smith',
  'Jessica White',
  'Thomas Moore',
  'Rachel Black',
];

// Separate positive and negative review comments
const positiveReviews = [
  'The platform has significantly improved our customer feedback process. The analytics are particularly insightful.',
  'Outstanding tool for managing customer feedback. The interface is intuitive and reporting features are comprehensive.',
  'Great experience using this platform. It has helped us identify key areas for improvement.',
  'Very satisfied with the functionality. The automated categorization of feedback is extremely helpful.',
  'The dashboard provides excellent visibility into our metrics. Worth every penny!',
  'This tool has transformed how we handle customer feedback. The integration capabilities are excellent.',
  'Impressive analytics capabilities. The trend analysis has been particularly valuable for our team.',
  'Exceptional customer support team. They respond quickly and effectively to our needs.',
  'The platform effectively streamlines our feedback collection. Very user-friendly interface.',
  'Love how easy it is to generate reports. Saves us hours of manual work each week.',
];

const negativeReviews = [
  'The system is frequently slow and unresponsive. Customer support takes days to reply.',
  'Too expensive for the features provided. Many basic functions require premium subscription.',
  'User interface is confusing and complicated. Needs significant improvement.',
  'Data export functionality is broken. Have been waiting for a fix for months.',
  "Poor integration capabilities. Doesn't work well with our existing tools.",
  'The analytics are unreliable. Often shows inconsistent results.',
  'Constant bugs and glitches make this tool frustrating to use.',
  'Customer support is unhelpful and slow. Would not recommend.',
  'The platform crashes frequently during peak hours. Very unreliable.',
  'Difficult to navigate and use. Training new team members is a nightmare.',
];

const neutralReviews = [
  'Average tool with some good features but room for improvement.',
  'Works okay for basic needs but lacks advanced functionality.',
  'Decent platform but pricing could be more competitive.',
  'Some features work well, others need improvement. Mixed experience overall.',
  'Meets basic requirements but nothing exceptional.',
  "Middle-of-the-road solution. Does the job but doesn't exceed expectations.",
  'Functional but could use some UI/UX improvements.',
  'Acceptable performance but occasional technical issues.',
  'Standard features work fine but advanced analytics need work.',
  'Moderate learning curve. Takes time to understand all features.',
];

async function main() {
  const salt = await bcrypt.genSalt();
  const password = await bcrypt.hash('11111111', salt);

  // Create main user (Janith)
  const janith = await prisma.user.create({
    data: {
      email: 'janithchamikara@gmail.com',
      firstName: 'Janith',
      lastName: 'Chamikara',
      password: password,
      bio: 'Full Stack Developer specializing in customer feedback systems',
      usage: 'business',
      role: 'admin',
      companyName: 'TechCorp Solutions',
      industryType: 'Technology',
      numberOfEmployees: '50-200',
      job: 'Senior Developer',
      isInitialSetupCompleted: true,
      createdAt: new Date('2023-01-01'),
    },
  });

  // Create 9 more users
  const users = await Promise.all(
    Array.from({ length: 9 }, async (_, i) => {
      return prisma.user.create({
        data: {
          email: `user${i + 1}@example.com`,
          firstName: `FirstName${i + 1}`,
          lastName: `LastName${i + 1}`,
          password: password,
          bio: `Experienced professional in ${companyTypes[i % companyTypes.length]}`,
          usage: i % 2 === 0 ? 'personal' : 'business',
          role: 'user',
          companyName: `Company ${i + 1}`,
          industryType: companyTypes[i % companyTypes.length],
          numberOfEmployees: ['10-50', '50-200', '200-500'][i % 3],
          job: ['Manager', 'Director', 'Analyst'][i % 3],
          isInitialSetupCompleted: true,
          createdAt: randomDate(new Date('2023-01-01'), new Date('2023-12-31')),
        },
      });
    }),
  );

  // Create 15 workspaces for each user
  const allUsers = [janith, ...users];
  const workspaces = [];

  for (const user of allUsers) {
    const userWorkspaces = await Promise.all(
      Array.from({ length: 15 }, async (_, i) => {
        const createdAt = randomDate(
          new Date('2023-01-01'),
          new Date('2024-01-01'),
        );
        return prisma.workspace.create({
          data: {
            name: workspaceNames[i % workspaceNames.length],
            description:
              workspaceDescriptions[i % workspaceDescriptions.length],
            ownerId: user.id,
            createdAt: createdAt,
            updatedAt: randomDate(createdAt, new Date('2024-01-15')),
          },
        });
      }),
    );
    workspaces.push(...userWorkspaces);
  }

  // Create 20 testimonials for each workspace with mixed sentiments
  for (const workspace of workspaces) {
    await Promise.all(
      Array.from({ length: 20 }, async (_, i) => {
        const createdAt = randomDate(
          workspace.createdAt,
          new Date('2024-01-15'),
        );

        // Determine sentiment and rating based on index to ensure mix
        let sentiment: string;
        let rating: number;
        let review: string;

        if (i < 8) {
          // 40% positive reviews
          sentiment = 'positive';
          rating = parseFloat((4 + Math.random()).toFixed(1)); // 4.0-5.0
          review = positiveReviews[i % positiveReviews.length];
        } else if (i < 14) {
          // 30% negative reviews
          sentiment = 'negative';
          rating = parseFloat((1 + Math.random()).toFixed(1)); // 1.0-2.0
          review = negativeReviews[i % negativeReviews.length];
        } else {
          // 30% neutral reviews
          sentiment = 'positive';
          rating = parseFloat((2.5 + Math.random() * 1.5).toFixed(1)); // 2.5-4.0
          review = neutralReviews[i % neutralReviews.length];
        }

        return prisma.testimonial.create({
          data: {
            name: reviewerNames[i % reviewerNames.length],
            email: `reviewer${i + 1}_${workspace.id.slice(0, 4)}@example.com`,
            ratings: rating,
            review: review,
            workspaceId: workspace.id,
            isAnalyzed: true,
            sentiment: sentiment,
            createdAt: createdAt,
            updatedAt: randomDate(createdAt, new Date('2024-01-15')),
          },
        });
      }),
    );
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
