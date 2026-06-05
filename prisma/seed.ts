import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Programs
  const programs = [
    { name: 'Bahasa Inggris', price: 250000, description: 'Core Program English Action' },
    { name: 'Matematika', price: 200000, description: 'Bimbingan belajar Matematika semua jenjang' },
    { name: 'Calistung', price: 150000, description: 'Baca, Tulis, Hitung untuk anak usia dini' },
    { name: 'PRISMA', price: 175000, description: 'Menghitung Cepat 10 Jari' },
    { name: 'Preschool', price: 300000, description: 'Program khusus untuk usia mulai 3 tahun' },
  ];

  for (const p of programs) {
    await prisma.program.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
  }

  // 2. Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ea.com' },
    update: {},
    create: {
      name: 'Admin EA',
      email: 'admin@ea.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 3. Create Tutor
  const tutor = await prisma.user.upsert({
    where: { email: 'tutor@ea.com' },
    update: {},
    create: {
      name: 'Tutor Budi',
      email: 'tutor@ea.com',
      password: hashedPassword,
      role: 'TUTOR',
    },
  });

  // Assign skills to tutor
  const engProgram = await prisma.program.findUnique({ where: { name: 'Bahasa Inggris' } });
  const mathProgram = await prisma.program.findUnique({ where: { name: 'Matematika' } });

  if (engProgram && mathProgram) {
    const skills = [
      { tutorId: tutor.id, programId: engProgram.id },
      { tutorId: tutor.id, programId: mathProgram.id },
    ];

    for (const s of skills) {
      await prisma.tutorSkill.upsert({
        where: { tutorId_programId: { tutorId: s.tutorId, programId: s.programId } },
        update: {},
        create: s,
      });
    }
  }

  // 4. Create Parent & Student
  const parent = await prisma.user.upsert({
    where: { email: 'parent@ea.com' },
    update: {},
    create: {
      name: 'Orang Tua Siti',
      email: 'parent@ea.com',
      password: hashedPassword,
      role: 'STUDENT_PARENT',
    },
  });

  const existingStudent = await prisma.student.findFirst({
    where: { name: 'Siswa Jono', parentId: parent.id }
  });

  if (!existingStudent) {
    await prisma.student.create({
      data: {
        name: 'Siswa Jono',
        dateOfBirth: new Date('2018-05-20'),
        parentId: parent.id,
      },
    });
  }

  // 5. Create Locations
  const locations = [
    { name: 'EA Pusat', address: 'Ds. Asem Kec. Lemahabang, Kab. Cirebon', mapsUrl: 'https://maps.google.com/?q=Lemahabang+Cirebon' },
    { name: 'EA Kr. Mekar', address: 'Kr. Mekar, Cirebon', mapsUrl: 'https://maps.google.com/?q=Kr+Mekar+Cirebon' },
    { name: 'EA Ds. Mertapada', address: 'Ds. Mertapada, Cirebon', mapsUrl: 'https://maps.google.com/?q=Mertapada+Cirebon' },
    { name: 'EA Ds. Halimpu', address: 'Ds. Halimpu, Cirebon', mapsUrl: 'https://maps.google.com/?q=Halimpu+Cirebon' },
    { name: 'EA Gunung Jati', address: 'Gunung Jati, Cirebon', mapsUrl: 'https://maps.google.com/?q=Gunung+Jati+Cirebon' },
    { name: 'EA Indramayu', address: 'Indramayu', mapsUrl: 'https://maps.google.com/?q=Indramayu' },
    { name: 'EA Kota Tasikmalaya', address: 'Kota Tasikmalaya', mapsUrl: 'https://maps.google.com/?q=Tasikmalaya' },
  ];

  for (const l of locations) {
    await prisma.location.upsert({
      where: { id: l.name.toLowerCase().replace(/ /g, '-') },
      update: {},
      create: { id: l.name.toLowerCase().replace(/ /g, '-'), ...l },
    });
  }

  // 6. Create Blog Posts
  const posts = [
    { 
      title: '5 Cara Cepat Menghitung dengan Metode PRISMA', 
      slug: 'cara-cepat-prisma',
      content: 'Metode menghitung cepat dengan 10 jari terbukti membantu konsentrasi anak...',
      published: true 
    },
    { 
      title: 'Pentingnya Bahasa Inggris di Era Globalisasi', 
      slug: 'pentingnya-bahasa-inggris',
      content: 'Bahasa Inggris bukan lagi sekadar hobi, melainkan kebutuhan utama di masa depan...',
      published: true 
    },
  ];

  for (const p of posts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }

  // 7. Create Gallery Items
  const gallery = [
    { url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80', title: 'Belajar Bersama' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80', title: 'Kelas Menyenangkan' },
  ];

  for (const g of gallery) {
    await prisma.galleryItem.create({
      data: g,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
