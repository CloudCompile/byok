import { getAdapter } from '../adapters/index';
import { decrypt } from './encryption';
import { calculateCost } from './cost';
import { databases, DB_ID, COLLECTIONS } from './appwrite';

// Providers that support the @provider/model prefix syntax
const PREFIX_PROVIDERS = new Set([
  'anthropic','openai','google','deepseek','openrouter','groq','together','mistral',
  'perplexity','fireworks','cohere','siliconflow','cerebras','xai','deepinfra',
  'vertexai','ibm','ollama','wavespeedai','inference','qwen','anyscale','modal',
  'voyage','jina','nomic','stability','pollinations','elevenlabs','cloudflare','custom',
]);

// Parse "@provider/model" prefix — returns { provider, model } or { provider: null, model }
export function parseProviderPrefix(model) {
  if (!model || !model.startsWith('@')) return { provider: null, model };
  const rest = model.slice(1);
  const slash = rest.indexOf('/');
  if (slash === -1) return { provider: null, model };
  const prefix = rest.slice(0, slash);
  if (!PREFIX_PROVIDERS.has(prefix)) return { provider: null, model };
  return { provider: prefix, model: rest.slice(slash + 1) };
}

// Determine which provider to use for a given model string
export function detectProvider(model) {
  if (!model) return null;

  const m = model.toLowerCase();

  if (m.startsWith('claude')) return 'anthropic';
  if (m.startsWith('gpt-') || m.startsWith('o1') || m.startsWith('o3') || m.startsWith('text-embedding-')) return 'openai';
  if (m.startsWith('gemini') || m.startsWith('palm')) return 'google';
  if (m.startsWith('deepseek')) return 'deepseek';
  if (m.startsWith('llama-3') || m.startsWith('mixtral') || m.startsWith('gemma')) return 'groq';
  if (m.startsWith('mistral') || m.startsWith('codestral') || m.startsWith('open-mixtral')) return 'mistral';
  if (m.startsWith('command')) return 'cohere';
  if (m.startsWith('grok')) return 'xai';
  if (m.startsWith('accounts/fireworks')) return 'fireworks';
  if (m.startsWith('@cf/')) return 'cloudflare';
  if (m.startsWith('ibm/') || m.startsWith('ibm-')) return 'ibm';
  if (m.startsWith('voyage')) return 'voyage';
  if (m.startsWith('jina')) return 'jina';
  if (m.startsWith('nomic')) return 'nomic';
  if (m.startsWith('stable-diffusion') || m.startsWith('sd3')) return 'stability';
  if (m.startsWith('eleven_')) return 'elevenlabs';
  if (m.startsWith('qwen') || m.includes('qwen')) return 'qwen';
  if (m.startsWith('llama3.') && !m.startsWith('llama3.1')) return 'cerebras';
  if (m.includes('sonar')) return 'perplexity';
  if (m.startsWith('wavespeed')) return 'wavespeedai';
  if (m.startsWith('meta-llama/') || m.startsWith('mistralai/') || m.startsWith('google/gemma')) return 'together';
  if (m.startsWith('deepseek-ai/') || m.startsWith('thudm/')) return 'siliconflow';

  return null;
}

export function findBestProvider(model, userKeys) {
  // Auto-detect provider from model name
  const detected = detectProvider(model);
  if (detected) {
    const key = userKeys.find((k) => k.provider === detected && k.isActive);
    if (key) return { key, provider: detected };
  }

  // Fallback: try openrouter (supports most models)
  const orKey = userKeys.find((k) => k.provider === 'openrouter' && k.isActive);
  if (orKey) return { key: orKey, provider: 'openrouter' };

  // Last resort: first available key
  const anyKey = userKeys.find((k) => k.isActive);
  if (anyKey) return { key: anyKey, provider: anyKey.provider };

  return null;
}

export function findFallbackProviders(model, userKeys, excludeProvider) {
  const fallbacks = [];

  // OpenRouter as universal fallback
  const orKey = userKeys.find((k) => k.provider === 'openrouter' && k.isActive && k.provider !== excludeProvider);
  if (orKey) fallbacks.push({ key: orKey, provider: 'openrouter' });

  // Together AI
  const togetherKey = userKeys.find((k) => k.provider === 'together' && k.isActive && k.provider !== excludeProvider);
  if (togetherKey) fallbacks.push({ key: togetherKey, provider: 'together' });

  // Custom endpoint
  const customKey = userKeys.find((k) => k.provider === 'custom' && k.isActive && k.provider !== excludeProvider);
  if (customKey) fallbacks.push({ key: customKey, provider: 'custom' });

  return fallbacks;
}

export async function logRequest(userId, model, provider, usage, statusCode, cost) {
  try {
    await databases.createDocument(DB_ID, COLLECTIONS.REQUEST_LOGS, 'unique()', {
      userId,
      model,
      provider,
      tokensInput: usage?.prompt_tokens || 0,
      tokensOutput: usage?.completion_tokens || 0,
      tokensCached: usage?.cached_tokens || 0,
      estimatedCost: cost || 0,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log request:', err.message);
  }
}

export async function routeRequest(openaiRequest, userKeys, userId) {
  // Support "@provider/model" prefix for explicit provider targeting
  const { provider: prefixedProvider, model: strippedModel } = parseProviderPrefix(openaiRequest.model || '');
  const effectiveRequest = prefixedProvider
    ? { ...openaiRequest, model: strippedModel }
    : openaiRequest;
  const { model } = effectiveRequest;

  let target;
  if (prefixedProvider) {
    const key = userKeys.find((k) => k.provider === prefixedProvider && k.isActive);
    if (!key) throw new Error(`No active key for provider "${prefixedProvider}". Add one in the dashboard.`);
    target = { key, provider: prefixedProvider };
  } else {
    target = findBestProvider(model, userKeys);
  }

  if (!target) {
    throw new Error('No available API keys configured for this model. Please add an API key in the dashboard.');
  }

  const adapter = getAdapter(target.provider);
  if (!adapter) {
    throw new Error(`No adapter found for provider: ${target.provider}`);
  }

  const apiKey = decrypt(target.key.encryptedKey);

  try {
    const response = await adapter.translate(effectiveRequest, apiKey);

    // Log usage (non-blocking)
    if (!response.stream) {
      const cachedTokens = response._metadata?.cachedTokens || response.usage?.cached_tokens || 0;
      const cost = response._metadata?.cost || calculateCost(target.provider, model, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0, cachedTokens);
      logRequest(userId, model, target.provider, response.usage, 200, cost);
    }

    return response;
  } catch (primaryError) {
    console.warn(`Primary provider ${target.provider} failed:`, primaryError.message);

    // Try fallbacks
    const fallbacks = findFallbackProviders(model, userKeys, target.provider);

    for (const fallback of fallbacks) {
      const fallbackAdapter = getAdapter(fallback.provider);
      if (!fallbackAdapter) continue;

      try {
        const fallbackKey = decrypt(fallback.key.encryptedKey);
        const response = await fallbackAdapter.translate(openaiRequest, fallbackKey);

        if (!response.stream) {
          const cost = response._metadata?.cost || 0;
          logRequest(userId, model, fallback.provider, response.usage, 200, cost);
        }

        return response;
      } catch (fallbackError) {
        console.warn(`Fallback ${fallback.provider} failed:`, fallbackError.message);
      }
    }

    // All failed — log the failure and rethrow
    logRequest(userId, model, target.provider, null, 500, 0);
    throw primaryError;
  }
}
