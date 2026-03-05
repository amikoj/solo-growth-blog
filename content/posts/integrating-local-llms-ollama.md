---
title: "Integrating Local LLMs (Ollama) into Web Apps"
date: 2026-03-05T11:00:00+08:00
draft: false
tags: ["LLM", "Ollama", "Local AI", "Privacy", "Web Development"]
categories: ["Dev Tutorials", "AI Engineering"]
description: "Run powerful LLMs like Llama 3 locally and integrate them into your web applications for zero cost and maximum privacy."
---

Running Large Language Models (LLMs) in the cloud is convenient, but it comes with downsides: data privacy concerns, latency, and cost. 

Enter **Ollama**. It allows you to run open-source models like Llama 3, Mistral, and Gemma locally on your machine with a simple API. In this tutorial, we'll connect a React web app to a local Ollama instance.

## Why Local LLMs?

1.  **Privacy**: Your data never leaves your machine. Perfect for sensitive documents.
2.  **Cost**: $0. No token fees. (See my guide on [reducing API costs]({{< ref "reduce-llm-api-costs-caching.md" >}}) for cloud alternatives).
3.  **Offline Capability**: Works without an internet connection.

## Prerequisites

1.  **Install Ollama**: Download from [ollama.com](https://ollama.com).
2.  **Pull a Model**: Open your terminal and run:
    ```bash
    ollama pull llama3
    ```

## Step 1: Configure Ollama for External Access

By default, Ollama listens on `localhost:11434`. If you want your web app to access it directly (client-side), you need to enable CORS.

On macOS/Linux:
```bash
launchctl setenv OLLAMA_ORIGINS "*"
```
(Or set the environment variable `OLLAMA_ORIGINS="*"` in your shell before running `ollama serve`).

## Step 2: The API Route (Next.js)

While you *can* call Ollama directly from the browser, it's often better to proxy through your backend to handle timeouts or switch between local/cloud providers.

We'll reuse the Vercel AI SDK pattern from our [streaming chat guide]({{< ref "building-streaming-ai-chat-react.md" >}}).

Install the Ollama provider:
```bash
npm install ollama-ai-provider
```

Create `app/api/chat/route.ts`:

```typescript
import { createOllama } from 'ollama-ai-provider';
import { StreamingTextResponse, streamText } from 'ai';

const ollama = createOllama({
  baseURL: 'http://127.0.0.1:11434/api',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama('llama3'),
    messages,
  });

  return new StreamingTextResponse(result.toAIStream());
}
```

## Step 3: The Frontend

The frontend code remains **exactly the same** as the OpenAI implementation! That's the beauty of the Vercel AI SDK abstraction.

```tsx
'use client';
import { useChat } from 'ai/react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  // ... rest of the UI
}
```

## Alternative: WebLLM (In-Browser Execution)

If you don't want users to install Ollama, you can run the model *inside the browser* using WebGPU and **WebLLM**.

```typescript
import { CreateMLCEngine } from "@mlc-ai/web-llm";

async function main() {
  const engine = await CreateMLCEngine(
    "Llama-3-8B-Instruct-q4f32_1-MLC",
    { initProgressCallback: (report) => console.log(report.text) }
  );

  const reply = await engine.chat.completions.create({
    messages: [{ role: "user", content: "Hello!" }],
  });
  
  console.log(reply.choices[0].message);
}
```
*Note: This requires the user to download ~4GB of model weights to their browser cache.*

## Conclusion

Local LLMs unlock a new class of privacy-first applications. Whether you use Ollama for a personal assistant or WebLLM for a fully client-side experience, the tools are ready today.
