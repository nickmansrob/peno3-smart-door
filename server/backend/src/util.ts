import { DateTime } from 'luxon'
import { OutgoingAccess } from './types.js'

export function euclidDistance(point1: number[], point2: number[]): number {
  const sum = point1
    .map((point, index) => {
      return Math.pow(point - point2[index], 2)
    })
    .reduce((previous, current) => previous + current, 0)
  return Math.sqrt(sum)
}

export function serializeFaceDescriptor(arr: string): number[] {
  return Array.from(JSON.parse(arr))
}

export function validateFaceDescriptor(arr: string): boolean {
  const array = serializeFaceDescriptor(arr)

  return array.length === 128
}

// TODO: Add custom type constraints validation

export function evaluateAccess(access: 'GRANTED' | 'DENIED', firstName: string): OutgoingAccess {
  const date = DateTime.now().setZone('Europe/Brussels').toString()
  return { firstName, timestamp: date, access }
}
