import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'modal',
  displayName: 'Modal',
  baseUrl: 'https://api.modal.com/v1',
  models: ['meta-llama/Meta-Llama-3.1-70B-Instruct', 'mistralai/Mistral-7B-Instruct-v0.3'],
});

export const config = { ...adapter.config };
export async function translate(openaiRequest, apiKey) {
  const { calculateCost } = await import('../lib/cost');
  const response = await fetch('https://api.modal.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(openaiRequest),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Modal error ${response.status}: ${err}`);
  }
  if (openaiRequest.stream) return { stream: true, body: response.body, provider: config.name };
  const data = await response.json();
  const i = data.usage?.prompt_tokens || 0, o = data.usage?.completion_tokens || 0;
  return { ...data, _metadata: { provider: config.name, cost: calculateCost(config.name, openaiRequest.model, i, o) } };
}
