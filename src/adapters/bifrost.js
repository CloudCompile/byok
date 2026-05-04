import { createOpenAICompatAdapter } from './_openai_compat';

// Bifrost — self-hosted AI gateway, OpenAI-compatible
const adapter = createOpenAICompatAdapter({
  name: 'bifrost',
  displayName: 'Bifrost Gateway',
  baseUrl: 'http://localhost:8080',
  models: ['*'],
});

export const config = { ...adapter.config };

export async function translate(openaiRequest, apiKey) {
  const { calculateCost } = await import('../lib/cost');
  // apiKey format: "baseUrl:token" or just base URL
  let baseUrl = config.baseUrl;
  let token = apiKey;
  if (apiKey && apiKey.startsWith('http')) {
    const idx = apiKey.indexOf('|');
    if (idx > -1) {
      baseUrl = apiKey.slice(0, idx);
      token = apiKey.slice(idx + 1);
    } else {
      baseUrl = apiKey;
      token = '';
    }
  }
  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiRequest),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Bifrost error ${response.status}: ${err}`);
  }
  if (openaiRequest.stream) return { stream: true, body: response.body, provider: config.name };
  const data = await response.json();
  const i = data.usage?.prompt_tokens || 0, o = data.usage?.completion_tokens || 0;
  return { ...data, _metadata: { provider: config.name, cost: calculateCost(config.name, openaiRequest.model, i, o) } };
}
