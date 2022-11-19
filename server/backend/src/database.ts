import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

export const roleMap = new Map<number, string>()
