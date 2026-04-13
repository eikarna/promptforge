# PromptForge

AI-powered prompt enrichment platform. Transform raw, low-fidelity prompts into expertly structured, god-tier outputs using professional prompt engineering frameworks.

## Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 (Glassmorphism design system)
- **Auth**: Auth.js v5 (username/password, JWT sessions)
- **Database**: Prisma 7 + Turso (LibSQL)
- **AI**: OpenRouter API (NVIDIA Nemotron, Claude, Gemini) — streaming SSE
- **Icons**: Lucide React
- **Animations**: Framer Motion + CSS keyframes

## Features

- **3 Enrichment Frameworks** — CO-STAR, RISEN, and Hybrid
- **Streaming Output** — real-time LLM response with typewriter cursor
- **Per-User API Keys** — encrypted storage, users bring their own OpenRouter key
- **Prompt History** — search, filter, expand, copy, delete
- **Preference Panel** — framework, tone, industry, model, temperature
- **Glassmorphism UI** — animated gradient mesh, glass cards, glow effects, orbital spinner

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Copy `.env.local` and fill in your values:

```bash
# Turso (from turso.tech dashboard)
TURSO_DATABASE_URL="libsql://your-db.turso.io"
TURSO_AUTH_TOKEN="your-auth-token"

# Auth secret (generate: openssl rand -base64 32)
AUTH_SECRET="your-random-secret"

# OpenRouter (optional server fallback)
OPENROUTER_API_KEY="sk-or-v1-..."

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Push database schema

```bash
npx prisma db push
```

### 4. Run dev server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── globals.css                 # Glassmorphism design system
│   ├── layout.tsx                  # Root layout (fonts, providers, bg)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar + shell
│   │   ├── page.tsx                # Enrichment workspace
│   │   ├── history/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/     # Auth handler
│       └── enrich/                 # Streaming enrichment API
├── actions/                        # Server actions
├── engine/
│   ├── enricher.ts                 # Core orchestrator
│   └── templates/                  # CO-STAR, RISEN, Hybrid
├── providers/
│   ├── openrouter.ts               # OpenRouter LLM provider
│   └── registry.ts                 # Provider factory
├── lib/
│   ├── auth.ts                     # Auth.js config
│   ├── prisma.ts                   # Prisma + LibSQL client
│   └── utils.ts                    # Helpers
├── types/                          # Shared TypeScript types
└── proxy.ts                        # Route protection (Next.js 16)
```

## Enrichment Frameworks

| Framework | Structure | Best For |
|-----------|-----------|----------|
| **CO-STAR** | Context · Objective · Style · Tone · Audience · Response | Content generation, writing tasks |
| **RISEN** | Role · Instructions · Steps · End goal · Narrowing | Technical tasks, step-by-step processes |
| **Hybrid** | Combined CO-STAR + RISEN | Complex, multi-faceted prompts |

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT
