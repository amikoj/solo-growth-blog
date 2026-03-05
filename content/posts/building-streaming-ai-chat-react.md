---
title: "Building a Streaming AI Chat Interface with React and Vercel AI SDK"
date: 2026-03-05T09:00:00+08:00
draft: false
tags: ["React", "AI", "Vercel", "Streaming", "OpenAI", "Frontend"]
categories: ["Dev Tutorials", "AI Engineering"]
description: "Learn how to build a real-time, streaming chat interface using React and the Vercel AI SDK. Improve user experience by reducing perceived latency."
---

In the era of Large Language Models (LLMs), users expect instant feedback. Waiting 5-10 seconds for a full response to generate is a poor user experience. **Streaming** solves this by delivering the response chunk by chunk, just like ChatGPT.

In this tutorial, we'll build a streaming chat interface using **React** and the **Vercel AI SDK**. This SDK simplifies the complex process of managing streams, chat history, and UI updates.

## Why Streaming Matters

When you request a completion from an LLM like GPT-4, the model generates tokens sequentially.
- **Without Streaming**: The server waits for the entire response (all tokens) before sending anything back to the client. The user stares at a spinner for seconds.
- **With Streaming**: The server sends each token as soon as it's generated. The user sees text appearing immediately, reducing *perceived latency*.

## Prerequisites

- A Next.js project (App Router recommended for Edge Runtime support).
- An OpenAI API Key.
- `ai` and `openai` packages installed.

```bash
npm install ai openai
```

## Step 1: The Backend (API Route)

We need an API endpoint to handle the request to OpenAI and return a stream. The Vercel AI SDK provides a `StreamingTextResponse` class that makes this trivial.

Create a file at `app/api/chat/route.ts`:

```typescript
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
```

### Key Concepts:
- **Edge Runtime**: By setting `runtime = 'edge'`, this function runs on Vercel's Edge Network, which is faster and has higher streaming limits than serverless functions.
- **OpenAIStream**: Converts the raw OpenAI stream into a format that the Vercel AI SDK client can consume easily.

## Step 2: The Frontend (React Component)

Now for the UI. The `useChat` hook is the magic ingredient. It handles:
1.  Form submission.
2.  Appending the user message to the local state immediately.
3.  Sending the request to the API.
4.  Updating the AI response state as chunks arrive.

Create a component `components/Chat.tsx`:

```tsx
'use client';

import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.length > 0 ? (
        messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap mb-4">
            <span className="font-bold">
              {m.role === 'user' ? 'User: ' : 'AI: '}
            </span>
            {m.content}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 mb-8">
          Start a conversation...
        </div>
      )}

      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl bg-white">
        <input
          className="w-full p-2 outline-none"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </div>
  );
}
```

### Breakdown:
- **messages**: An array of message objects (`{ id, role, content }`).
- **input**: The current value of the input field.
- **handleInputChange**: Automatically updates the `input` state.
- **handleSubmit**: Sends the `messages` history + `input` to your API endpoint (`/api/chat` by default).

## Handling Markdown and Code Blocks

LLMs often output Markdown. To render it properly, you can use `react-markdown`.

```bash
npm install react-markdown
```

Update the message display:

```tsx
import ReactMarkdown from 'react-markdown';

// ... inside the map loop
<div key={m.id} className={`mb-4 p-4 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
  <p className="font-bold mb-1">{m.role === 'user' ? 'You' : 'AI'}</p>
  <ReactMarkdown>
    {m.content}
  </ReactMarkdown>
</div>
```

## Optimizing for Production

When deploying this to production, you might want to consider:

1.  **Rate Limiting**: Prevent abuse by limiting how many requests a user can make. Vercel KV or Upstash are great for this.
2.  **Model Configuration**: You can pass `body` in `useChat` to send custom parameters (like `temperature`) to your API.
3.  **Error Handling**: The `useChat` hook exposes an `error` object. Display a toast notification if the stream fails.

## Conclusion

The Vercel AI SDK abstracts away the complexities of stream parsing and state management, allowing you to build a ChatGPT-like experience in minutes.

If you are interested in optimizing your frontend build process further, check out my guide on [Migrating from Webpack to Vite]({{< ref "migrating-webpack-to-vite.md" >}}), which discusses how modern tooling can speed up your development cycle just like streaming speeds up your UX.
