'use client'

import { useState, useEffect } from 'react'
import type { Conversation, Message, Model, Source, UploadedDocument } from '@/lib/chat/types'
import {
  createConversation,
  fetchMe,
  fetchModels,
  listConversations,
  loadConversation,
  listDocuments,
  ingestArxiv,
  deleteDocument,
  streamChatMessage,
  updatePreferredModel,
} from '@/lib/chat/api'
import ConversationSidebar from './ConversationSidebar'
import ChatArea, { type PendingMessage } from './ChatArea'

export default function ChatShell() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [pendingMsg, setPendingMsg] = useState<PendingMessage | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [documents, setDocuments] = useState<UploadedDocument[]>([])
  const [error, setError] = useState<string | null>(null)
  const [models, setModels] = useState<Model[]>([])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  useEffect(() => {
    listConversations().then(setConversations).catch(() => {})
    listDocuments().then(setDocuments).catch(() => {})
    fetchModels().then(setModels).catch(() => {})
    fetchMe().then((me) => setSelectedModel(me.preferred_model)).catch(() => {})
  }, [])

  async function handleModelChange(modelId: string | null) {
    setSelectedModel(modelId)
    updatePreferredModel(modelId).catch(() => {})
  }

  async function selectConversation(id: number) {
    if (id === activeId) return
    setActiveId(id)
    setMessages([])
    setPendingMsg(null)
    setError(null)
    try {
      const detail = await loadConversation(id)
      setMessages(detail.messages)
    } catch {
      setError('Failed to load conversation.')
    }
  }

  async function handleNewConversation() {
    try {
      const conv = await createConversation()
      setConversations((prev) => [conv, ...prev])
      setActiveId(conv.id)
      setMessages([])
      setPendingMsg(null)
      setError(null)
    } catch {
      setError('Failed to create conversation.')
    }
  }

  async function handleSend(content: string) {
    if (!activeId || isStreaming) return

    const userMsgId = Date.now()
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      content,
      sources: null,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setPendingMsg({ content: '', sources: [] })
    setIsStreaming(true)
    setError(null)

    let finalContent = ''
    let finalSources: Source[] = []

    try {
      await streamChatMessage(
        activeId,
        content,
        selectedModel,
        (sources) => {
          finalSources = sources
          setPendingMsg((prev) => (prev ? { ...prev, sources } : { content: '', sources }))
        },
        (delta) => {
          finalContent += delta
          setPendingMsg((prev) =>
            prev ? { ...prev, content: prev.content + delta } : { content: delta, sources: [] },
          )
        },
      )

      const assistantMsg: Message = {
        id: userMsgId + 1,
        role: 'assistant',
        content: finalContent,
        sources: finalSources.length ? finalSources : null,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setMessages((prev) => prev.filter((m) => m.id !== userMsgId))
    } finally {
      setPendingMsg(null)
      setIsStreaming(false)
    }
  }

  async function handleArxivIngest(arxivId: string): Promise<{ already_ingested: boolean }> {
    const doc = await ingestArxiv(arxivId)
    if (!doc.already_ingested) {
      setDocuments((prev) => [doc, ...prev])
    }
    return { already_ingested: doc.already_ingested }
  }

  async function handleDeleteDoc(id: number) {
    try {
      await deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch {
      setError('Could not delete document.')
    }
  }

  return (
    <div className="flex h-[calc(100dvh-56px)]">
      <ConversationSidebar
        conversations={conversations}
        activeId={activeId}
        documents={documents}
        onSelect={selectConversation}
        onNew={handleNewConversation}
        onArxivIngest={handleArxivIngest}
        onDeleteDoc={handleDeleteDoc}
      />
      <ChatArea
        messages={messages}
        pendingMsg={pendingMsg}
        isStreaming={isStreaming}
        activeId={activeId}
        error={error}
        onSend={handleSend}
        models={models}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />
    </div>
  )
}