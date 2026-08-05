import { Person } from '@/types';
import { mockPeople } from '@/data/mock-family';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'node:path';

// Tạo adapter kết nối SQLite với đường dẫn tuyệt đối
function createPrismaClient() {
  const dbPath = path.resolve(process.cwd(), 'dev.db');
  const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

// Singleton PrismaClient để tránh tạo nhiều kết nối trong development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Chuyển DB row sang Person type
function deserializePerson(row: {
  id: string;
  fullName: string;
  gender: string;
  birthDate: string;
  deathDate: string | null;
  birthPlace: string | null;
  zodiac: string | null;
  biography: string | null;
  avatarUrl: string | null;
  fatherId: string | null;
  motherId: string | null;
  spouseIds: string | null;
  childIds: string | null;
  createdAt: Date;
  updatedAt: Date;
}): Person {
  return {
    id: row.id,
    fullName: row.fullName,
    gender: row.gender as Person['gender'],
    birthDate: row.birthDate,
    deathDate: row.deathDate ?? undefined,
    birthPlace: row.birthPlace ?? undefined,
    zodiac: row.zodiac ?? undefined,
    biography: row.biography ?? undefined,
    avatarUrl: row.avatarUrl ?? undefined,
    fatherId: row.fatherId ?? undefined,
    motherId: row.motherId ?? undefined,
    spouseIds: row.spouseIds ? JSON.parse(row.spouseIds) : [],
    childIds: row.childIds ? JSON.parse(row.childIds) : [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// Khởi tạo database với mock data nếu DB trống
async function initializeDatabase(): Promise<void> {
  const count = await prisma.person.count();
  if (count === 0) {
    console.log('Database trống, đang seed mock data...');
    for (const person of mockPeople) {
      await prisma.person.create({
        data: {
          id: person.id,
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
          spouseIds: JSON.stringify(person.spouseIds),
          childIds: JSON.stringify(person.childIds),
        },
      });
    }
    console.log(`Đã seed ${mockPeople.length} thành viên vào database.`);
  }
}

let initialized = false;

async function ensureInitialized(): Promise<void> {
  if (!initialized) {
    await initializeDatabase();
    initialized = true;
  }
}

export async function getAllPeople(): Promise<Person[]> {
  await ensureInitialized();
  const rows = await prisma.person.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return rows.map(deserializePerson);
}

export async function getPerson(id: string): Promise<Person | undefined> {
  await ensureInitialized();
  const row = await prisma.person.findUnique({ where: { id } });
  if (!row) return undefined;
  return deserializePerson(row);
}

export async function addPerson(
  person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): Promise<Person> {
  const row = await prisma.person.create({
    data: {
      id: person.id || `p${Date.now()}`,
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
    },
  });
  return deserializePerson(row);
}

export async function updatePerson(
  id: string,
  data: Partial<Person> & { newId?: string }
): Promise<Person | null> {
  const existing = await prisma.person.findUnique({ where: { id } });
  if (!existing) return null;

  // Đổi ID: cập nhật ID mới và toàn bộ tham chiếu ở các thành viên khác
  const newId = data.newId && data.newId !== id ? data.newId : undefined;
  if (newId) {
    const duplicate = await prisma.person.findUnique({ where: { id: newId } });
    if (duplicate) {
      throw new Error(`ID ${newId} đã tồn tại`);
    }
  }

  const row = await prisma.person.update({
    where: { id },
    data: {
      ...(newId && { id: newId }),
      ...(data.fullName !== undefined && { fullName: data.fullName }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.birthDate !== undefined && { birthDate: data.birthDate }),
      ...(data.deathDate !== undefined && { deathDate: data.deathDate ?? null }),
      ...(data.birthPlace !== undefined && { birthPlace: data.birthPlace ?? null }),
      ...(data.zodiac !== undefined && { zodiac: data.zodiac ?? null }),
      ...(data.biography !== undefined && { biography: data.biography ?? null }),
      ...(data.avatarUrl !== undefined && { avatarUrl: data.avatarUrl ?? null }),
      ...(data.fatherId !== undefined && { fatherId: data.fatherId ?? null }),
      ...(data.motherId !== undefined && { motherId: data.motherId ?? null }),
      ...(data.spouseIds !== undefined && {
        spouseIds: JSON.stringify(data.spouseIds),
      }),
      ...(data.childIds !== undefined && {
        childIds: JSON.stringify(data.childIds),
      }),
    },
  });

  // Cập nhật tham chiếu ID cũ → ID mới trong các thành viên khác
  if (newId) {
    const others = await prisma.person.findMany({ where: { id: { not: newId } } });
    for (const other of others) {
      const spouseIds: string[] = other.spouseIds ? JSON.parse(other.spouseIds) : [];
      const childIds: string[] = other.childIds ? JSON.parse(other.childIds) : [];
      const needsUpdate =
        other.fatherId === id ||
        other.motherId === id ||
        spouseIds.includes(id) ||
        childIds.includes(id);
      if (needsUpdate) {
        await prisma.person.update({
          where: { id: other.id },
          data: {
            fatherId: other.fatherId === id ? newId : other.fatherId,
            motherId: other.motherId === id ? newId : other.motherId,
            spouseIds: JSON.stringify(spouseIds.map(s => (s === id ? newId : s))),
            childIds: JSON.stringify(childIds.map(c => (c === id ? newId : c))),
          },
        });
      }
    }
  }

  return deserializePerson(row);
}

export async function deletePerson(id: string): Promise<boolean> {
  const existing = await prisma.person.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.person.delete({ where: { id } });
  return true;
}
