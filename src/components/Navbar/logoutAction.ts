export async function logout(): Promise<{ error?: string }> {
  try {
    await fetch('/backend/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    return {}
  } catch {
    return { error: 'Could not reach the server.' }
  }
}
