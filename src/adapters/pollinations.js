import { calculateCost } from '../lib/cost';

export const config = {
  name: 'pollinations',
  displayName: 'Pollinations',
  baseUrl: 'https://text.pollinations.ai',
  models: ['openai', 'claude', 'gemini', 'mistral', 'llama', 'deepseek'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages } = openaiRequest;

  // Pollinations has a simple OpenAI-compat layer
  const response = await fetch(`${config.baseUrl}/openai`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    },
    body: JSON.stringify({ ...openaiRequest, model: model || 'openai' }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Pollinations error ${response.status}: ${err}`);
  }

  if (openaiRequest.stream) {
    return { stream: true, body: response.body, provider: config.name };
  }

  const data = await response.json();
  const inputTokens = data.usage?.prompt_tokens || 0;
  const outputTokens = data.usage?.completion_tokens || 0;

  return {
    ...data,
    _metadata: { provider: config.name, cost: 0 },
  };
}
