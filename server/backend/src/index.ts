import { verifyToken } from './auth.js'
import { start } from './provider.js'

//await start()

console.log(verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoicHl0aG9uIiwiZXhwIjoxNjcwMzQ0ODA2fQ.B5M0mw43GTPD4_q2z4P1J73EB1J8OPfMAEQFX52ym2c', 'python'))
