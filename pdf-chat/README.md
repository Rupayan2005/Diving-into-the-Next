# ShadowBot 🤖📄

A powerful PDF chatbot built with Next.js that allows you to upload PDF documents and ask intelligent questions about their content using Google's Gemini API.

## ✨ Features

- **PDF Upload & Processing**: Upload PDF files and extract text content automatically
- **Intelligent Q&A**: Ask questions about your PDF content and get contextual answers
- **Gemini AI Integration**: Powered by Google's advanced Gemini API for accurate responses
- **Modern UI**: Clean and responsive interface built with Tailwind CSS
- **Real-time Chat**: Interactive chat interface for seamless conversations

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **AI API**: Google Gemini API
- **PDF Processing**: PDF-parse library
- **Language**: TypeScript
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Google Cloud account with Gemini API access
- Basic knowledge of Next.js and React

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rupayan2005/Diving-into-the-Next.git
   cd pdf-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Getting Gemini API Key

1. Visit Google AI Studio
2. Create a new API key or use an existing one
3. Add the API key to your `.env.local` file

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your application URL | ✅ |

## 📁 Project Structure

```
shadowbot/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   └── extract-pdf/
│   │       └── route.ts
│   ├── lib/
│   │   ├── utils.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── chat/
│   ├── page.tsx
├── public/
├── .env.local
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎯 Usage

### Basic Usage

1. **Upload a PDF**: Click the upload button and select your PDF file
2. **Wait for Processing**: The system will extract text from your PDF
3. **Start Chatting**: Ask questions about the PDF content
4. **Get Answers**: Receive intelligent responses based on the document

### Example Queries

- "What is the main topic of this document?"
- "Summarize the key points from chapter 2"
- "What are the conclusions mentioned in the PDF?"
- "Find information about [specific topic]"

## 🔌 API Endpoints

### POST `/api/extract-pdf`
Upload and process PDF files.

**Request:**
```typescript
FormData with 'file' field containing PDF
```

**Response:**
```json
{
  "success": true,
  "message": "PDF processed successfully",
  "textContent": "extracted text..."
}
```

### POST `/api/chat`
Send chat messages and get AI responses.

**Request:**
```json
{
  "message": "Your question here",
  "pdfContent": "PDF text content",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "AI generated answer"
}
```

## 🎨 Customization

### Styling
Modify `tailwind.config.js` to customize the color scheme and styling:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color'
      }
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- Docker
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🐛 Troubleshooting

### Common Issues

**PDF Upload Fails**
- Check file size (max 10MB recommended)
- Ensure the file is a valid PDF
- Verify server has write permissions

**API Errors**
- Verify your Gemini API key is correct
- Check API quota and billing
- Ensure environment variables are properly set

**Build Errors**
- Clear `.next` folder and rebuild
- Check Node.js version compatibility
- Verify all dependencies are installed

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the documentation
- Review existing issues for solutions

## 🎉 Acknowledgments

- Google Gemini AI for powering the intelligent responses
- The pdf-parse library for PDF text extraction
- Next.js and Tailwind CSS communities for excellent documentation

---

**Built with ❤️ using Next.js, Tailwind CSS, and Google Gemini AI**