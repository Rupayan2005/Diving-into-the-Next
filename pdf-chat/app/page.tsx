"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, FileText, Sparkles } from "lucide-react"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-blue-600/20 border border-blue-500/30">
                <Sparkles className="w-12 h-12 text-blue-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              Gemini PDF Chat
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Chat with Gemini AI and get intelligent answers from your PDF documents
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Smart Conversations</CardTitle>
                <CardDescription className="text-gray-400">
                  Engage in intelligent conversations powered by Google&apos;s Gemini AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <FileText className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">PDF Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Upload PDFs and ask questions about their content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Sparkles className="w-8 h-8 text-blue-400 mb-2" />
                <CardTitle className="text-white">Instant Insights</CardTitle>
                <CardDescription className="text-gray-400">
                  Get immediate answers and insights from your documents
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Link href="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full">
                Start Chatting
              </Button>
            </Link>
            <p className="text-gray-400 text-sm">No registration required • Free to use</p>
          </div>
        </div>
      </div>
    </div>
  )
}
