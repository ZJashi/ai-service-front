'use client'

import { useState, useTransition } from 'react'
import Input from '@/ui/Input'
import Button from '@/ui/Button'
import { register } from '../registerActions'

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function handleSubmit(data: FormData) {
    const email = data.get('email') as string
    const password = data.get('password') as string
    const firstName = data.get('first_name') as string
    const lastName = data.get('last_name') as string
    const confirmPassword = data.get('confirm_password') as string

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    startTransition(async () => {
      const result = await register(email, password, firstName, lastName)
      if (result.error) {
        setError(result.error)
      } else {
        onSwitch()
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Create account</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Get started with your details below.
        </p>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Input id="first_name" name="first_name" type="text" label="First name" placeholder="Jane" autoComplete="given-name" required />
          <Input id="last_name" name="last_name" type="text" label="Last name" placeholder="Doe" autoComplete="family-name" required />
        </div>
        <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" required />
        <Input id="password" name="password" type="password" label="Password" placeholder="••••••••" autoComplete="new-password" minLength={8} required />
        <Input id="confirm_password" name="confirm_password" type="password" label="Confirm password" placeholder="••••••••" autoComplete="new-password" required />
        <Button type="submit" pending={pending}>Create account</Button>
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          {'Already have an account? '}
          <button type="button" onClick={onSwitch} className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100">
            Sign in
          </button>
        </p>
      </form>
    </div>
  )
}