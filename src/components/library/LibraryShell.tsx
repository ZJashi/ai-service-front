'use client'

import { useEffect, useState } from 'react'
import { listDocuments, ingestArxiv, deleteDocument } from '@/lib/chat/api'
import type { UploadedDocument } from '@/lib/chat/types'
import ArxivForm from './ArxivForm'
import DocumentTable from './DocumentTable'

export default function LibraryShell() {
  const [docs, setDocs] = useState<UploadedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

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
      <ArxivForm onIngest={handleIngest} />

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
