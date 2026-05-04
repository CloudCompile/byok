import { calculateCost } from '../lib/cost';

export const config = {
  name: 'azure',
  displayName: 'Azure OpenAI',
  baseUrl: null,
  models: ['gpt-4o', 'gpt-4', 'gpt-4-turbo', 'gpt-35-turbo'],
  openaiCompatible: true,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: "endpoint:apiKey:deployment" or JSON
  let endpoint, key, deployment;
  try {
    const parsed = JSON.parse(apiKey);
    endpoint = parsed.endpoint;
    key = parsed.apiKey;
    deployment = parsed.deployment || openaiRequest.model;
  } catch {
    const parts = apiKey.split('|');
    endpoint = parts[0];
    key = parts[1];
    deployment = parts[2] || openaiRequest.model;
  }

  const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=2024-08-01-preview`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api-key': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiRequest),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Azure OpenAI error ${response.status}: ${err}`);
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
