import { sign, verify } from 'jsonwebtoken'

export function verifyToken(token: string, env: string): boolean {
  const decoded = verify(token, process.env.JWT_MAC_SECRET ?? 'fakeSecret', (err, decoded) => {
    
  })
  return true
}