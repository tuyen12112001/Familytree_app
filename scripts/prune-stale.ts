import 'dotenv/config';
import path from 'node:path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: `file:${path.resolve(process.cwd(), 'dev.db')}` });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

// Các bản ghi cũ trùng lặp với p1000..p9000 (ID cũ trước khi đổi trong mock-family.ts)
const staleIds = ['p1000', 'p2000', 'p3000', 'p4000', 'p5000', 'p6000', 'p7000', 'p8000', 'p9000'];

async function main() {
  const result = await prisma.person.deleteMany({ where: { id: { in: staleIds } } });
  console.log(`Đã xóa ${result.count} bản ghi rác trùng lặp.`);
  const remaining = await prisma.person.count();
  console.log(`Còn lại ${remaining} bản ghi trong DB.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
