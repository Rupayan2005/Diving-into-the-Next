"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Upload, Plus, FileText, User, Bot, Home } from "lucide-react"
import Link from "next/link"
import type { Message, ChatSession } from "@/types/chat"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedPdf, setUploadedPdf] = useState<string | null>(null)
  const [pdfContent, setPdfContent] = useState<string>("")
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem("chatSessions")
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions)
      setChatSessions(sessions)
      if (sessions.length > 0) {
        const lastSession = sessions[sessions.length - 1]
        setCurrentSessionId(lastSession.id)
        setMessages(lastSession.messages)
      }
    } else {
      // Create first session
      createNewChat()
    }
  }, [])

  // Save sessions to localStorage
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions))
    }
  }, [chatSessions])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const createNewChat = () => {
    const newSessionId = Date.now().toString()
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    }
    setChatSessions((prev) => [...prev, newSession])
    setCurrentSessionId(newSessionId)
    setMessages([])
    setUploadedPdf(null)
    setPdfContent("")
  }

  const updateCurrentSession = (newMessages: Message[]) => {
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: newMessages,
              title: newMessages.length > 0 ? newMessages[0].content.slice(0, 30) + "..." : "New Chat",
            }
          : session,
      ),
    )
  }

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file")
      return
    }

    setUploadedPdf(file.name)
    setIsLoading(true)

    const formData = new FormData()
    formData.append("pdf", file)
    try {
      const response = await fetch("/api/extract-pdf", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { text, pages } = await response.json()
        setPdfContent(text)

        // Add a system message about PDF upload
        const pdfMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `📄 PDF uploaded successfully!\n\nFile: ${file.name}\n**Pages:** ${pages}\n**Content extracted:** ${text.length} characters\n\nYou can now ask me questions about this document!`,
          timestamp: new Date().toISOString(),
        }

        const newMessages = [...messages, pdfMessage]
        setMessages(newMessages)
        updateCurrentSession(newMessages)
      } else {
        const error = await response.json()
        alert(`Error uploading PDF: ${error.error}`)
      }
    } catch (error) {
      console.error("Error uploading PDF:", error)
      alert("Error uploading PDF. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    updateCurrentSession(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          pdfContent: pdfContent || null,
          history: messages,
        }),
      })

      if (response.ok) {
        const { reply } = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        }

        const finalMessages = [...newMessages, assistantMessage]
        setMessages(finalMessages)
        updateCurrentSession(finalMessages)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId)
    if (session) {
      setCurrentSessionId(sessionId)
      setMessages(session.messages)
      setUploadedPdf(null)
      setPdfContent("")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300">
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        <div className="p-4">
          <Button onClick={createNewChat} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <Button
                key={session.id}
                variant={session.id === currentSessionId ? "secondary" : "ghost"}
                className="w-full justify-start text-left h-auto p-3 text-white bg-gray-700"
                onClick={() => loadChatSession(session.id)}
              >
                <div className="truncate">{session.title}</div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-blue-400">ShadowBot</h1>
          <div className="flex items-center gap-2">
            <input type="file" accept=".pdf" onChange={handlePdfUpload} ref={fileInputRef} className="hidden" />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="sm"
              className="border-gray-700 text-white bg-blue-500 hover:bg-blue-700 hover:text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload PDF
            </Button>
            {uploadedPdf && (
              <div className="flex items-center text-sm text-blue-400">
                <FileText className="w-4 h-4 mr-1" />
                {uploadedPdf}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <Bot className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
                <p>Ask me anything or upload a PDF to analyze its content!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="flex-shrink-0">
                      {message.role === "user" ? (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-800 text-gray-100 rounded-bl-md"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-800 text-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-200" />
                      <span className="ml-2">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
