/*
  Warnings:

  - You are about to drop the column `updatedat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedat` on the `Workspace` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "usage" TEXT NOT NULL DEFAULT 'personal',
    "companyName" TEXT,
    "industryType" TEXT,
    "numberOfEmployees" INTEGER,
    "job" TEXT,
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'free',
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "password" TEXT NOT NULL,
    "isInitialSetupCompleted" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("bio", "companyName", "createdAt", "email", "firstName", "id", "industryType", "job", "lastName", "numberOfEmployees", "password", "role", "subscriptionPlan", "usage") SELECT "bio", "companyName", "createdAt", "email", "firstName", "id", "industryType", "job", "lastName", "numberOfEmployees", "password", "role", "subscriptionPlan", "usage" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE TABLE "new_Workspace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Workspace_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Workspace" ("createdAt", "details", "id", "ownerId", "title") SELECT "createdAt", "details", "id", "ownerId", "title" FROM "Workspace";
DROP TABLE "Workspace";
ALTER TABLE "new_Workspace" RENAME TO "Workspace";
CREATE INDEX "Workspace_id_idx" ON "Workspace"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
