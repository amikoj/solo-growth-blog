+++
title = "The 'One Amazon' Fallacy: Engineering Global Affiliate Traffic"
date = 2026-02-01T10:00:00Z
tags = ["engineering", "monetization", "amazon-affiliate", "vercel", "nextjs"]
categories = ["dev-log"]
series = "solo-trial"
description = "I realized that sending a German user to amazon.com is the fastest way to kill a conversion. Here's how I fixed it."
+++

I recently spent a week fighting with the Amazon Affiliate program. I thought it would be simple: get a link, paste it, profit.

I was wrong. I fell into the trap of thinking "Amazon is Amazon."

## The "One Amazon" Fallacy

Here is the reality: To a user in London, `amazon.com` is a foreign website. To a user in Berlin, it's virtually useless.

If I send a German user to the US store, three things happen, and they are all bad:
1.  **Shipping Shock**: They see "Does not ship to Germany" or massive international shipping fees. They leave.
2.  **Commission Leak**: They manually switch to `amazon.de` to buy the item. Because the session didn't carry over, I get **$0**.
3.  **Trust Damage**: Showing prices in USD ($) to a European user looks unprofessional.

To make this work, I needed to treat the US, UK, and Germany as three separate universes.

## The Engineering Solution

I decided to support the "Big Three" initially: **US** (United States), **GB** (United Kingdom), and **DE** (Germany).

### Step 1: The Paperwork (Again)

There is no "Global Account." I had to register for Amazon Associates separately in the US, UK, and Germany.
*   Three sign-ups.
*   Three tax interviews (W-8BEN).
*   Three bank account configurations.

It's tedious, but necessary to get the unique **Affiliate Tags** for each region.

### Step 2: Smart Routing with Vercel

Since my site is hosted on **Vercel**, I can use their edge network to detect where a user is coming from without slowing down the page.

Vercel provides a request header called `x-vercel-ip-country`. I use this to dynamically swap the Amazon domain and my affiliate tag.

Here is the logic I implemented:

```javascript
const REGION_CONFIG = {
  US: {
    domain: "amazon.com",
    currency: "$",
    tagEnv: "AMAZON_TAG_US", // My US Store ID
  },
  GB: {
    domain: "amazon.co.uk",
    currency: "£",
    tagEnv: "AMAZON_TAG_GB", // My UK Store ID
  },
  DE: {
    domain: "amazon.de",
    currency: "€",
    tagEnv: "AMAZON_TAG_DE", // My German Store ID
  },
};

// Default to US if country is unknown
const region = REGION_CONFIG[userCountryCode] || REGION_CONFIG.US;
```

Now, when a user from London visits, the site automatically renders `amazon.co.uk` links with my UK tag.

### Step 3: The Safety Net (OneLink)

Even with code handling the routing, I set up **Amazon OneLink**.
This is Amazon's internal tool that links your international accounts. It acts as a fallback. If my code fails to detect the IP, or if a user shares a link with a friend overseas, OneLink attempts to redirect them to their local store.

## Conclusion

Building a global product (even a tiny one) means respecting the user's physical reality. You can't just ship US-centric code and expect the world to adapt.

It was a headache to set up, but now the plumbing is truly global. A click in Berlin stays in Berlin. A click in New York stays in New York.

And hopefully, the coins drop into the right buckets.
