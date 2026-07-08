'use client'

import { useEffect, useState } from 'react'
import { listDocuments, ingestArxiv, ingestTextDocument, deleteDocument } from '@/lib/chat/api'
import type { UploadedDocument } from '@/lib/chat/types'
import ArxivForm from './ArxivForm'
import TextDocumentForm from './TextDocumentForm'
import DocumentTable from './DocumentTable'

type Tab = 'arxiv' | 'text'

export default function LibraryShell() {
  const [docs, setDocs] = useState<UploadedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('arxiv')

  useEffect(() => {
    listDocuments()
      .then(setDocs)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load documents.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleIngest(arxivId: string): Promise<{ already_ingested: boolean }> {
    const doc = await ingestArxiv(arxivId)
    if (!doc.already_ingested) {
      setDocs((prev) => [doc, ...prev])
    }
    return { already_ingested: doc.already_ingested }
  }

  async function handleAddText(title: string, body: string) {
    const doc = await ingestTextDocument(title, body)
    if (!doc.already_ingested) {
      setDocs((prev) => [doc, ...prev])
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    setError(null)
    try {
      await deleteDocument(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
    } catch {
      setError('Failed to delete document.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-1 w-fit">
        <button
          onClick={() => setTab('arxiv')}
          className={`h-8 px-3 rounded-md text-sm font-medium transition-colors ${
            tab === 'arxiv'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          arXiv paper
        </button>
        <button
          onClick={() => setTab('text')}
          className={`h-8 px-3 rounded-md text-sm font-medium transition-colors ${
            tab === 'text'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
          }`}
        >
          Collaborator background
        </button>
      </div>

      {tab === 'arxiv' ? (
        <ArxivForm onIngest={handleIngest} />
      ) : (
        <TextDocumentForm onAdd={handleAddText} />
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
          Loading…
        </div>
      ) : (
        <DocumentTable docs={docs} deletingId={deletingId} onDelete={handleDelete} />
      )}
    </div>
  )
}
