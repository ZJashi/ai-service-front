'use client'

import { useEffect, useRef, useState } from 'react'
import type { Message, Model, Source } from '@/lib/chat/types'
import MessageBubble from './MessageBubble'
import { SourceChips } from './MessageBubble'
import ModelSelector from './ModelSelector'

export interface PendingMessage {
  content: string
  sources: Source[]
}

interface Props {
  messages: Message[]
  pendingMsg: PendingMessage | null
  isStreaming: boolean
  activeId: number | null
  error: string | null
  onSend: (content: string) => void
  models: Model[]
  selectedModel: string | null
  onModelChange: (id: string | null) => void
  webSearch: boolean
  onWebSearchToggle: () => void
}

export default function ChatArea({ messages, pendingMsg, isStreaming, activeId, error, onSend, models, selectedModel, onModelChange, webSearch, onWebSearchToggle }: Props) {
  const currentModel = models.find((m) => m.id === selectedModel)
  const isFreeModel = currentModel?.free ?? false
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [input, setInput] = useState('')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, pendingMsg?.content])

  function handleSubmit(data: FormData) {
    const content = (data.get('message') as string).trim()
    if (!content || !activeId || isStreaming) return
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    onSend(content)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) form.requestSubmit()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`
  }

  const isEmpty = messages.length === 0 && !pendingMsg && !isStreaming

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-950">
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        {isEmpty && !activeId && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Start a conversation</p>
              <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">Select an existing chat or create a new one.</p>
            </div>
          </div>
        )}

        {isEmpty && activeId && (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-zinc-400 dark:text-zinc-500">Ask anything — your documents are ready.</p>
          </div>
        )}

        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {pendingMsg && (
            <div className="flex flex-col gap-2 items-start">
              {pendingMsg.sources.length > 0 && <SourceChips sources={pendingMsg.sources} />}
              <div className="max-w-prose rounded-2xl rounded-bl-sm bg-zinc-100 dark:bg-zinc-800 px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words text-zinc-900 dark:text-zinc-100">
                {pendingMsg.content}
                <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle animate-pulse opacity-70" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800">
        {error && (
          <div className="mx-4 mt-3 rounded-lg bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="p-4">
          <div className="max-w-2xl mx-auto mb-2 flex items-center gap-3">
            <ModelSelector models={models} value={selectedModel} onChange={onModelChange} />
            <button
              type="button"
              onClick={onWebSearchToggle}
              title={isFreeModel ? 'Web search requires a paid model' : 'Toggle web search'}
              className={`group flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors shrink-0 ${
                webSearch && !isFreeModel
                  ? 'bg-primary/10 border-primary/30 text-primary dark:bg-primary/20'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600'
              } ${isFreeModel ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              Web search
            </button>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)) }}
            className="max-w-2xl mx-auto flex gap-2 items-end"
          >
            <textarea
              ref={textareaRef}
              name="message"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={activeId ? 'Ask a question…' : 'Select a conversation first'}
              disabled={!activeId || isStreaming}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-y-auto"
            />
            <button
              type="submit"
              disabled={!activeId || isStreaming || !input.trim()}
              className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isStreaming ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </span>
              ) : 'Send'}
            </button>
          </form>
          <p className="max-w-2xl mx-auto mt-1.5 text-xs text-zinc-400 dark:text-zinc-500 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}