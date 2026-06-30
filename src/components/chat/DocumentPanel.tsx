'use client'

import { useState } from 'react'
import type { UploadedDocument } from '@/lib/chat/types'

interface Props {
  documents: UploadedDocument[]
  onArxivIngest: (arxivId: string) => Promise<{ already_ingested: boolean }>
  onDelete: (id: number) => Promise<void>
}

export default function DocumentPanel({ documents, onArxivIngest, onDelete }: Props) {
  const [open, setOpen] = useState(false)
  const [arxivId, setArxivId] = useState('')
  const [ingesting, setIngesting] = useState(false)
  const [result, setResult] = useState<'added' | 'existing' | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleIngest(data: FormData) {
    const id = (data.get('arxiv_id') as string).trim()
    if (!id) return
    setIngesting(true)
    setResult(null)
    try {
      const res = await onArxivIngest(id)
      setArxivId('')
      setResult(res.already_ingested ? 'existing' : 'added')
    } finally {
      setIngesting(false)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="border-t border-zinc-200 dark:border-zinc-800 flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <span>Documents ({documents.length})</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-2">
          <form onSubmit={(e) => { e.preventDefault(); handleIngest(new FormData(e.currentTarget)) }}>
            <div className="flex gap-1">
              <input
                name="arxiv_id"
                value={arxivId}
                onChange={(e) => { setArxivId(e.target.value); setResult(null) }}
                placeholder="arXiv ID e.g. 2301.00001"
                disabled={ingesting}
                className="flex-1 h-8 px-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent text-xs text-zinc-700 dark:text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={ingesting || !arxivId.trim()}
                className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {ingesting ? '…' : 'Add'}
              </button>
            </div>
          </form>

          {result && (
            <p className={`text-xs px-1 ${result === 'existing' ? 'text-zinc-400 dark:text-zinc-500' : 'text-green-600 dark:text-green-400'}`}>
              {result === 'existing' ? 'Already in your library' : 'Paper added to library'}
            </p>
          )}

          {documents.length > 0 && (
            <ul className="space-y-1 max-h-36 overflow-y-auto">
              {documents.map((doc) => (
                <li key={doc.id} className="flex items-center gap-2 group py-0.5">
                  <svg className="w-3 h-3 flex-shrink-0 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 012-2h4l6 6v8a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  <span className="flex-1 text-xs text-zinc-600 dark:text-zinc-400 truncate">{doc.title}</span>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-zinc-400 hover:text-red-500 transition-all disabled:opacity-50"
                    aria-label={`Delete ${doc.title}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
