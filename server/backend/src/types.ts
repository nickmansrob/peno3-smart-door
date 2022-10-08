import { DateTime } from 'luxon'

export type Data = {
    user: User,
}

export type User = {
    id: string,
    firstName: string,
    lastName: string,

    faceId: string,
    tfaId: string,

    roles: string[],

    dateCreated: DateTime,
}

export type IncomingFaceId = {
    id: string,
    timestamp: DateTime,
}
