import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    const { message, pdfContent, history } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Define a type for chat messages
    interface ChatMessage {
      role: "user" | "assistant";
      content: string;
    }

    // Build context from chat history
    let contextPrompt = ""
    if (history && history.length > 0) {
      contextPrompt = "Previous conversation:\n"
      history.slice(-10).forEach((msg: ChatMessage) => {
        // Only use last 10 messages for context
        contextPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`
      })
      contextPrompt += "\n"
    }

    // Add PDF content if available with better formatting
    let pdfPrompt = ""
    if (pdfContent && pdfContent.trim()) {
      pdfPrompt = `\n\nI have access to the following PDF document content. Please use this information to answer questions about the document:\n\n--- PDF CONTENT START ---\n${pdfContent.trim()}\n--- PDF CONTENT END ---\n\n`
    }

    // Enhanced prompt for better PDF understanding
    const systemPrompt = pdfContent
      ? "You are an AI assistant that can analyze and answer questions about PDF documents. When a user asks about the PDF content, provide accurate information based on the document. If the question is not related to the PDF, you can answer normally."
      : "You are a helpful AI assistant powered by Gemini. Provide accurate and helpful responses to user questions."

    const fullPrompt = `${systemPrompt}\n\n${contextPrompt}${pdfPrompt}User question: ${message}\n\nPlease provide a helpful and accurate response:`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const reply = response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
