import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'inference',
  displayName: 'Inference.net',
  baseUrl: 'https://api.inference.net/v1',
  models: [
    'meta-llama/llama-3.1-70b-instruct/fp-8',
    'meta-llama/llama-3.1-8b-instruct/fp-8',
    'mistralai/mixtral-8x7b-instruct/fp-8',
  ],
});

// Inference.net already includes /v1 in base so skip extra path
export const config = { ...adapter.config };
export async function translate(openaiRequest, apiKey) {
  const { calculateCost } = await import('../lib/cost');
  const response = await fetch('https://api.inference.net/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(openaiRequest),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Inference.net error ${response.status}: ${err}`);
  }
  if (openaiRequest.stream) return { stream: true, body: response.body, provider: config.name };
  const data = await response.json();
  const i = data.usage?.prompt_tokens || 0, o = data.usage?.completion_tokens || 0;
  return { ...data, _metadata: { provider: config.name, cost: calculateCost(config.name, openaiRequest.model, i, o) } };
}
