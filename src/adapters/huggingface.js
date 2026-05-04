import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'huggingface',
  displayName: 'Hugging Face',
  baseUrl: 'https://api-inference.huggingface.co/models',
  models: [
    'meta-llama/Meta-Llama-3.1-70B-Instruct',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'Qwen/Qwen2.5-72B-Instruct',
  ],
});

export const config = adapter.config;

export async function translate(openaiRequest, apiKey) {
  const { calculateCost } = await import('../lib/cost');
  // HF Inference API for chat completions
  const response = await fetch('https://api-inference.huggingface.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(openaiRequest),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`HuggingFace error ${response.status}: ${err}`);
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
