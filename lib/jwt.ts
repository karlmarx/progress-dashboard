import { SignJWT, jwtVerify } from 'jose'

// Issue 1: Extract secret as a constant, validate at module load
function getSecret(): Uint8Array {
  const raw = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!raw) throw new Error('AUTH_SECRET or NEXTAUTH_SECRET env var is not set')
  return new TextEncoder().encode(raw)
}

const SECRET = getSecret() // evaluated once at module load

// Issue 5: Extract session TTL to a constant
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60 // 7 days

export async function createAuthToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(SECRET)
}

export async function verifyAuthToken(
  token: string,
): Promise<{ username: string; exp: number } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    // Issue 2: Runtime type validation before casting
    const { username, exp } = payload
    if (typeof username !== 'string' || typeof exp !== 'number') return null
    return { username, exp }
  } catch (err) {
    // Issue 3: Log verification errors before returning null
    console.error('jwt: verification error', err instanceof Error ? err.message : String(err))
    return null
  }
}

export const AUTH_COOKIE = 'auth-93fyi'

export const AUTH_COOKIE_OPTIONS = {
  // Issue 4: Use env var with fallback for domain
  domain: process.env.COOKIE_DOMAIN ?? '.93.fyi',
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  maxAge: SESSION_TTL_SECONDS,
}
