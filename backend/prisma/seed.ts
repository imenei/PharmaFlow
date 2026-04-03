import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@pharma.local' },
    update: {},
    create: {
      email: 'admin@pharma.local',
      passwordHash,
      role: UserRole.ADMIN,
      status: UserStatus.APPROVED,
      companyName: 'Administration',
    },
  });

  const plans = [
    { name: 'Bronze', price: 10000, durationDays: 30, features: ['Visibilite', 'Support standard'] },
    { name: 'Argent', price: 15000, durationDays: 30, features: ['Mise en avant', 'Notifications'] },
    { name: 'Or', price: 25000, durationDays: 30, features: ['Priorite', 'Annonce accueil'] },
  ];

  for (const plan of plans) {
    await prisma.subscriptionPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Bejaia', 'Biskra', 'Bechar', 'Blida', 'Bouira',
    'Tamanrasset', 'Tebessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Setif', 'Saida',
    'Skikda', 'Sidi Bel Abbes', 'Annaba', 'Guelma', 'Constantine', 'Medea', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla',
    'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arreridj', 'Boumerdes', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naama', 'Ain Temouchent', 'Ghardaia', 'Relizane',
    'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Beni Abbes', 'In Salah', 'In Guezzam', 'Touggourt', 'Djanet',
    "El M'Ghair", 'El Meniaa',
  ];

  for (const [index, nom] of wilayas.entries()) {
    await prisma.wilaya.upsert({
      where: { code: index + 1 },
      update: { nom },
      create: { code: index + 1, nom },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
