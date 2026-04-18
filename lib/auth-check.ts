import { cookies } from 'next/headers'
import { verifyAuthToken, AUTH_COOKIE } from './jwt'

export async function getCookieAuth(): Promise<{ username: string; exp: number } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value

  if (!token) {
    return null
  }

  return verifyAuthToken(token)
}

export function getLoginRedirectUrl(currentUrl: string): string {
  return `https://me.93.fyi/login?next=${encodeURIComponent(currentUrl)}`
}
