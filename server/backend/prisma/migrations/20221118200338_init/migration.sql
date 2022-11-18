/*
  Warnings:

  - You are about to drop the column `roleId` on the `RoleRestriction` table. All the data in the column will be lost.
  - Added the required column `roleName` to the `RoleRestriction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoleRestriction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleName" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "weekday" TEXT NOT NULL,
    CONSTRAINT "RoleRestriction_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "Role" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoleRestriction" ("end", "id", "start", "weekday") SELECT "end", "id", "start", "weekday" FROM "RoleRestriction";
DROP TABLE "RoleRestriction";
ALTER TABLE "new_RoleRestriction" RENAME TO "RoleRestriction";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
