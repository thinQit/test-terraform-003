import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);

  await prisma.user.create({
    data: {
      email: 'admin@datapulse.io',
      name: 'Admin User',
      passwordHash,
      role: 'admin'
    }
  });

  await prisma.feature.create({
    data: {
      title: 'Real-time metrics',
      description: 'Monitor your KPIs live with instant updates across teams.',
      icon: 'chart'
    }
  });

  await prisma.feature.create({
    data: {
      title: 'Team dashboards',
      description: 'Share customizable dashboards and insights with your team.',
      icon: 'dashboard'
    }
  });

  await prisma.feature.create({
    data: {
      title: 'Automated reports',
      description: 'Schedule weekly digests and export data with ease.',
      icon: 'report'
    }
  });

  await prisma.plan.create({
    data: {
      name: 'Starter',
      priceMonthly: 29,
      priceAnnual: 290,
      features: JSON.stringify(['Live Dashboards', 'Email Support', 'Up to 3 users'])
    }
  });

  await prisma.plan.create({
    data: {
      name: 'Pro',
      priceMonthly: 59,
      priceAnnual: 590,
      features: JSON.stringify(['Unlimited users', 'Advanced alerts', 'Priority support'])
    }
  });

  await prisma.plan.create({
    data: {
      name: 'Enterprise',
      priceMonthly: 0,
      priceAnnual: 0,
      features: JSON.stringify(['Dedicated success', 'Custom SLAs', 'Security reviews'])
    }
  });

  await prisma.subscriber.create({
    data: {
      email: 'earlyaccess@datapulse.io',
      source: 'hero'
    }
  });

  await prisma.contactMessage.create({
    data: {
      name: 'Jordan Analytics',
      email: 'jordan@example.com',
      message: 'Looking for an enterprise rollout in Q3.',
      planId: 'enterprise'
    }
  });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
