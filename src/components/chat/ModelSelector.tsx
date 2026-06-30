'use client'

import { useEffect, useState } from 'react'
import type { Model } from '@/lib/chat/types'

const CUSTOM = '__custom__'

interface Props {
  models: Model[]
  value: string | null
  onChange: (id: string | null) => void
}

export default function ModelSelector({ models, value, onChange }: Props) {
  const [showCustom, setShowCustom] = useState(false)
  const [customInput, setCustomInput] = useState('')

  useEffect(() => {
    if (models.length === 0) return
    const isCustom = value !== null && !models.some((m) => m.id === value)
    setShowCustom(isCustom)
    if (isCustom) setCustomInput(value!)
  }, [value, models])

  const isCustomValue = value !== null && !models.some((m) => m.id === value)
  const selectValue = isCustomValue || showCustom ? CUSTOM : (value ?? '')

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value
    if (v === CUSTOM) {
      setShowCustom(true)
      setCustomInput('')
    } else {
      setShowCustom(false)
      onChange(v === '' ? null : v)
    }
  }

  function commitCustom() {
    const trimmed = customInput.trim()
    if (trimmed) {
      onChange(trimmed)
    } else {
      setShowCustom(false)
      onChange(null)
    }
  }

  const free = models.filter((m) => m.free)
  const paid = models.filter((m) => !m.free)

  const selectClass =
    'text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 px-2 py-1 outline-none focus:ring-1 focus:ring-primary transition-colors'

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">Model</span>
      <select value={selectValue} onChange={handleSelectChange} className={selectClass}>
        <option value="">Server default</option>
        {free.length > 0 && (
          <optgroup label="Free">
            {free.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        )}
        {paid.length > 0 && (
          <optgroup label="Paid">
            {paid.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </optgroup>
        )}
        <option value={CUSTOM}>Custom…</option>
      </select>
      {showCustom && (
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onBlur={commitCustom}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
          placeholder="provider/model-id"
          autoFocus
          className={`${selectClass} w-44`}
        />
      )}
      {value && !showCustom && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          title="Reset to server default"
        >
          Reset
        </button>
      )}
    </div>
  )
}