import { DateTime } from 'luxon'
import * as OTPAuth from 'otpauth'

export function createOtp(firstName: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: 'Styx Solutions',
    label: firstName,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: new OTPAuth.Secret,
  })
}

export function getToken(otp: OTPAuth.TOTP): string {
  return otp.generate()
}

export function validateToken(otp: OTPAuth.TOTP, token: string, timestamp: DateTime) {
  return otp.validate({
    token,
    timestamp: timestamp.toMillis(),
    window: 1,
  })
}

export function getUrl(otp: OTPAuth.TOTP): string {
  return otp.toString()
}