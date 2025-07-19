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
    let contextPrompt = "";
    if (history && history.length > 0) {
      contextPrompt = "Previous conversation:\n";
      history.forEach((msg: ChatMessage) => {
        contextPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`;
      });
      contextPrompt += "\n";
    }

    // Add PDF content if available
    let pdfPrompt = ""
    if (pdfContent) {
      pdfPrompt = `\n\nPDF Content for reference:\n${pdfContent}\n\n`
    }

    const fullPrompt = `${contextPrompt}${pdfPrompt}Current question: ${message}`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const reply = response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
