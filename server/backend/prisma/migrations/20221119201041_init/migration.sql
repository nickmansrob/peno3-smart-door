/*
  Warnings:

  - You are about to drop the column `roleName` on the `RoleRestriction` table. All the data in the column will be lost.
  - You are about to drop the column `roleName` on the `User` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `RoleRestriction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RoleRestriction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "weekday" TEXT NOT NULL,
    CONSTRAINT "RoleRestriction_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RoleRestriction" ("end", "id", "start", "weekday") SELECT "end", "id", "start", "weekday" FROM "RoleRestriction";
DROP TABLE "RoleRestriction";
ALTER TABLE "new_RoleRestriction" RENAME TO "RoleRestriction";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "faceDescriptor" TEXT NOT NULL,
    "tfaToken" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "dateCreated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("dateCreated", "enabled", "faceDescriptor", "firstName", "id", "lastName", "tfaToken") SELECT "dateCreated", "enabled", "faceDescriptor", "firstName", "id", "lastName", "tfaToken" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
