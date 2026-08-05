import 'dotenv/config';
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import type { Person } from '../src/types';

// Kết nối SQLite giống people-store.ts để dùng chung dev.db
const dbPath = path.resolve(process.cwd(), 'dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

const outputPath = path.resolve(process.cwd(), 'src/data/family-seed.json');

async function main() {
  // Sắp xếp theo id để mỗi lần export ra cùng thứ tự, git diff không bị xáo trộn
  const rows = await prisma.person.findMany({ orderBy: { id: 'asc' } });

  const people: Person[] = rows.map(row => ({
    id: row.id,
    fullName: row.fullName,
    gender: row.gender as Person['gender'],
    birthDate: row.birthDate,
    // Bỏ hẳn key khi giá trị rỗng để JSON gọn, khớp với kiểu optional của Person
    ...(row.deathDate ? { deathDate: row.deathDate } : {}),
    ...(row.birthPlace ? { birthPlace: row.birthPlace } : {}),
    ...(row.zodiac ? { zodiac: row.zodiac } : {}),
    ...(row.biography ? { biography: row.biography } : {}),
    ...(row.avatarUrl ? { avatarUrl: row.avatarUrl } : {}),
    ...(row.fatherId ? { fatherId: row.fatherId } : {}),
    ...(row.motherId ? { motherId: row.motherId } : {}),
    spouseIds: row.spouseIds ? JSON.parse(row.spouseIds) : [],
    childIds: row.childIds ? JSON.parse(row.childIds) : [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  writeFileSync(outputPath, JSON.stringify(people, null, 2) + '\n', 'utf8');

  // Cảnh báo các tham chiếu trỏ tới ID không tồn tại (thường do xoá người mà quên gỡ liên kết)
  const ids = new Set(people.map(p => p.id));
  const dangling: string[] = [];
  for (const p of people) {
    for (const [label, ref] of [['cha', p.fatherId], ['mẹ', p.motherId]] as const) {
      if (ref && !ids.has(ref)) dangling.push(`${p.id} (${p.fullName}) → ${label} ${ref}`);
    }
    for (const s of p.spouseIds) {
      if (!ids.has(s)) dangling.push(`${p.id} (${p.fullName}) → vợ/chồng ${s}`);
    }
    for (const c of p.childIds) {
      if (!ids.has(c)) dangling.push(`${p.id} (${p.fullName}) → con ${c}`);
    }
  }

  console.log(`Đã export ${people.length} thành viên từ dev.db sang src/data/family-seed.json`);
  if (dangling.length > 0) {
    console.warn(`\nCảnh báo: ${dangling.length} tham chiếu trỏ tới ID không tồn tại:`);
    dangling.forEach(d => console.warn(`  - ${d}`));
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('Lỗi khi export:', err);
  await prisma.$disconnect();
  process.exit(1);
});
