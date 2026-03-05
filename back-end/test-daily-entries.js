// back-end/test-simple.js

import 'dotenv/config';
import dailyEntryRepository from './src/repositories/DailyEntryRepository.js';
import userRepository from './src/repositories/UserRepository.js';
import prisma from './src/PrismaClient.js';

async function testSimple() {
  try {
    console.log('🧪 Test simple des repositories\n');

    // 1️⃣ Vérifier la connexion et le nombre d'utilisateurs
    const userCount = await userRepository.count();
    console.log(`✅ Nombre total d'utilisateurs : ${userCount}`);

    // 2️⃣ Chercher un utilisateur par email
    const testEmail = 'jean.dupont@client.com';
    let user = await userRepository.findByEmail(testEmail);

    if (!user) {
      console.log(`⚠ Utilisateur "${testEmail}" non trouvé. Création d'un nouvel utilisateur...`);
      user = await userRepository.create({
        email: testEmail,
        password: 'test',
        first_name: 'Jean',
        last_name: 'Dupont',
        height: 180,
        birth_date: new Date('1990-05-12'),
        dietician_id: null
      });
      console.log(`✅ Utilisateur créé : ${user.email}`);
    } else {
      console.log(`✅ Utilisateur trouvé : ${user.email}`);
    }

    // 3️⃣ Vérifier la récupération des entrées quotidiennes pour cet utilisateur
    if (user) {
      const entries = await dailyEntryRepository.findByUserId(user.id);
      console.log(`✅ Entrées quotidiennes trouvées pour ${user.email} : ${entries.length}`);
    }

    const entries = await dailyEntryRepository.findByUserId(user.id);
    console.log(`✅ Entrées quotidiennes trouvées pour ${user.email} : ${entries.length}`);

    console.log('\n🎉 Test simple terminé avec succès !');
  } catch (err) {
    console.error('❌ Erreur pendant le test :', err);
  } finally {
    await prisma.$disconnect();
  }
}

testSimple();
