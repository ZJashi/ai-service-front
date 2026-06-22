'use client'

import { useState } from 'react'
import LoginForm from './layout/LoginForm'
import RegisterForm from './layout/RegisterForm'

export default function AuthForms() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return mode === 'login'
    ? <LoginForm onSwitch={() => setMode('register')} />
    : <RegisterForm onSwitch={() => setMode('login')} />
}