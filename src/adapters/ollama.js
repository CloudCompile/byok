import { calculateCost } from '../lib/cost';

export const config = {
  name: 'ollama',
  displayName: 'Ollama (Local)',
  baseUrl: 'http://localhost:11434',
  models: ['llama3.2', 'llama3.1', 'mistral', 'codellama', 'phi3', 'gemma2', 'qwen2.5'],
  openaiCompatible: true,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey is the base URL for ollama (e.g. http://localhost:11434 or custom host)
  const baseUrl = apiKey && apiKey.startsWith('http') ? apiKey.replace(/\/$/, '') : config.baseUrl;

  const response = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(openaiRequest),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Ollama error ${response.status}: ${err}`);
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
