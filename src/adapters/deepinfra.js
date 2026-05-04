import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'deepinfra',
  displayName: 'DeepInfra',
  baseUrl: 'https://api.deepinfra.com/v1/openai',
  models: [
    'meta-llama/Meta-Llama-3.1-70B-Instruct',
    'meta-llama/Meta-Llama-3.1-8B-Instruct',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'Qwen/Qwen2.5-72B-Instruct',
    'microsoft/phi-4',
  ],
});

// DeepInfra's base already includes /v1 so we override translate to not add extra /v1
export const config = { ...adapter.config, baseUrl: 'https://api.deepinfra.com/v1/openai' };

export async function translate(openaiRequest, apiKey) {
  const { calculateCost } = await import('../lib/cost');
  const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiRequest),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepInfra error ${response.status}: ${err}`);
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
