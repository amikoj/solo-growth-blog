+++
title = "From Scripts to Synapses: Building a Thinking Partner with LangGraph"
date = 2025-12-24T10:30:01Z
tags = ["ai", "langgraph", "python", "agents", "coding"]
categories = ["tech-thoughts"]
series = "tech"
description = "I wanted to build an AI that could play '20 Questions' with me. I ended up learning how to wire a brain."
+++

I’ve been obsessed with making code feel "alive" lately.

Not just faster APIs or slicker UIs. I mean code that has a train of thought. Code that can remember where it is in a conversation, decide what to do next based on context, and maybe even "change its mind."

It sounds like building a brain. And for a long time, my attempts looked less like a brain and more like a plate of spaghetti. Infinite `if...else` chains, fragile state variables, and logic that broke the moment I added a new feature.

![LangGraph Thinking Partner](/images/langgraph-001.png)

Then I found **LangGraph**.

It changed my mental model from "writing a script" to "wiring a circuit." Here is the story of how I built a "Movie Guessing" agent, and what I learned about the future of programming.

## The Problem: Linear Chains vs. Loops

My goal was simple: Build an AI agent that plays "20 Questions" (or "Guess the Movie") with me.
- The AI picks a movie (secretly).
- It asks me a Yes/No question to narrow down the candidates.
- It learns from my answer.
- It asks the next question based on what it learned.
- It has 20 tries.

If you try to build this with a standard LLM chain (like a simple prompt loop), you hit a wall. You need to persist state (how many questions left? what have we ruled out?) and you need **loops**.

Most LLM frameworks are DAGs (Directed Acyclic Graphs). They go from A to B to C. But a game—and a conversation—is a cycle. You ask, you listen, you update your mental model, you ask again.

## Enter LangGraph: Thinking in Nodes and Edges

LangGraph lets you model your application as a... well, graph.
- **Nodes** are functions (do something).
- **Edges** are control flow (go here next).
- **State** is a shared dictionary that gets passed around.

It feels remarkably like drawing a flowchart on a whiteboard, except the flowchart actually runs.

### Step 1: Defining the "Brain" State

First, I needed a scoreboard. In LangGraph, this is a TypedDict.

```python
from typing import TypedDict, List

class GameState(TypedDict):
    remaining_questions: int  # Tries left
    known_yes: List[str]      # Features confirmed YES
    known_no: List[str]       # Features confirmed NO
    current_question: str     # The question AI is asking
    game_over: bool           # Is it done?
    message: str              # Message to the player
```

### Step 2: The Neurons (Nodes)

Each node is just a Python function that takes the current state and returns an update.

**Node A: The Question Generator**
This node looks at what we know and decides the best next move.

```python
def generate_question_node(state: GameState):
    if state["remaining_questions"] <= 0:
        return {"message": "Game Over! I ran out of tries.", "game_over": True}
    
    # In a real app, an LLM would generate this based on known_yes/no
    # For this demo, let's simulate some logic
    features = ["Is it Sci-Fi?", "Is it from the 90s?", "Is the lead an alien?"]
    
    # Simple logic to pick a new question
    for f in features:
        if f not in state["known_yes"] + state["known_no"]:
            return {
                "current_question": f, 
                "remaining_questions": state["remaining_questions"] - 1
            }
            
    return {"message": "I'm stumped!", "game_over": True}
```

**Node B: The Listener**
This node processes the human's answer.

```python
def process_answer_node(state: GameState, answer: str):
    if answer.lower() == "yes":
        return {
            "known_yes": state["known_yes"] + [state["current_question"]],
            "message": "Got it. Adding to YES list."
        }
    else:
        return {
            "known_no": state["known_no"] + [state["current_question"]],
            "message": "Understood. Ruling that out."
        }
```

### Step 3: Wiring the Brain

This is the magic part. We connect the nodes.

```python
from langgraph.graph import StateGraph, END

# 1. Create the graph
workflow = StateGraph(GameState)

# 2. Add nodes
workflow.add_node("generate_question", generate_question_node)
workflow.add_node("process_answer", process_answer_node)

# 3. Define the flow
workflow.set_entry_point("generate_question")

# Conditional logic: If game over, stop. Else, wait for answer.
def decide_next_step(state):
    if state["game_over"]:
        return END
    return "process_answer"

workflow.add_conditional_edges(
    "generate_question",
    decide_next_step
)

# The Loop: After processing an answer, go back to generating a question
workflow.add_edge("process_answer", "generate_question")

# 4. Compile
game_app = workflow.compile()
```

## The "Aha!" Moment

When I ran this, I watched the logs.
*State -> Generate Question -> Wait -> Update State -> Generate Question...*

It wasn't just executing a script. It was **looping**. It was maintaining a memory of our conversation and refining its strategy with every turn.

This simple cycle—**Perceive, Act, Observe, Repeat**—is the foundation of agentic AI.

## Why This Matters

We are moving away from "Prompt Engineering" (crafting the perfect text string) to "Flow Engineering" (designing the perfect thought process).

LangGraph gives us the primitives to build systems that don't just answer questions, but **solve problems**. They can try, fail, retry, and learn within the scope of a single task.

I started with a movie guessing game. Next, I'm thinking of building a coding assistant that writes a test, runs it, sees the error, fixes the code, and loops until the test passes.

The gap between "Chatbot" and "Employee" is closing. And it looks a lot like a graph.
