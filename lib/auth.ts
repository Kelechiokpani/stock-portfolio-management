import crypto from 'crypto'

// In a real app, use bcrypt. For now, using crypto for demonstration
export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashedInput = crypto.createHash('sha256').update(password).digest('hex')
  return hashedInput === hash
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function generateSessionToken(): string {
  return crypto.randomBytes(64).toString('hex')
}

// Session management
export interface SessionData {
  userId: string
  email: string
  role: string
  expiresAt: Date
}

export async function createSession(userId: string, expiresIn: number = 7 * 24 * 60 * 60 * 1000): Promise<string> {
  const token = generateSessionToken()
  // In a real app, store this in the database
  return token
}

export function parseJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}
