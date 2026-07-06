import LibraryShell from '@/components/library/LibraryShell'

export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Library</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Papers ingested into your RAG knowledge base
        </p>
      </div>
      <LibraryShell />
    </div>
  )
}
