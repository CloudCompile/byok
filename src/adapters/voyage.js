import { calculateCost } from '../lib/cost';

export const config = {
  name: 'voyage',
  displayName: 'Voyage AI',
  baseUrl: 'https://api.voyageai.com/v1',
  models: ['voyage-3', 'voyage-3-lite', 'voyage-code-3', 'voyage-finance-2'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  // Voyage is embeddings-focused; wrap for completions via chat format
  const { model, messages } = openaiRequest;
  const lastMsg = messages[messages.length - 1];
  const text = typeof lastMsg?.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg?.content);

  const response = await fetch(`${config.baseUrl}/embeddings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: [text], model: model || 'voyage-3' }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const tokens = data.usage?.total_tokens || 0;

  return {
    id: `voyage-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: JSON.stringify(data.data?.[0]?.embedding || []),
        },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: tokens, completion_tokens: 0, total_tokens: tokens },
    _metadata: { provider: config.name, cost: calculateCost(config.name, model, tokens, 0), embedding: data.data?.[0]?.embedding },
  };
}
