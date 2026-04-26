import { jwtVerify, importSPKI } from 'jose'

const CLOUDFLARE_TEAM_NAME = process.env.CLOUDFLARE_TEAM_NAME || '9193'

let cachedPublicKey: CryptoKey | null = null
let cachedPublicKeyTime = 0
const CACHE_DURATION = 3600000 // 1 hour

async function getCloudflarePublicKey(): Promise<CryptoKey> {
  const now = Date.now()
  if (cachedPublicKey && now - cachedPublicKeyTime < CACHE_DURATION) {
    return cachedPublicKey as CryptoKey
  }

  const response = await fetch(
    `https://${CLOUDFLARE_TEAM_NAME}.cloudflareaccess.com/cdn-cgi/access/certs`,
  )
  if (!response.ok) throw new Error('Failed to fetch Cloudflare public key')

  const data = (await response.json()) as { certs: Array<{ pub_crt: string }> }
  const publicKeyPEM = data.certs[0].pub_crt
  const publicKeyObj = await importSPKI(publicKeyPEM, 'RS256')
  cachedPublicKey = publicKeyObj
  cachedPublicKeyTime = now
  return publicKeyObj
}

export async function verifyCloudflareJWT(
  token: string,
): Promise<{ email: string; exp: number } | null> {
  try {
    const publicKey = await getCloudflarePublicKey()
    const { payload } = await jwtVerify(token, publicKey)

    const { email, exp } = payload
    if (typeof email !== 'string' || typeof exp !== 'number') return null
    return { email, exp }
  } catch (err) {
    console.error(
      'cloudflare-jwt: verification error',
      err instanceof Error ? err.message : String(err),
    )
    return null
  }
}

export const CF_AUTHORIZATION_COOKIE = 'CF_Authorization'
export const CF_JWT_HEADER = 'Cf-Access-Jwt-Assertion'
