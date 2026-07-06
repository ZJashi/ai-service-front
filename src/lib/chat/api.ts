import type { Conversation, ConversationDetail, Model, Source, UploadedDocument, UserProfile } from './types'

const BASE = '/backend/api/v1'

export async function createConversation(title = 'New Conversation'): Promise<Conversation> {
  const res = await fetch(`${BASE}/chat/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to create conversation')
  return res.json()
}

export async function listConversations(): Promise<Conversation[]> {
  const res = await fetch(`${BASE}/chat/conversations`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to load conversations')
  return res.json()
}

export async function loadConversation(id: number): Promise<ConversationDetail> {
  const res = await fetch(`${BASE}/chat/conversations/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to load conversation')
  return res.json()
}

export async function listDocuments(): Promise<UploadedDocument[]> {
  const res = await fetch(`${BASE}/documents`, { credentials: 'include' })
  if (res.status === 404) return []
  if (!res.ok) throw new Error(`Failed to load documents (${res.status})`)
  return res.json()
}

export async function ingestArxiv(arxivId: string): Promise<UploadedDocument & { already_ingested: boolean }> {
  const res = await fetch(`${BASE}/documents/arxiv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ arxiv_id: arxivId }),
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data.detail as string) ?? 'Failed to ingest paper')
  }
  return res.json()
}

export async function deleteDocument(id: number): Promise<void> {
  const res = await fetch(`${BASE}/documents/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Delete failed')
}

export async function deleteConversation(id: number): Promise<void> {
  const res = await fetch(`${BASE}/chat/conversations/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to delete conversation')
}

export async function renameConversation(id: number, title: string): Promise<Conversation> {
  const res = await fetch(`${BASE}/chat/conversations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to rename conversation')
  return res.json()
}

export async function fetchModels(): Promise<Model[]> {
  const res = await fetch(`${BASE}/chat/models`)
  if (!res.ok) throw new Error('Failed to load models')
  return res.json()
}

export async function fetchMe(): Promise<UserProfile> {
  const res = await fetch(`${BASE}/auth/me`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to load profile')
  return res.json()
}

export async function updatePreferredModel(modelId: string | null): Promise<UserProfile> {
  const res = await fetch(`${BASE}/auth/me`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferred_model: modelId }),
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to update model preference')
  return res.json()
}

export async function streamChatMessage(
  convId: number,
  content: string,
  model: string | null,
  onSources: (sources: Source[]) => void,
  onDelta: (text: string) => void,
): Promise<void> {
  const body: Record<string, unknown> = { content }
  if (model) body.model = model

  const res = await fetch(`${BASE}/chat/conversations/${convId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  })

  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data.detail as string) ?? 'Failed to send message')
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop()!
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const event = JSON.parse(line.slice(6))
      if (event.type === 'sources') onSources(event.sources)
      else if (event.type === 'delta') onDelta(event.content)
    }
  }
}
