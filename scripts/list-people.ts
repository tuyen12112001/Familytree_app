import 'dotenv/config';
import path from 'node:path';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({ url: `file:${path.resolve(process.cwd(), 'dev.db')}` });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const rows = await prisma.person.findMany({
    orderBy: { id: 'asc' },
    select: { id: true, fullName: true },
  });
  console.log('Tổng số bản ghi trong DB:', rows.length);
  for (const r of rows) console.log(`${r.id}  ${r.fullName}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
