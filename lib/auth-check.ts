import { headers, cookies } from 'next/headers'
import { verifyCloudflareJWT, CF_AUTHORIZATION_COOKIE, CF_JWT_HEADER } from './jwt'

export async function getCookieAuth(): Promise<{ email: string; exp: number } | null> {
  const headersList = await headers()
  const cookieStore = await cookies()

  // Try header first (recommended by Cloudflare)
  let token: string | null = headersList.get(CF_JWT_HEADER)

  // Fallback to cookie
  if (!token) {
    token = cookieStore.get(CF_AUTHORIZATION_COOKIE)?.value ?? null
  }

  if (!token) {
    return null
  }

  return verifyCloudflareJWT(token)
}
