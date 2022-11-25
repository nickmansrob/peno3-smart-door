import { DateTime } from 'luxon'
import * as OTPAuth from 'otpauth'

export function createOtp(secret: string): OTPAuth.TOTP { // no validation needed
  return new OTPAuth.TOTP({
    issuer: 'Styx Inc.',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret,
  })
}

export function validateToken(otp: OTPAuth.TOTP, token: string, timestamp: DateTime) { // no validation needed
  return otp.validate({
    token,
    timestamp: timestamp.toMillis(),
    window: 1,
  })
}
