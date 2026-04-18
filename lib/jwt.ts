import { SignJWT, jwtVerify } from 'jose'

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? '')

export async function createAuthToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyAuthToken(
  token: string,
): Promise<{ username: string; exp: number } | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return { username: payload.username as string, exp: payload.exp as number }
  } catch {
    return null
  }
}

export const AUTH_COOKIE = 'auth-93fyi'

export const AUTH_COOKIE_OPTIONS = {
  domain: '.93.fyi',
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days
}
