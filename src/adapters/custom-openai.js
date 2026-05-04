import { calculateCost } from '../lib/cost';

export const config = {
  name: 'custom',
  displayName: 'Custom OpenAI-Compatible',
  baseUrl: null,
  models: ['*'],
  openaiCompatible: true,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: "baseUrl|token" or just token (uses CUSTOM_OPENAI_BASE_URL env)
  let baseUrl, token;
  const sepIdx = apiKey.indexOf('|');
  if (sepIdx > -1) {
    baseUrl = apiKey.slice(0, sepIdx);
    token = apiKey.slice(sepIdx + 1);
  } else if (apiKey.startsWith('http')) {
    baseUrl = apiKey;
    token = '';
  } else {
    baseUrl = process.env.CUSTOM_OPENAI_BASE_URL || 'http://localhost:11434/v1';
    token = apiKey;
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiRequest),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Custom endpoint error ${response.status}: ${err}`);
  }

  if (openaiRequest.stream) {
    return { stream: true, body: response.body, provider: config.name };
  }

  const data = await response.json();
  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;

  return {
    ...data,
    _metadata: { provider: config.name, cost: calculateCost(config.name, openaiRequest.model, inputTokens, outputTokens) },
  };
}
