// Per-1M-token pricing: { input, output }
export const PROVIDER_PRICING = {
  anthropic: {
    'claude-opus-4-5': { input: 15, output: 75 },
    'claude-opus-4': { input: 15, output: 75 },
    'claude-sonnet-4-5': { input: 3, output: 15 },
    'claude-sonnet-4': { input: 3, output: 15 },
    'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
    'claude-3-5-haiku-20241022': { input: 0.8, output: 4 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
    'claude-haiku-4-5': { input: 0.8, output: 4 },
  },
  openai: {
    'gpt-4o': { input: 5, output: 15 },
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'gpt-4-turbo': { input: 10, output: 30 },
    'gpt-4': { input: 30, output: 60 },
    'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    'o1': { input: 15, output: 60 },
    'o1-mini': { input: 3, output: 12 },
    'o3-mini': { input: 1.1, output: 4.4 },
  },
  google: {
    'gemini-2.0-flash': { input: 0.075, output: 0.3 },
    'gemini-2.0-flash-exp': { input: 0, output: 0 },
    'gemini-1.5-pro': { input: 3.5, output: 10.5 },
    'gemini-1.5-flash': { input: 0.075, output: 0.3 },
    'gemini-1.5-flash-8b': { input: 0.0375, output: 0.15 },
  },
  deepseek: {
    'deepseek-chat': { input: 0.27, output: 1.1 },
    'deepseek-reasoner': { input: 0.55, output: 2.19 },
    'deepseek-coder': { input: 0.27, output: 1.1 },
  },
  openrouter: {
    // Dynamic — uses pass-through pricing
    default: { input: 1, output: 3 },
  },
  groq: {
    'llama-3.3-70b-versatile': { input: 0.59, output: 0.79 },
    'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
    'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
    'mixtral-8x7b-32768': { input: 0.24, output: 0.24 },
    'gemma2-9b-it': { input: 0.2, output: 0.2 },
    'whisper-large-v3': { input: 0.111, output: 0 },
  },
  together: {
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo': { input: 3.5, output: 3.5 },
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo': { input: 0.88, output: 0.88 },
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo': { input: 0.18, output: 0.18 },
    'mistralai/Mixtral-8x7B-Instruct-v0.1': { input: 0.6, output: 0.6 },
    'Qwen/Qwen2.5-72B-Instruct-Turbo': { input: 1.2, output: 1.2 },
    default: { input: 0.9, output: 0.9 },
  },
  fireworks: {
    'accounts/fireworks/models/llama-v3p1-405b-instruct': { input: 3, output: 3 },
    'accounts/fireworks/models/llama-v3p1-70b-instruct': { input: 0.9, output: 0.9 },
    'accounts/fireworks/models/llama-v3p1-8b-instruct': { input: 0.2, output: 0.2 },
    default: { input: 0.9, output: 0.9 },
  },
  mistral: {
    'mistral-large-latest': { input: 3, output: 9 },
    'mistral-small-latest': { input: 0.2, output: 0.6 },
    'mistral-nemo': { input: 0.15, output: 0.15 },
    'codestral-latest': { input: 1, output: 3 },
    'open-mixtral-8x22b': { input: 2, output: 6 },
    'open-mixtral-8x7b': { input: 0.7, output: 0.7 },
  },
  cohere: {
    'command-r-plus': { input: 3, output: 15 },
    'command-r': { input: 0.5, output: 1.5 },
    'command': { input: 1, output: 2 },
    'command-light': { input: 0.3, output: 0.6 },
  },
  perplexity: {
    'llama-3.1-sonar-large-128k-online': { input: 1, output: 1 },
    'llama-3.1-sonar-small-128k-online': { input: 0.2, output: 0.2 },
    'llama-3.1-sonar-huge-128k-online': { input: 5, output: 5 },
    default: { input: 1, output: 1 },
  },
  siliconflow: {
    'deepseek-ai/DeepSeek-V3': { input: 0.27, output: 1.1 },
    'Qwen/Qwen2.5-72B-Instruct': { input: 0.57, output: 0.57 },
    default: { input: 0.3, output: 0.6 },
  },
  cerebras: {
    'llama3.1-8b': { input: 0.1, output: 0.1 },
    'llama3.1-70b': { input: 0.6, output: 0.6 },
    'llama3.3-70b': { input: 0.85, output: 0.85 },
    default: { input: 0.5, output: 0.5 },
  },
  xai: {
    'grok-2-latest': { input: 2, output: 10 },
    'grok-2-vision-1212': { input: 2, output: 10 },
    'grok-beta': { input: 5, output: 15 },
    default: { input: 2, output: 10 },
  },
  bedrock: {
    'anthropic.claude-3-5-sonnet-20241022-v2:0': { input: 3, output: 15 },
    'anthropic.claude-3-haiku-20240307-v1:0': { input: 0.25, output: 1.25 },
    'meta.llama3-1-70b-instruct-v1:0': { input: 0.72, output: 0.72 },
    'amazon.titan-text-premier-v1:0': { input: 0.5, output: 1.5 },
    default: { input: 1, output: 3 },
  },
  azure: {
    default: { input: 5, output: 15 },
  },
  vertexai: {
    default: { input: 1.25, output: 5 },
  },
  deepinfra: {
    'meta-llama/Meta-Llama-3.1-70B-Instruct': { input: 0.52, output: 0.75 },
    'mistralai/Mixtral-8x7B-Instruct-v0.1': { input: 0.27, output: 0.27 },
    default: { input: 0.5, output: 0.75 },
  },
  replicate: {
    default: { input: 0.65, output: 2.75 },
  },
  huggingface: {
    default: { input: 0.1, output: 0.1 },
  },
  ollama: {
    default: { input: 0, output: 0 },
  },
  wavespeedai: {
    default: { input: 0.5, output: 1.5 },
  },
  inference: {
    default: { input: 0.4, output: 1.2 },
  },
  anyscale: {
    default: { input: 0.5, output: 1.5 },
  },
  modal: {
    default: { input: 0.6, output: 1.8 },
  },
  voyage: {
    'voyage-3': { input: 0.06, output: 0 },
    'voyage-3-lite': { input: 0.02, output: 0 },
    default: { input: 0.06, output: 0 },
  },
  jina: {
    default: { input: 0.02, output: 0 },
  },
  nomic: {
    default: { input: 0.1, output: 0 },
  },
  portkey: {
    default: { input: 1, output: 3 },
  },
  cloudflare: {
    default: { input: 0.11, output: 0.11 },
  },
  bifrost: {
    default: { input: 1, output: 3 },
  },
  custom: {
    default: { input: 0, output: 0 },
  },
};

export function calculateCost(provider, model, inputTokens, outputTokens) {
  const providerPricing = PROVIDER_PRICING[provider];
  if (!providerPricing) return 0;

  const pricing = providerPricing[model] || providerPricing['default'];
  if (!pricing) return 0;

  return (inputTokens * pricing.input) / 1_000_000 + (outputTokens * pricing.output) / 1_000_000;
}

export function getProviderPricing(provider, model) {
  const providerPricing = PROVIDER_PRICING[provider];
  if (!providerPricing) return null;
  return providerPricing[model] || providerPricing['default'] || null;
}
