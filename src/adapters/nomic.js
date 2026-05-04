import { calculateCost } from '../lib/cost';

export const config = {
  name: 'nomic',
  displayName: 'Nomic',
  baseUrl: 'https://api-atlas.nomic.ai/v1',
  models: ['nomic-embed-text-v1.5', 'nomic-embed-text-v1', 'nomic-embed-vision-v1.5'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages } = openaiRequest;
  const lastMsg = messages[messages.length - 1];
  const text = typeof lastMsg?.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg?.content);

  const response = await fetch(`${config.baseUrl}/embedding/text`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texts: [text], model: model || 'nomic-embed-text-v1.5', task_type: 'search_query' }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Nomic error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const embedding = data.embeddings?.[0] || [];
  const tokens = data.usage?.total_tokens || 0;

  return {
    id: `nomic-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: JSON.stringify(embedding) },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: tokens, completion_tokens: 0, total_tokens: tokens },
    _metadata: { provider: config.name, cost: calculateCost(config.name, model, tokens, 0), embedding },
  };
}
