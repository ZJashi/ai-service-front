'use client'

import { useState, useRef, useEffect } from 'react'
import type { Conversation } from '@/lib/chat/types'

interface Props {
  conversations: Conversation[]
  activeId: number | null
  onSelect: (id: number) => void
  onNew: () => void
  onStartDiscovery: () => void
  onDelete: (id: number) => Promise<void>
  onRename: (id: number, title: string) => Promise<void>
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
  onRename,
}: {
  conv: Conversation
  isActive: boolean
  onSelect: () => void
  onDelete: () => Promise<void>
  onRename: (title: string) => Promise<void>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [draft, setDraft] = useState(conv.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (renaming) inputRef.current?.select()
  }, [renaming])

  useEffect(() => {
    if (!menuOpen) return
    function close(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  async function commitRename() {
    const title = draft.trim()
    if (title && title !== conv.title) await onRename(title)
    else setDraft(conv.title)
    setRenaming(false)
  }

  if (renaming) {
    return (
      <div className="px-2 py-1">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commitRename() }
            if (e.key === 'Escape') { setDraft(conv.title); setRenaming(false) }
          }}
          className="w-full rounded-md border border-primary px-2 py-1 text-sm outline-none bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        />
      </div>
    )
  }

  return (
    <div className={`group relative flex items-center rounded-lg transition-colors ${
      isActive
        ? 'bg-primary/10 dark:bg-primary/20'
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
    }`}>
      <button
        onClick={onSelect}
        className={`flex-1 text-left px-3 py-2 text-sm truncate min-w-0 ${
          isActive ? 'text-primary font-medium' : 'text-zinc-700 dark:text-zinc-300'
        }`}
      >
        {conv.title}
      </button>

      <div className="relative shrink-0 pr-1" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 h-7 w-7 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
          aria-label="Conversation options"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <circle cx="7" cy="2.5" r="1.25" />
            <circle cx="7" cy="7" r="1.25" />
            <circle cx="7" cy="11.5" r="1.25" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 z-30 w-36 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg py-1">
            <button
              onClick={() => { setMenuOpen(false); setRenaming(true) }}
              className="w-full text-left px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center gap-2"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Rename
            </button>
            <button
              onClick={async () => { setMenuOpen(false); await onDelete() }}
              className="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ConversationSidebar({ conversations, activeId, onSelect, onNew, onStartDiscovery, onDelete, onRename }: Props) {
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 flex flex-col gap-2">
        <button
          onClick={onNew}
          className="w-full h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New conversation
        </button>
        <button
          onClick={onStartDiscovery}
          className="w-full h-9 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors"
        >
          Start discovery session
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-400 dark:text-zinc-500">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeId}
              onSelect={() => onSelect(conv.id)}
              onDelete={() => onDelete(conv.id)}
              onRename={(title) => onRename(conv.id, title)}
            />
          ))
        )}
      </div>
    </aside>
  )
}
