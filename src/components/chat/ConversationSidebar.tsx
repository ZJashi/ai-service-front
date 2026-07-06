import type { Conversation } from '@/lib/chat/types'

interface Props {
  conversations: Conversation[]
  activeId: number | null
  onSelect: (id: number) => void
  onNew: () => void
}

export default function ConversationSidebar({ conversations, activeId, onSelect, onNew }: Props) {
  return (
    <aside className="w-72 flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0">
        <button
          onClick={onNew}
          className="w-full h-9 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          + New conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
        {conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-zinc-400 dark:text-zinc-500">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                conv.id === activeId
                  ? 'bg-primary/10 text-primary font-medium dark:bg-primary/20'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {conv.title}
            </button>
          ))
        )}
      </div>
    </aside>
  )
}
