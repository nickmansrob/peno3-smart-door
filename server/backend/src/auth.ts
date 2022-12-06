import jwt from 'jsonwebtoken'

export function verifyToken(token: string, env: string): boolean {
  if (env === 'frontend') {
    const decoded = jwt.verify(token, process.env.JWT_FRONTEND ?? 'fakeSecret', (err, decoded) => {
      const payload = decoded as {data: string}
      if (!err && payload.data === 'frontend') {
        // Correct token
        return true
      } else {
        return false
      }
    })
  } else {
    console.log('here')
    const decoded = jwt.verify(token, process.env.JWT_PYTHON ?? 'fakeSecret', (err, decoded) => {
      const payload = decoded as {data: string}
      if (!err && payload.data === 'python') {
        // Correct token
        return true
      } else {
        return false
      }
    })
  }

  return false
}
