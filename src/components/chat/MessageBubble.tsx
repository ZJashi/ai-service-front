'use client'

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import type { Components } from 'react-markdown'
import type { Message, Source } from '@/lib/chat/types'

const mdComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="text-base font-bold mb-1 mt-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-bold mb-1 mt-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 mt-2">{children}</h3>,
  pre: ({ children }) => (
    <pre className="bg-black/10 dark:bg-white/10 rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono">
      {children}
    </pre>
  ),
  code: ({ children, className }) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-xs font-mono">
        {children}
      </code>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-zinc-400 dark:border-zinc-500 pl-3 italic my-2 text-zinc-600 dark:text-zinc-400">
      {children}
    </blockquote>
  ),
}

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
        className={`max-w-prose rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-primary text-white rounded-br-sm whitespace-pre-wrap'
            : `bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm${isStreaming ? ' whitespace-pre-wrap' : ''}`
        }`}
      >
        {isUser || isStreaming ? (
          <>
            {message.content || (isStreaming ? '' : <span className="text-zinc-400 italic">…</span>)}
            {isStreaming && (
              <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse opacity-70" />
            )}
          </>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[[rehypeKatex, { throwOnError: false, output: 'html' }]]}
            components={mdComponents}
          >
            {message.content || '…'}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}
