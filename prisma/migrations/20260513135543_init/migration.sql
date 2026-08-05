-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "deathDate" TEXT,
    "birthPlace" TEXT,
    "biography" TEXT,
    "avatarUrl" TEXT,
    "fatherId" TEXT,
    "motherId" TEXT,
    "spouseIds" TEXT,
    "childIds" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
