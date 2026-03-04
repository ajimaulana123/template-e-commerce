'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type ChatContextType = {
  pageContext: string | null
  setPageContext: (context: string | null) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [pageContext, setPageContext] = useState<string | null>(null)

  return (
    <ChatContext.Provider value={{ pageContext, setPageContext }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider')
  }
  return context
}
