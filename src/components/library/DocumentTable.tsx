import type { UploadedDocument } from '@/lib/chat/types'
import StatusBadge from './StatusBadge'

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  )
}

interface Props {
  docs: UploadedDocument[]
  deletingId: number | null
  onDelete: (id: number) => void
}

export default function DocumentTable({ docs, deletingId, onDelete }: Props) {
  if (docs.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-12 text-center text-sm text-zinc-400 dark:text-zinc-500">
        No papers yet. Add one with the arXiv form above.
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Title</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Source</th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Chunks</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Status</th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Ingested</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr
                key={doc.id}
                className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 max-w-sm">
                  <span className="line-clamp-2">{doc.title}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 capitalize">{doc.source}</td>
                <td className="px-4 py-3 text-right tabular-nums text-zinc-700 dark:text-zinc-300">
                  {doc.chunk_count}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={doc.status} />
                </td>
                <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {new Date(doc.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="text-zinc-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                    aria-label={`Delete ${doc.title}`}
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        {docs.length} {docs.length === 1 ? 'paper' : 'papers'}
      </p>
    </div>
  )
}
