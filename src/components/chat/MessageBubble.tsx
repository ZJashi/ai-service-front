import type { Message, Source } from '@/lib/chat/types'

interface Props {
  message: Message
  isStreaming?: boolean
}

function SourceChip({ title, index }: { title: string; index: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-600 dark:text-zinc-400">
      <span className="font-semibold text-primary">[{index}]</span>
      <span className="truncate max-w-[14rem]">{title}</span>
    </span>
  )
}

export function SourceChips({ sources }: { sources: Source[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((src) => (
        <SourceChip key={src.index} title={src.title} index={src.index} />
      ))}
    </div>
  )
}

export default function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && message.sources && message.sources.length > 0 && (
        <SourceChips sources={message.sources} />
      )}
      <div
        className={`max-w-prose rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm'
        }`}
      >
        {message.content || (isStreaming ? '' : <span className="text-zinc-400 italic">…</span>)}
        {isStreaming && (
          <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse opacity-70" />
        )}
      </div>
    </div>
  )
}
