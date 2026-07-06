'use client'

import { useState } from 'react'

interface Props {
  onIngest: (arxivId: string) => Promise<{ already_ingested: boolean }>
}

export default function ArxivForm({ onIngest }: Props) {
  const [arxivId, setArxivId] = useState('')
  const [ingesting, setIngesting] = useState(false)
  const [result, setResult] = useState<'added' | 'existing' | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(data: FormData) {
    const id = (data.get('arxiv_id') as string).trim()
    if (!id) return
    setIngesting(true)
    setResult(null)
    setError(null)
    try {
      const res = await onIngest(id)
      setArxivId('')
      setResult(res.already_ingested ? 'existing' : 'added')
    } catch {
      setError('Failed to ingest paper. Check the arXiv ID and try again.')
    } finally {
      setIngesting(false)
    }
  }

  return (
    <div className="mb-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }}>
        <div className="flex gap-2">
          <input
            name="arxiv_id"
            value={arxivId}
            onChange={(e) => { setArxivId(e.target.value); setResult(null); setError(null) }}
            placeholder="arXiv ID — e.g. 2301.00001"
            disabled={ingesting}
            className="flex-1 h-10 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={ingesting || !arxivId.trim()}
            className="h-10 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {ingesting ? 'Adding…' : 'Add paper'}
          </button>
        </div>
      </form>

      {result && (
        <p className={`mt-2 text-sm ${result === 'existing' ? 'text-zinc-400 dark:text-zinc-500' : 'text-green-600 dark:text-green-400'}`}>
          {result === 'existing' ? 'Already in your library.' : 'Paper added to library.'}
        </p>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
