---
title: "How to Reduce LLM API Costs: Caching and Context Management"
date: 2026-03-05T10:00:00+08:00
draft: false
tags: ["LLM", "OpenAI", "Caching", "Cost Optimization", "Backend"]
categories: ["Dev Tutorials", "AI Engineering"]
description: "Learn practical strategies to cut your LLM API bills by up to 50% using semantic caching, context window management, and token optimization."
---

Building AI applications is exciting, but the API bills can be terrifying. When you're paying per token, every character counts. In this guide, we'll explore three proven strategies to reduce your LLM API costs without sacrificing quality.

## Strategy 1: Semantic Caching

Traditional caching (key-value) only works for exact matches. If User A asks "What is the capital of France?" and User B asks "France capital city?", a traditional cache misses.

**Semantic Caching** uses vector embeddings to understand that these questions are identical in meaning.

### How it works:
1.  Receive user query.
2.  Generate an embedding for the query (using a cheap model like `text-embedding-3-small`).
3.  Search your vector database (Pinecone, Redis, pgvector) for similar vectors.
4.  If a match with high similarity (> 0.95) is found, return the cached response.
5.  If not, call the expensive LLM (GPT-4), return the response, and save the vector + response to the cache.

### Implementation Example (Redis)

```typescript
import { OpenAI } from "openai";
import { createClient } from "redis";

const redis = createClient();
const openai = new OpenAI();

async function getResponse(query: string) {
  // 1. Check Cache (Simplified for exact match, use vector search for semantic)
  const cached = await redis.get(query);
  if (cached) return JSON.parse(cached);

  // 2. Call LLM
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: query }],
  });

  const response = completion.choices[0].message.content;

  // 3. Save to Cache
  await redis.set(query, JSON.stringify(response), { EX: 3600 }); // Expire in 1 hour

  return response;
}
```

*Note: For true semantic caching, you'd integrate a vector store here.*

## Strategy 2: Context Window Management

Sending the entire chat history with every request is the fastest way to burn through tokens.

### The "Sliding Window" Approach
Instead of sending all 50 messages, send only the last 10. The model usually only needs recent context to maintain coherence.

### The "Summarization" Approach
Periodically summarize the conversation history into a single system message.

```typescript
const history = [
  { role: 'user', content: '...' },
  // ... 20 messages
];

// Summarize old messages
const summary = await summarize(history.slice(0, 15)); 

// New context
const optimizedMessages = [
  { role: 'system', content: `Summary of previous conversation: ${summary}` },
  ...history.slice(15)
];
```

This is crucial when building interfaces like the one discussed in my [Streaming AI Chat Interface guide]({{< ref "building-streaming-ai-chat-react.md" >}}), where long-running conversations are common.

## Strategy 3: Token Counting & Limits

Always count tokens before sending a request. The `tiktoken` library is the standard for OpenAI models.

```bash
npm install tiktoken
```

```typescript
import { encoding_for_model } from "tiktoken";

const enc = encoding_for_model("gpt-4");
const tokens = enc.encode("Hello world");
console.log(tokens.length); // 2
enc.free();
```

If a user pastes a 10,000-word document, you can detect this *before* making the API call and ask them to shorten it, or automatically truncate it to fit your budget.

## Conclusion

By implementing semantic caching and managing your context window, you can significantly reduce the number of tokens sent to expensive models like GPT-4. Start with simple caching, and evolve to vector-based semantic caching as your traffic grows.
