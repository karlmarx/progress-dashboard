import { getCookieAuth, getLoginRedirectUrl } from '@/lib/auth-check'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

export default async function Home() {
  const auth = await getCookieAuth()

  if (!auth) {
    redirect(getLoginRedirectUrl('https://progress.93.fyi/'))
  }

  return <Dashboard />
}
