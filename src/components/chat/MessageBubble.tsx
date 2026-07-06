'use client'

import { useState, useEffect } from 'react'
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

function SourceChip({ source }: { source: Source }) {
  const label = source.arxiv_id ?? source.title
  const href = source.arxiv_id ? `https://arxiv.org/abs/${source.arxiv_id}` : null

  const inner = (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-400 transition-colors">
      <span className="font-semibold text-primary shrink-0">[{source.index}]</span>
      <span className="truncate max-w-[12rem]">{label}</span>
    </span>
  )

  return (
    <span className="group relative">
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
          {inner}
        </a>
      ) : inner}
      {/* Tooltip */}
      <span className="pointer-events-none absolute bottom-full left-0 mb-1.5 z-20 hidden group-hover:flex flex-col gap-0.5 w-72 rounded-lg bg-zinc-900 dark:bg-zinc-700 text-white px-3 py-2 shadow-lg">
        <span className="font-medium text-xs leading-snug">{source.title}</span>
        {source.arxiv_id && <span className="text-zinc-400 dark:text-zinc-300 text-[10px]">{source.arxiv_id} · Chunk {source.chunk_index + 1}</span>}
        {!source.arxiv_id && <span className="text-zinc-400 dark:text-zinc-300 text-[10px]">Chunk {source.chunk_index + 1}</span>}
      </span>
    </span>
  )
}

export function SourceChips({ sources }: { sources: Source[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sources.map((src) => (
        <SourceChip key={src.index} source={src} />
      ))}
    </div>
  )
}

export default function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === 'user'
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Plain text until client mounts (avoids SSR/hydration mismatch with ESM math plugins)
  const renderPlain = isUser || isStreaming || !mounted

  return (
    <div className={`flex flex-col gap-2 ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && message.sources && message.sources.length > 0 && (
        <SourceChips sources={message.sources} />
      )}
      <div
        className={`max-w-prose rounded-2xl px-4 py-2.5 text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-primary text-white rounded-br-sm whitespace-pre-wrap'
            : `bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-sm${renderPlain ? ' whitespace-pre-wrap' : ''}`
        }`}
      >
        {renderPlain ? (
          <>
            {message.content || (isStreaming ? '' : <span className="text-zinc-400 italic">…</span>)}
            {isStreaming && (
              <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse opacity-70" />
            )}
          </>
        ) : (
          <ReactMarkdown
            remarkPlugins={[[remarkMath, { singleDollarTextMath: true }]]}
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
