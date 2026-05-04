import { calculateCost } from '../lib/cost';

export const config = {
  name: 'openrouter',
  displayName: 'OpenRouter',
  baseUrl: 'https://openrouter.ai/api',
  models: ['auto', 'openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash', 'deepseek/deepseek-chat', 'meta-llama/llama-3.3-70b-instruct'],
  openaiCompatible: true,
};

export async function translate(openaiRequest, apiKey) {
  const response = await fetch(`${config.baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://byok.app',
      'X-Title': 'BYOK Gateway',
    },
    body: JSON.stringify(openaiRequest),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenRouter error ${response.status}: ${err}`);
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
