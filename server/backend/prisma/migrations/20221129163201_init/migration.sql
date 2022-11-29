-- CreateTable
CREATE TABLE "User" (
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

-- CreateTable
CREATE TABLE "Role" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT,
    "state" TEXT NOT NULL,
    CONSTRAINT "UserRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "weekday" TEXT NOT NULL,
    CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "roleId" INTEGER NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "weekday" TEXT NOT NULL,
    CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
