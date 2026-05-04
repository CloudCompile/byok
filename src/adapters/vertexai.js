import { calculateCost } from '../lib/cost';

export const config = {
  name: 'vertexai',
  displayName: 'Google Vertex AI',
  baseUrl: null,
  models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: JSON with { projectId, location, accessToken } or service account JSON
  let projectId, location, accessToken;
  try {
    const parsed = JSON.parse(apiKey);
    projectId = parsed.projectId;
    location = parsed.location || 'us-central1';
    accessToken = parsed.accessToken;
  } catch {
    throw new Error('Vertex AI requires JSON credentials: { projectId, location, accessToken }');
  }

  const { model, messages, temperature, max_tokens } = openaiRequest;
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

  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Vertex AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const content = candidate?.content?.parts?.[0]?.text || '';
  const inputTokens = data.usageMetadata?.promptTokenCount || 0;
  const outputTokens = data.usageMetadata?.candidatesTokenCount || 0;

  return {
    id: `vertex-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
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
