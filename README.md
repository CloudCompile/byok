# BYOK AI Gateway

**Bring Your Own Keys** — A personal AI API gateway that unifies 50+ AI providers behind a single OpenAI-compatible endpoint.

```
POST /api/v1/chat/completions
Authorization: Bearer byok_<keyId>_<secret>
```

## Features

- **Unified endpoint** — OpenAI-compatible `/v1/chat/completions` for all providers
- **50+ adapters** — Anthropic, OpenAI, Google, DeepSeek, Groq, Together, Mistral, Cohere, and 40+ more
- **Smart routing** — Auto-detects provider from model name, custom rules, fallback chains
- **Cost tracking** — Per-request cost estimation with full analytics dashboard
- **Glassmorphic UI** — Beautiful dark dashboard with real-time charts
- **Encrypted storage** — All API keys encrypted at rest with AES-256-GCM
- **Streaming** — SSE streaming pass-through for all compatible providers

## Quick Start

```bash
# 1. Clone + install
git clone <repo>
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your Appwrite credentials

# 3. Initialize Appwrite collections
node scripts/init-appwrite.js

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

## How It Works

1. **Add provider keys** — Go to `/keys`, add your API keys for any provider
2. **Generate gateway key** — Go to `/gateway`, create a `byok_*` key
3. **Make requests** — Use your gateway key with any OpenAI-compatible SDK:

```python
import openai
client = openai.OpenAI(
    api_key="byok_<keyId>_<secret>",
    base_url="https://your-app.vercel.app/api/v1"
)
response = client.chat.completions.create(
    model="claude-sonnet-4-5",  # auto-routes to Anthropic
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## Supported Providers

| Tier | Providers |
|------|-----------|
| Frontier | Anthropic, OpenAI, Google Gemini, DeepSeek |
| Aggregators | OpenRouter, WaveSpeed AI, Together AI, Hugging Face, Perplexity |
| Cost/Speed | SiliconFlow, Groq, Fireworks, Mistral, Replicate, Cohere, Inference.net, Alibaba Qwen |
| Enterprise | AWS Bedrock, Azure OpenAI, Google Vertex AI, IBM watsonx, Cerebras, Modal, DeepInfra, Anyscale |
| Infrastructure | Ollama, Bifrost, Portkey, Cloudflare Workers AI |
| Embeddings | Voyage AI, Jina, Nomic |
| Multimodal | Stability AI, Pollinations, ElevenLabs |
| Custom | Generic OpenAI-compatible endpoint, xAI Grok |

## Auto-Routing Logic

Models are auto-routed by name prefix:
- `claude-*` → Anthropic
- `gpt-*`, `o1*`, `o3*` → OpenAI
- `gemini-*` → Google
- `deepseek-*` → DeepSeek
- `llama-3*`, `mixtral*`, `gemma*` → Groq
- `mistral-*`, `codestral-*` → Mistral
- `command-*` → Cohere
- `grok-*` → xAI
- `accounts/fireworks/*` → Fireworks AI
- `anthropic.*`, `meta.llama*` → AWS Bedrock
- `@cf/*` → Cloudflare Workers AI
- `qwen*` → Alibaba Qwen
- etc.

No match → tries OpenRouter (if key present) → first available key.

## Deployment

See [SETUP.md](./SETUP.md) for complete Vercel + Appwrite deployment instructions.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS, Recharts, TanStack Query
- **Backend**: Next.js API Routes (Edge-compatible)
- **Database**: Appwrite (managed)
- **Auth**: JWT + bcrypt gateway keys
- **Encryption**: AES-256-GCM for stored API keys
