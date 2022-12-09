import jwt from 'jsonwebtoken'

export function verifyToken(token: string, env: string): boolean {
  if (env === 'frontend') {
    try {
      const res = jwt.verify(token, process.env.JWT_FRONTEND ?? 'fakeSecret') as jwt.JwtPayload
      if (res['data'] === 'frontend') {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  } else {
    try {
      const res = jwt.verify(token, process.env.JWT_PYTHON ?? 'fakeSecret') as jwt.JwtPayload
      if (res['data'] === 'python') {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
