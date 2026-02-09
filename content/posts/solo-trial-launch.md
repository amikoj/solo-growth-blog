+++
title = "Solo Trial: Testing the Waters with a Gift Recommender"
date = 2026-01-06T15:20:00Z
tags = ["product-log", "solo-trial", "idea-validation"]
series = "solo-trial"
description = "My first attempt at an indie product: A simple gift recommendation tool. From browsing Product Hunt to facing the reality of payment gateways."
+++

> **Editor's Note**: This is the kickoff log for my "Solo Trial" project. It's an experiment to see if I can take a small, specific idea and turn it into a service that people actually use (and maybe pay for).

## Context

Lately, I've been lurking on Product Hunt and Reddit, and I can't shake this feeling.

I see so many simple, focused tools. Sometimes it's just a single page solving one tiny problem—like summarizing long articles or styling images. They are clean, simple, and often have a price tag attached. And the craziest part? People in the comments are saying, *"This is exactly what I needed!"* and actually paying for it.

It’s a stark contrast to what I’m used to. Coming from a background where "compliance" and "complexity" are the norm for any web project, seeing independent developers ship and monetize so directly feels... liberating.

It gave me an "unrealistic" hope: **Maybe I can do this too.**

## The Challenge

I started "scouting" without a map. I treated Product Hunt as my window shopping mall and Reddit (specifically `r/SideProject` and `r/EntrepreneurRideAlong`) as my classroom. I love the raw honesty there—seeing projects evolve from a buggy prototype to their first dollar.

I needed an idea that met three criteria:
1.  **Low Cost**: I don't want to burn cash on infrastructure.
2.  **Low Burden**: Easy to use, no complex onboarding.
3.  **Shareable**: Something people might naturally send to a friend.

**The Idea: "Gift Giving is Hard"**
I saw a discussion on Reddit about gift recommendations. There are AI tools that generate lists, but they felt dry. I thought: *Why is gift-giving hard?* Usually, it's because we aren't sure about the other person's "vibe."

What if I made a tool that determines a person's **"Gift Personality"** through a few fun questions, and then offers tailored inspiration? It sounds like a fun little quiz that could go viral.

## The Solution

I stopped overthinking and started building.

**The Stack**: Next.js + Supabase.
It seems to be the "Indie Hacker Starter Pack" these days. There are plenty of tutorials, so I managed to cobble together a functional site and deploy it on Vercel in just a few hours.

I sent the link to a friend.
His review: *"Wow, that was fast! But... uh, it's very minimalist."*
Translation: *It's ugly.*

But that's okay. This isn't a beauty pageant. It's a **probe balloon**. Its only job is to fly out there and see if there's any wind.

## The Reality Check

The "new toy" excitement faded in about three minutes when reality hit.

**1. The Payment Wall**
I naively thought, "I have a credit card, I can receive money." Nope.
Stripe and Paddle are the gold standards, but they require a bank account in a supported region. As a developer based in China, this is a huge hurdle.
*Current Plan*: I'm looking into **Wise** as a bridge. This is my top priority to figure out.

**2. The "Ghost Town" Problem**
Who is going to use this? I can't just stare at my own analytics.
My marketing plan (the "dumb way"):
*   **Reddit**: Share the journey and ask for feedback (roast my landing page!).
*   **X (Twitter)**: Build in public, share small wins.
*   **Ads**: Maybe spend a tiny amount on highly targeted ads just to test click-through rates. Consider it "tuition fees."

## Results & Learnings

The project is live (technically), but the real trial has just begun.

**Key Takeaways so far:**
*   **Speed over Perfection**: Shipping an "ugly" site felt better than polishing a local host project for weeks.
*   **The Ecosystem Gap**: Technical coding is the easy part. The ecosystem (payments, distribution) is where the real game is played.

This is just the beginning. Even if it fails, at least I'll be a developer who actually *tried* to sail out.

---

### About the Author

**Amiko** is a software engineer turned indie hacker, learning to build and sell to the global market.
Follow my journey on [X (Twitter)](https://x.com/yourusername) or subscribe to the [RSS Feed](/index.xml).