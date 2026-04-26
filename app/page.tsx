import { getCookieAuth } from '@/lib/auth-check'
import Dashboard from '@/components/Dashboard'

export default async function Home() {
  const auth = await getCookieAuth()

  // Cloudflare Access handles authentication at the edge, so all requests
  // reaching this app should have a valid JWT. This is a safety check.
  if (!auth) {
    return <div>Authentication error. Please try logging in again.</div>
  }

  return <Dashboard email={auth.email} />
}
