import { calculateCost } from '../lib/cost';

export const config = {
  name: 'google',
  displayName: 'Google Gemini',
  baseUrl: 'https://generativelanguage.googleapis.com',
  models: ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages, temperature, max_tokens, stream } = openaiRequest;

  const systemMsg = messages.find((m) => m.role === 'system');
  const chatMessages = messages.filter((m) => m.role !== 'system');

  const contents = chatMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
  }));

  const body = {
    contents,
    ...(systemMsg && { systemInstruction: { parts: [{ text: systemMsg.content }] } }),
    generationConfig: {
      ...(temperature !== undefined && { temperature }),
      ...(max_tokens && { maxOutputTokens: max_tokens }),
    },
  };

  const modelId = model || 'gemini-2.0-flash';
  const endpoint = stream
    ? `${config.baseUrl}/v1beta/models/${modelId}:streamGenerateContent?key=${apiKey}&alt=sse`
    : `${config.baseUrl}/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Google error ${response.status}: ${err}`);
  }

  if (stream) {
    return { stream: true, body: response.body, provider: config.name };
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const content = candidate?.content?.parts?.[0]?.text || '';
  const inputTokens = data.usageMetadata?.promptTokenCount || 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount || 0;

  return {
    id: `google-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: candidate?.finishReason === 'STOP' ? 'stop' : candidate?.finishReason?.toLowerCase() || 'stop',
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
