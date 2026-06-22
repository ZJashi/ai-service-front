export type LoginResult = { error?: string }

export async function login(email: string, password: string): Promise<LoginResult> {
  let res: Response
  try {
    res = await fetch('/backend/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    })
  } catch {
    return { error: 'Could not reach the server. Please try again.' }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data.detail as string) ?? 'Invalid email or password.' }
  }

  return {}
}