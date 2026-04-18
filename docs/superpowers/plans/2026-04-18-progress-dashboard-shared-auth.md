# Progress Dashboard Shared Auth Refactor

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace NextAuth with the shared auth-93fyi cookie system from me-93fyi, eliminating duplicate GitHub OAuth and simplifying deployment.

**Architecture:** Removes NextAuth dependency entirely. Uses JWT token in `auth-93fyi` cookie (domain: `.93.fyi`, shared across all 93.fyi subdomains). Unauthenticated requests redirect to me.93.fyi/login?next=progress.93.fyi. Middleware verifies token on each request; page/API routes check for valid cookie.

**Tech Stack:** Next.js 16, jose (JWT), custom middleware, shared .93.fyi cookie domain

---

### Task 1: Create JWT verification lib

**Files:**
- Create: `lib/jwt.ts`

- [ ] **Step 1: Create lib/jwt.ts with JWT verification**

```typescript
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
```

- [ ] **Step 2: Verify file exists and has no syntax errors**

Run: `cd ~/code/progress-dashboard && npx tsc --noEmit lib/jwt.ts`
Expected: No output (success)

- [ ] **Step 3: Commit**

```bash
cd ~/code/progress-dashboard
git add lib/jwt.ts
git commit -m "feat: add shared JWT verification from me-93fyi pattern"
```

---

### Task 2: Create auth check helper

**Files:**
- Create: `lib/auth-check.ts`

- [ ] **Step 1: Create lib/auth-check.ts with cookie verification helpers**

```typescript
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
```

- [ ] **Step 2: Verify syntax**

Run: `cd ~/code/progress-dashboard && npx tsc --noEmit lib/auth-check.ts`
Expected: No output (success)

- [ ] **Step 3: Commit**

```bash
cd ~/code/progress-dashboard
git add lib/auth-check.ts
git commit -m "feat: add auth-check helper for cookie verification"
```

---

### Task 3: Update middleware for shared auth

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Replace middleware.ts**

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthToken, AUTH_COOKIE } from '@/lib/jwt'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Allow access to public routes and API status (used by external monitors)
  if (pathname === '/api/status' || pathname === '/favicon.ico' || pathname.startsWith('/_next/')) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const token = request.cookies.get(AUTH_COOKIE)?.value

  if (!token) {
    // Redirect to me.93.fyi login with this URL as next param
    const loginUrl = new URL('https://me.93.fyi/login')
    loginUrl.searchParams.set('next', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token validity
  const auth = await verifyAuthToken(token)
  if (!auth) {
    // Token expired or invalid, redirect to login
    const loginUrl = new URL('https://me.93.fyi/login')
    loginUrl.searchParams.set('next', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Token valid, continue
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

- [ ] **Step 2: Verify middleware syntax**

Run: `cd ~/code/progress-dashboard && npx tsc --noEmit middleware.ts`
Expected: No output (success)

- [ ] **Step 3: Commit**

```bash
cd ~/code/progress-dashboard
git add middleware.ts
git commit -m "refactor: replace NextAuth middleware with shared auth-93fyi cookie check"
```

---

### Task 4: Update app/page.tsx to remove NextAuth

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx**

```typescript
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
```

- [ ] **Step 2: Verify no NextAuth imports remain**

Run: `grep -n "next-auth\|@/lib/auth" ~/code/progress-dashboard/app/page.tsx`
Expected: No output (no matches)

- [ ] **Step 3: Commit**

```bash
cd ~/code/progress-dashboard
git add app/page.tsx
git commit -m "refactor: replace NextAuth auth() call with getCookieAuth()"
```

---

### Task 5: Delete NextAuth files

**Files:**
- Delete: `lib/auth.ts`, `app/auth/signin/page.tsx`, `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Remove NextAuth files**

```bash
cd ~/code/progress-dashboard
rm lib/auth.ts
rm -rf app/auth
rm -rf app/api/auth
```

- [ ] **Step 2: Verify files are deleted**

Run: `ls -la ~/code/progress-dashboard/lib/auth.ts 2>&1 | grep -q "No such file" && echo "✓ auth.ts deleted" || echo "✗ auth.ts still exists"`
Expected: ✓ auth.ts deleted

- [ ] **Step 3: Verify app/auth is gone**

Run: `ls -la ~/code/progress-dashboard/app/auth 2>&1 | grep -q "No such file" && echo "✓ app/auth deleted" || echo "✗ app/auth still exists"`
Expected: ✓ app/auth deleted

- [ ] **Step 4: Commit deletion**

```bash
cd ~/code/progress-dashboard
git add -A
git commit -m "refactor: remove NextAuth files and routes"
```

---

### Task 6: Remove NextAuth from package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove next-auth dependency**

```bash
cd ~/code/progress-dashboard
npm uninstall next-auth
```

Expected output should show removing next-auth

- [ ] **Step 2: Verify package.json no longer has next-auth**

Run: `grep -n "next-auth" ~/code/progress-dashboard/package.json`
Expected: No output (no matches)

- [ ] **Step 3: Verify jose is still present (needed for JWT)**

Run: `grep -n '"jose"' ~/code/progress-dashboard/package.json`
Expected: Should show jose dependency exists

- [ ] **Step 4: Update package-lock.json and commit**

```bash
cd ~/code/progress-dashboard
git add package.json package-lock.json
git commit -m "refactor: remove next-auth dependency, use shared JWT auth"
```

---

### Task 7: Update .env.local for new auth

**Files:**
- Modify: `.env.local`

- [ ] **Step 1: Update .env.local with new variables**

Remove these lines (if present):
```
GITHUB_ID=...
GITHUB_SECRET=...
NEXTAUTH_URL=...
```

Keep/ensure these exist:
```
NEXTAUTH_SECRET=<use existing value or generate new one>
EMAIL_USER=karlmarx9193@gmail.com
EMAIL_PASS=<Gmail app password>
```

Run this to show current .env.local (don't modify yet, just review):
```bash
cat ~/code/progress-dashboard/.env.local
```

- [ ] **Step 2: Edit .env.local manually or via editor**

If NEXTAUTH_SECRET is missing, generate one:
```bash
cd ~/code/progress-dashboard && openssl rand -base64 32
```

Use that value for NEXTAUTH_SECRET. Ensure the file contains only:
```
NEXTAUTH_SECRET=<your-secret-here>
EMAIL_USER=karlmarx9193@gmail.com
EMAIL_PASS=<your-gmail-app-password>
```

- [ ] **Step 3: Verify .env.local is correct (don't commit, it's in .gitignore)**

Run: `grep -E "NEXTAUTH_SECRET|EMAIL_USER|EMAIL_PASS|GITHUB" ~/code/progress-dashboard/.env.local`
Expected: Should show only NEXTAUTH_SECRET, EMAIL_USER, EMAIL_PASS (no GITHUB_* vars)

---

### Task 8: Build and test auth flow

**Files:**
- None (testing only)

- [ ] **Step 1: Build the project**

```bash
cd ~/code/progress-dashboard && npm run build
```

Expected: Build succeeds without errors. If errors occur about missing NextAuth imports, search for them and remove (check app/layout.tsx, types/next-auth.d.ts)

- [ ] **Step 2: Check for lingering NextAuth references**

```bash
grep -r "next-auth\|NextAuth\|@/lib/auth" ~/code/progress-dashboard/app ~/code/progress-dashboard/lib --include="*.tsx" --include="*.ts" | grep -v node_modules
```

Expected: No output (no matches). If matches found, edit those files to remove NextAuth imports

- [ ] **Step 3: Remove types/next-auth.d.ts if it exists**

```bash
rm -f ~/code/progress-dashboard/types/next-auth.d.ts
```

- [ ] **Step 4: Run build again**

```bash
cd ~/code/progress-dashboard && npm run build
```

Expected: Build succeeds

- [ ] **Step 5: Commit build changes**

```bash
cd ~/code/progress-dashboard
git add -A
git commit -m "refactor: complete NextAuth removal, all builds pass"
```

---

### Task 9: Final integration commit

**Files:**
- None (final checkpoint)

- [ ] **Step 1: Verify all auth-related changes are committed**

```bash
cd ~/code/progress-dashboard && git log --oneline | head -10
```

Expected: Should see commits from Tasks 1-8 (jwt, auth-check, middleware, page.tsx, file deletions, package.json, env changes, build)

- [ ] **Step 2: Create final summary commit**

```bash
cd ~/code/progress-dashboard
git commit --allow-empty -m "refactor: progress-dashboard now uses shared auth-93fyi system

- Removed NextAuth completely (v5 dependency, GitHub OAuth config)
- Added JWT verification (lib/jwt.ts) using me-93fyi pattern
- Updated middleware to check auth-93fyi cookie at domain .93.fyi
- Unauthenticated requests redirect to me.93.fyi/login?next=...
- Simplified environment config (removed GITHUB_ID/GITHUB_SECRET)
- Updated app/page.tsx and all routes to use shared auth pattern
- Maintains email notifications (Nodemailer) and status API
- No database changes, milestone tracking unchanged"
```

- [ ] **Step 3: Verify git history**

```bash
cd ~/code/progress-dashboard && git log --oneline --all | grep -E "auth|refactor" | head -15
```

Expected: Should show refactor commits in clean chronological order

---

## Next Steps

After all tasks complete:
1. Build succeeds with `npm run build`
2. Middleware correctly redirects unauthenticated users to me.93.fyi/login
3. Environment config simplified (only NEXTAUTH_SECRET, EMAIL_USER, EMAIL_PASS)
4. No NextAuth dependencies remain
5. Ready for Task 10 (production deployment to Vercel)

For deployment, environment variables will be set in Vercel dashboard (no GITHUB_ID/GITHUB_SECRET needed):
- `NEXTAUTH_SECRET` — signing key for JWT tokens
- `EMAIL_USER` — Gmail address for notifications
- `EMAIL_PASS` — Gmail app password
