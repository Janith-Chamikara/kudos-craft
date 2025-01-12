/*
  Warnings:

  - You are about to drop the column `updatedat` on the `Testimonial` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Testimonial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ratings" REAL NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isAnalyzed" BOOLEAN NOT NULL DEFAULT false,
    "sentiment" TEXT,
    "workspaceId" TEXT NOT NULL,
    CONSTRAINT "Testimonial_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Testimonial" ("createdAt", "email", "id", "name", "ratings", "review", "workspaceId") SELECT "createdAt", "email", "id", "name", "ratings", "review", "workspaceId" FROM "Testimonial";
DROP TABLE "Testimonial";
ALTER TABLE "new_Testimonial" RENAME TO "Testimonial";
CREATE INDEX "Testimonial_id_idx" ON "Testimonial"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
