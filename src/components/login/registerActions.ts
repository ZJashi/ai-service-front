export type RegisterResult = { error?: string }

export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<RegisterResult> {
  let res: Response
  try {
    res = await fetch('/backend/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
      credentials: 'include',
    })
  } catch {
    return { error: 'Could not reach the server. Please try again.' }
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return { error: (data.detail as string) ?? 'Registration failed. Please try again.' }
  }

  return {}
}
