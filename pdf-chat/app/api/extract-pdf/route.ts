import { type NextRequest, NextResponse } from "next/server"
import pdf from "pdf-parse"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    console.log("Received form data:", formData)
    const file = formData.get("pdf") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text using pdf-parse with proper options
    const data = await pdf(buffer, {
      // Add options to handle various PDF formats
      normalizeWhitespace: false,
      disableCombineTextItems: false,
    })

    const text = data.text

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ 
        error: "No text content found in PDF. The PDF might be image-based or password-protected." 
      }, { status: 400 })
    }

    return NextResponse.json({
      text: text.trim(),
      pages: data.numpages,
      info: data.info || {},
      success: true
    })
  } catch (error) {
    console.error("Error extracting PDF:", error)
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Invalid PDF')) {
        return NextResponse.json({ 
          error: "Invalid PDF file format" 
        }, { status: 400 })
      }
      if (error.message.includes('password')) {
        return NextResponse.json({ 
          error: "PDF is password-protected" 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: "Failed to extract PDF content. Please ensure the PDF is valid and not corrupted." 
    }, { status: 500 })
  }
}