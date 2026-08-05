import 'dotenv/config';
import path from 'node:path';
import { mockPeople } from '../src/data/mock-family';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

// Kết nối SQLite giống người-store.ts để dùng chung dev.db
const dbPath = path.resolve(process.cwd(), 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  let created = 0;
  let updated = 0;

  for (const person of mockPeople) {
    const data = {
      fullName: person.fullName,
      gender: person.gender,
      birthDate: person.birthDate,
      deathDate: person.deathDate ?? null,
      birthPlace: person.birthPlace ?? null,
      zodiac: person.zodiac ?? null,
      biography: person.biography ?? null,
      avatarUrl: person.avatarUrl ?? null,
      fatherId: person.fatherId ?? null,
      motherId: person.motherId ?? null,
      spouseIds: JSON.stringify(person.spouseIds ?? []),
      childIds: JSON.stringify(person.childIds ?? []),
    };

    const existing = await prisma.person.findUnique({ where: { id: person.id } });
    if (existing) {
      await prisma.person.update({ where: { id: person.id }, data });
      updated++;
    } else {
      await prisma.person.create({ data: { id: person.id, ...data } });
      created++;
    }
  }

  console.log(`Re-seed xong: cập nhật ${updated}, thêm mới ${created} (tổng ${mockPeople.length} trong mock-family.ts).`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Lỗi khi re-seed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
