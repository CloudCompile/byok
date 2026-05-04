import { calculateCost } from '../lib/cost';

export const config = {
  name: 'portkey',
  displayName: 'Portkey',
  baseUrl: 'https://api.portkey.ai/v1',
  models: ['*'],
  openaiCompatible: true,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: "apiKey:virtualKey" or just apiKey
  const [pk, vk] = apiKey.split(':');

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'x-portkey-api-key': pk,
      ...(vk && { 'x-portkey-virtual-key': vk }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiRequest),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Portkey error ${response.status}: ${err}`);
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
