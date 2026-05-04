# Provider Reference

Complete reference for all 35+ supported providers.

---

## Tier 1 — Frontier

### Anthropic
- **Models**: claude-opus-4-5, claude-sonnet-4-5, claude-haiku-4-5, claude-3-5-sonnet-20241022, claude-3-5-haiku-20241022
- **Key format**: `sk-ant-...`
- **Pricing**: Haiku $0.80/$4, Sonnet $3/$15, Opus $15/$75 (per 1M tokens in/out)
- **Docs**: https://docs.anthropic.com

### OpenAI
- **Models**: gpt-4o, gpt-4o-mini, gpt-4-turbo, o1, o1-mini, o3-mini
- **Key format**: `sk-...`
- **Pricing**: GPT-4o-mini $0.15/$0.60, GPT-4o $5/$15
- **Docs**: https://platform.openai.com/docs

### Google Gemini
- **Models**: gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash
- **Key format**: `AIza...`
- **Pricing**: Flash free tier, 1.5 Pro $3.5/$10.5
- **Docs**: https://ai.google.dev

### DeepSeek
- **Models**: deepseek-chat, deepseek-reasoner, deepseek-coder
- **Key format**: `sk-...`
- **Pricing**: Chat $0.27/$1.10, Reasoner $0.55/$2.19
- **Docs**: https://platform.deepseek.com

---

## Tier 2 — Aggregators

### OpenRouter
- **Models**: 200+ (all major providers)
- **Key format**: `sk-or-...`
- **Note**: Pass-through pricing. Excellent universal fallback.
- **Docs**: https://openrouter.ai/docs

### Together AI
- **Models**: Llama 3.1, Mixtral, Qwen 2.5, Gemma 2
- **Key format**: Bearer token
- **Pricing**: Llama 3.1 8B $0.18/$0.18
- **Docs**: https://docs.together.ai

### Perplexity
- **Models**: llama-3.1-sonar-large-128k-online (with web search)
- **Key format**: `pplx-...`
- **Note**: Online models include real-time web search
- **Docs**: https://docs.perplexity.ai

### Hugging Face
- **Models**: Any model on HF Inference API
- **Key format**: `hf_...`
- **Docs**: https://huggingface.co/docs/api-inference

### WaveSpeed AI
- **Models**: Flux, video generation
- **Docs**: https://wavespeed.ai

---

## Tier 3 — Cost/Speed Optimized

### Groq
- **Models**: llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768
- **Key format**: `gsk_...`
- **Note**: Extremely fast inference (18x faster than typical)
- **Pricing**: Llama 3.3 70B $0.59/$0.79
- **Docs**: https://console.groq.com

### Fireworks AI
- **Models**: Llama 3.1 405B, 70B, 8B
- **Key format**: `fw_...`
- **Pricing**: Llama 3.1 8B $0.20/$0.20
- **Docs**: https://fireworks.ai/docs

### Mistral AI
- **Models**: mistral-large-latest, mistral-small-latest, codestral-latest, open-mixtral-8x7b
- **Key format**: `...`
- **Pricing**: Mistral Small $0.20/$0.60
- **Docs**: https://docs.mistral.ai

### Cohere
- **Models**: command-r-plus, command-r, command
- **Key format**: Bearer token
- **Pricing**: Command R $0.50/$1.50
- **Docs**: https://docs.cohere.com

### SiliconFlow
- **Models**: DeepSeek V3/R1, Qwen 2.5, Llama 3.1
- **Note**: Chinese cloud, very cost-effective
- **Docs**: https://siliconflow.cn/docs

### Alibaba Qwen (DashScope)
- **Models**: qwen-max, qwen-plus, qwen-turbo, qwen2.5-72b-instruct
- **Key format**: `sk-...`
- **Docs**: https://help.aliyun.com/zh/dashscope

### Replicate
- **Models**: Llama 2, Mistral, Stable Diffusion
- **Key format**: `r8_...`
- **Note**: Per-second billing, uses polling
- **Docs**: https://replicate.com/docs

### Inference.net
- **Models**: Llama 3.1, Mixtral
- **Docs**: https://inference.net/docs

---

## Tier 4 — Enterprise

### AWS Bedrock
- **Models**: anthropic.claude-*, meta.llama*, amazon.titan-*
- **Key format**: `accessKeyId:secretAccessKey:region` or JSON
- **JSON format**: `{"accessKeyId":"...","secretAccessKey":"...","region":"us-east-1"}`
- **Docs**: https://docs.aws.amazon.com/bedrock

### Azure OpenAI
- **Models**: GPT-4o, GPT-4, GPT-3.5 (via deployments)
- **Key format**: `https://endpoint|apiKey|deploymentName`
- **Docs**: https://learn.microsoft.com/azure/ai-services/openai

### Google Vertex AI
- **Models**: Gemini 1.5 Pro, Flash
- **Key format**: JSON `{"projectId":"...","location":"us-central1","accessToken":"..."}`
- **Note**: Use `gcloud auth print-access-token` for access token
- **Docs**: https://cloud.google.com/vertex-ai/docs

### IBM watsonx
- **Models**: ibm/granite-*, meta-llama/*, mistralai/*
- **Key format**: `apiKey:projectId` or JSON
- **Docs**: https://www.ibm.com/products/watsonx-ai

### Cerebras
- **Models**: llama3.1-8b, llama3.1-70b, llama3.3-70b
- **Note**: Very fast inference on Cerebras hardware
- **Docs**: https://inference-docs.cerebras.ai

### Modal
- **Models**: Llama 3.1, Mistral
- **Docs**: https://modal.com/docs

### DeepInfra
- **Models**: Llama 3.1, Mixtral, Qwen 2.5, Phi-4
- **Docs**: https://deepinfra.com/docs

### Anyscale
- **Models**: Llama 2, Mixtral, CodeLlama
- **Docs**: https://www.anyscale.com/endpoints

---

## Tier 5 — Infrastructure

### Ollama (Local)
- **Models**: Any model pulled locally (llama3.2, mistral, phi3, gemma2...)
- **Key format**: Base URL, e.g. `http://localhost:11434`
- **Note**: Free, runs locally. Key is the base URL.
- **Docs**: https://ollama.com

### Portkey
- **Models**: Any (gateway to other providers)
- **Key format**: `portkeyApiKey` or `portkeyApiKey:virtualKey`
- **Docs**: https://portkey.ai/docs

### Cloudflare Workers AI
- **Models**: @cf/meta/llama-3.1-*, @cf/mistral/*, @cf/google/gemma-*
- **Key format**: `accountId:apiToken`
- **Docs**: https://developers.cloudflare.com/workers-ai

### Bifrost
- **Models**: Any (self-hosted gateway)
- **Key format**: `http://your-bifrost-host:8080|optionalToken`
- **Docs**: https://github.com/inference-labs-inc/bifrost

### xAI Grok
- **Models**: grok-2-latest, grok-2-vision-1212, grok-beta
- **Key format**: `xai-...`
- **Docs**: https://docs.x.ai

---

## Tier 6 — Embeddings

### Voyage AI
- **Models**: voyage-3, voyage-3-lite, voyage-code-3
- **Key format**: `pa-...`
- **Pricing**: $0.06/1M tokens
- **Docs**: https://docs.voyageai.com

### Jina AI
- **Models**: jina-embeddings-v3, jina-embeddings-v2-base-en
- **Docs**: https://jina.ai/embeddings

### Nomic
- **Models**: nomic-embed-text-v1.5, nomic-embed-vision-v1.5
- **Docs**: https://docs.nomic.ai

---

## Tier 7 — Multimodal

### Stability AI
- **Models**: stable-diffusion-xl-1024-v1-0, sd3-medium, sd3-large
- **Key format**: `sk-...`
- **Note**: Returns base64 image in content field
- **Docs**: https://platform.stability.ai/docs

### Pollinations
- **Models**: openai, claude, gemini, mistral, llama
- **Note**: Free tier available
- **Docs**: https://pollinations.ai

### ElevenLabs
- **Models**: eleven_multilingual_v2, eleven_turbo_v2
- **Note**: Returns base64 audio/mpeg in content field
- **Docs**: https://elevenlabs.io/docs

---

## Custom OpenAI-Compatible

For any self-hosted or custom endpoint that follows OpenAI's API format.

**Key format options:**
- `https://your-endpoint.com/v1|optionalBearerToken`
- `https://your-endpoint.com/v1` (no auth)
- Just the bearer token (uses `CUSTOM_OPENAI_BASE_URL` env var)

**Use cases:**
- vLLM server
- Text Generation Inference (TGI)
- LiteLLM proxy
- LM Studio
- Any OpenAI-compatible server
