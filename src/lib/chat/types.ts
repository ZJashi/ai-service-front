export interface Conversation {
  id: number
  title: string
  created_at: string
  updated_at: string
}

export interface Source {
  index: number
  document_id: number
  title: string
  chunk_index: number
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  sources: Source[] | null
  created_at: string
}

export interface ConversationDetail extends Conversation {
  messages: Message[]
}

export interface UploadedDocument {
  id: number
  title: string
  source: string
  status: string
  chunk_count: number
  created_at: string
}

export interface Model {
  id: string
  name: string
  free: boolean
}

export interface UserProfile {
  id: number
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  preferred_model: string | null
}
