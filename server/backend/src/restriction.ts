import { Response, Request } from 'express'
import { prisma } from './database.js'
import { RoleRestriction, UserRestriction } from './types.js'

export async function handleUserRestrictionView(_req: Request, res: Response): Promise<void> {
  res.json(getUserRestrictions())
}

async function getUserRestrictions(id?: number) {
  if (id) {
    return (await prisma.user.findUnique({
      where: {
        id: id
      },
      include: {
        restrictions: true,
      },
    }))?.restrictions
  } else {
    return await prisma.userRestriction.findMany() // TODO: return all restrictions
  }
}

export async function handleNewUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleEditUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleDeleteUserRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}


// Role restrictions

export async function handleRoleRestrictionView(_req: Request, res: Response): Promise<void> {
  res.json(getRoleRestrictions())
}

async function getRoleRestrictions(id?: number) {
  if (id) {
    return (await prisma.role.findUnique({
      where: {
        id: id
      },
      include: {
        restrictions: true,
      },
    }))?.restrictions
  } else {
    return await prisma.roleRestriction.findMany() // TODO: return all restrictions
  }
}

export async function handleNewRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleEditRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}

export async function handleDeleteRoleRestriction(req: Request, res: Response): Promise<void> {
  // TODO: implement
}
