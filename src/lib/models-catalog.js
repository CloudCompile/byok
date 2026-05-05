// Client-safe catalog — no server imports.
// Combines display metadata with pricing from PROVIDER_PRICING.
import { PROVIDER_PRICING } from './cost';

export const PROVIDERS_META = {
  anthropic:   { displayName: 'Anthropic',        color: '#d97757', tier: 'frontier' },
  openai:      { displayName: 'OpenAI',            color: '#10a37f', tier: 'frontier' },
  google:      { displayName: 'Google',            color: '#4285f4', tier: 'frontier' },
  xai:         { displayName: 'xAI (Grok)',        color: '#ffffff', tier: 'frontier' },
  deepseek:    { displayName: 'DeepSeek',          color: '#4d6bfe', tier: 'frontier' },
  mistral:     { displayName: 'Mistral',           color: '#f54e42', tier: 'tier1'   },
  cohere:      { displayName: 'Cohere',            color: '#39594d', tier: 'tier1'   },
  groq:        { displayName: 'Groq',              color: '#f55036', tier: 'tier1'   },
  together:    { displayName: 'Together AI',       color: '#1c77c3', tier: 'tier1'   },
  fireworks:   { displayName: 'Fireworks AI',      color: '#ff6b35', tier: 'tier1'   },
  perplexity:  { displayName: 'Perplexity',        color: '#20808d', tier: 'tier1'   },
  siliconflow: { displayName: 'SiliconFlow',       color: '#6366f1', tier: 'tier1'   },
  cerebras:    { displayName: 'Cerebras',          color: '#ff3b00', tier: 'tier1'   },
  qwen:        { displayName: 'Qwen (Alibaba)',    color: '#ff6a00', tier: 'tier1'   },
  deepinfra:   { displayName: 'DeepInfra',         color: '#3b82f6', tier: 'cloud'   },
  replicate:   { displayName: 'Replicate',         color: '#000000', tier: 'cloud'   },
  huggingface: { displayName: 'Hugging Face',      color: '#ffca37', tier: 'cloud'   },
  bedrock:     { displayName: 'AWS Bedrock',       color: '#ff9900', tier: 'cloud'   },
  azure:       { displayName: 'Azure OpenAI',      color: '#0078d4', tier: 'cloud'   },
  vertexai:    { displayName: 'Google Vertex AI',  color: '#4285f4', tier: 'cloud'   },
  ibm:         { displayName: 'IBM watsonx',       color: '#054ada', tier: 'cloud'   },
  cloudflare:  { displayName: 'Cloudflare AI',     color: '#f38020', tier: 'cloud'   },
  openrouter:  { displayName: 'OpenRouter',        color: '#6467f2', tier: 'router'  },
  portkey:     { displayName: 'Portkey',           color: '#7c3aed', tier: 'router'  },
  bifrost:     { displayName: 'Bifrost',           color: '#059669', tier: 'router'  },
  ollama:      { displayName: 'Ollama (local)',    color: '#ffffff', tier: 'local'   },
  custom:      { displayName: 'Custom OpenAI',     color: '#6b7280', tier: 'local'   },
  pollinations:{ displayName: 'Pollinations',      color: '#34d399', tier: 'free'    },
  stability:   { displayName: 'Stability AI',      color: '#9333ea', tier: 'image'   },
  voyage:      { displayName: 'Voyage AI',         color: '#0ea5e9', tier: 'embed'   },
  jina:        { displayName: 'Jina AI',           color: '#9b5de5', tier: 'embed'   },
  nomic:       { displayName: 'Nomic',             color: '#14b8a6', tier: 'embed'   },
  elevenlabs:  { displayName: 'ElevenLabs',        color: '#f97316', tier: 'audio'   },
  wavespeedai: { displayName: 'WaveSpeed AI',      color: '#8b5cf6', tier: 'image'   },
  inference:   { displayName: 'HF Inference',      color: '#ffca37', tier: 'cloud'   },
  anyscale:    { displayName: 'Anyscale',          color: '#00b4d8', tier: 'cloud'   },
  modal:       { displayName: 'Modal',             color: '#a78bfa', tier: 'cloud'   },
};

export const TIER_LABELS = {
  frontier: 'Frontier',
  tier1:    'Tier 1',
  cloud:    'Cloud / Managed',
  router:   'Router / Proxy',
  local:    'Local / Self-hosted',
  free:     'Free / Open',
  image:    'Image Generation',
  audio:    'Audio',
  embed:    'Embeddings',
};

// Build enriched catalog from PROVIDER_PRICING
export function getCatalog() {
  return Object.entries(PROVIDER_PRICING).map(([providerId, models]) => {
    const meta = PROVIDERS_META[providerId] || { displayName: providerId, color: '#6b7280', tier: 'cloud' };
    const modelList = Object.entries(models)
      .filter(([id]) => id !== 'default')
      .map(([id, pricing]) => ({ id, ...pricing }));
    const defaultPricing = models.default || null;

    return {
      id: providerId,
      ...meta,
      models: modelList,
      defaultPricing,
      prefix: `@${providerId}`,
    };
  });
}
