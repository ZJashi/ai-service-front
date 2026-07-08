'use client'

import { useState } from 'react'

interface Props {
  onAdd: (title: string, body: string) => Promise<void>
}

export default function TextDocumentForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: FormData) {
    const t = (data.get('title') as string).trim()
    const b = (data.get('body') as string).trim()
    if (!t || !b) return
    setAdding(true)
    setAdded(false)
    setError(null)
    try {
      await onAdd(t, b)
      setTitle('')
      setBody('')
      setAdded(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add background.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }}>
        <div className="flex flex-col gap-2">
          <input
            name="title"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setAdded(false); setError(null) }}
            placeholder="Name & role — e.g. John - Robotics background"
            disabled={adding}
            className="h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <textarea
            name="body"
            value={body}
            onChange={(e) => { setBody(e.target.value); setAdded(false); setError(null) }}
            placeholder="Describe their background, skills, and experience…"
            disabled={adding}
            rows={4}
            className="px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-primary disabled:opacity-50 resize-none"
          />
          <button
            type="submit"
            disabled={adding || !title.trim() || !body.trim()}
            className="self-end h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {adding ? 'Adding…' : 'Add background'}
          </button>
        </div>
      </form>

      {added && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">Background added to library.</p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
