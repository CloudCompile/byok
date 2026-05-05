import * as anthropic from './anthropic';
import * as openai from './openai';
import * as google from './google';
import * as deepseek from './deepseek';
import * as openrouter from './openrouter';
import * as groq from './groq';
import * as together from './together';
import * as mistral from './mistral';
import * as perplexity from './perplexity';
import * as fireworks from './fireworks';
import * as cohere from './cohere';
import * as siliconflow from './siliconflow';
import * as cerebras from './cerebras';
import * as grok from './grok';
import * as deepinfra from './deepinfra';
import * as vertexai from './vertexai';
import * as ibm from './ibm';
import * as ollama from './ollama';
import * as wavespeedai from './wavespeedai';
import * as inference from './inference';
import * as qwen from './qwen';
import * as anyscale from './anyscale';
import * as modal from './modal';
import * as voyage from './voyage';
import * as jina from './jina';
import * as nomic from './nomic';
import * as stability from './stability';
import * as pollinations from './pollinations';
import * as elevenlabs from './elevenlabs';
import * as cloudflare from './cloudflare';
import * as customOpenAI from './custom-openai';

const ADAPTERS = {
  anthropic,
  openai,
  google,
  deepseek,
  openrouter,
  groq,
  together,
  mistral,
  perplexity,
  fireworks,
  cohere,
  siliconflow,
  cerebras,
  xai: grok,
  deepinfra,
  vertexai,
  ibm,
  ollama,
  wavespeedai,
  inference,
  qwen,
  anyscale,
  modal,
  voyage,
  jina,
  nomic,
  stability,
  pollinations,
  elevenlabs,
  cloudflare,
  custom: customOpenAI,
};

export function getAdapter(providerName) {
  return ADAPTERS[providerName] || null;
}

export function getAllProviders() {
  return Object.entries(ADAPTERS).map(([key, adapter]) => ({
    id: key,
    ...adapter.config,
  }));
}

export function getProviderConfig(providerName) {
  return ADAPTERS[providerName]?.config || null;
}

export default ADAPTERS;
