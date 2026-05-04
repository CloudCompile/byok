import { calculateCost } from '../lib/cost';

export const config = {
  name: 'cohere',
  displayName: 'Cohere',
  baseUrl: 'https://api.cohere.com',
  models: ['command-r-plus', 'command-r', 'command', 'command-light'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages, temperature, max_tokens, stream } = openaiRequest;

  const systemMsg = messages.find((m) => m.role === 'system');
  const chatHistory = [];
  const userMessages = messages.filter((m) => m.role !== 'system');

  // Build chat history (all but last user message)
  for (let i = 0; i < userMessages.length - 1; i++) {
    chatHistory.push({
      role: userMessages[i].role === 'assistant' ? 'CHATBOT' : 'USER',
      message: typeof userMessages[i].content === 'string' ? userMessages[i].content : JSON.stringify(userMessages[i].content),
    });
  }

  const lastMsg = userMessages[userMessages.length - 1];
  const message = typeof lastMsg?.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg?.content);

  const body = {
    model: model || 'command-r',
    message,
    chat_history: chatHistory,
    ...(systemMsg && { preamble: systemMsg.content }),
    ...(temperature !== undefined && { temperature }),
    ...(max_tokens && { max_tokens }),
    ...(stream && { stream: true }),
  };

  const response = await fetch(`${config.baseUrl}/v1/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cohere error ${response.status}: ${err}`);
  }

  if (stream) {
    return { stream: true, body: response.body, provider: config.name };
  }

  const data = await response.json();
  const inputTokens = data.meta?.tokens?.input_tokens || 0;
  const outputTokens = data.meta?.tokens?.output_tokens || 0;

  return {
    id: data.generation_id || `cohere-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: data.text || '' },
        finish_reason: data.finish_reason?.toLowerCase() || 'stop',
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
