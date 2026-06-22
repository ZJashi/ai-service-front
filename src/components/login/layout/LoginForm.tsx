'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/ui/Input'
import Button from '@/ui/Button'
import { login } from '../loginActions'

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(data: FormData) {
    const email = data.get('email') as string
    const password = data.get('password') as string

    startTransition(async () => {
      const result = await login(email, password)
      if (result.error) {
        setError(result.error)
      } else {
        router.push('/dashboard')
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Sign in</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome back. Enter your credentials to continue.
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />
        <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" autoComplete="current-password" required />
        <Button type="submit" pending={pending}>Sign in</Button>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          {"Don't have an account? "}
          <button type="button" onClick={onSwitch} className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100">
            Register
          </button>
        </p>
      </form>
    </div>
  )
}