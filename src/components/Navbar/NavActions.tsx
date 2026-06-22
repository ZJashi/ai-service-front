'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from './logoutAction'

export default function NavActions() {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleLogout() {
    startTransition(async () => {
      await logout()
      router.push('/login')
    })
  }

  return (
    <button
      onClick={handleLogout}
      disabled={pending}
      className="px-3 py-1.5 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      {pending ? 'Signing out…' : 'Logout'}
    </button>
  )
}