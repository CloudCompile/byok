import { calculateCost } from '../lib/cost';

export const config = {
  name: 'anthropic',
  displayName: 'Anthropic',
  baseUrl: 'https://api.anthropic.com',
  models: [
    'claude-opus-4-5',
    'claude-opus-4',
    'claude-sonnet-4-5',
    'claude-sonnet-4',
    'claude-3-5-sonnet-20241022',
    'claude-3-5-haiku-20241022',
    'claude-3-haiku-20240307',
    'claude-haiku-4-5',
  ],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages, temperature, max_tokens, stream, top_p, stop } = openaiRequest;

  // Separate system message
  const systemMsg = messages.find((m) => m.role === 'system');
  const userMessages = messages.filter((m) => m.role !== 'system');

  const body = {
    model: model || 'claude-sonnet-4-5',
    messages: userMessages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: Array.isArray(m.content) ? m.content : m.content,
    })),
    max_tokens: max_tokens || 4096,
    ...(systemMsg && { system: systemMsg.content }),
    ...(temperature !== undefined && { temperature }),
    ...(top_p !== undefined && { top_p }),
    ...(stop && { stop_sequences: Array.isArray(stop) ? stop : [stop] }),
    ...(stream && { stream: true }),
  };

  const response = await fetch(`${config.baseUrl}/v1/messages`, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic error ${response.status}: ${err}`);
  }

  if (stream) {
    return { stream: true, body: response.body, provider: config.name };
  }

  const data = await response.json();
  const inputTokens = data.usage?.input_tokens || 0;
  const outputTokens = data.usage?.output_tokens || 0;

  return {
    id: data.id,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: data.content?.[0]?.text || '',
        },
        finish_reason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason,
      },
    ],
    usage: {
      prompt_tokens: inputTokens,
      completion_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
    },
    _metadata: { provider: config.name, cost: calculateCost(config.name, model, inputTokens, outputTokens) },
  };
}
