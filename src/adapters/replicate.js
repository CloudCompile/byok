import { calculateCost } from '../lib/cost';

export const config = {
  name: 'replicate',
  displayName: 'Replicate',
  baseUrl: 'https://api.replicate.com',
  models: [
    'meta/llama-2-70b-chat',
    'meta/meta-llama-3-70b-instruct',
    'mistralai/mistral-7b-instruct-v0.2',
  ],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages, max_tokens } = openaiRequest;
  const lastUser = messages.filter((m) => m.role === 'user').pop();
  const systemMsg = messages.find((m) => m.role === 'system');

  const input = {
    prompt: typeof lastUser?.content === 'string' ? lastUser.content : JSON.stringify(lastUser?.content),
    ...(systemMsg && { system_prompt: systemMsg.content }),
    ...(max_tokens && { max_new_tokens: max_tokens }),
  };

  // Create prediction
  const createRes = await fetch(`${config.baseUrl}/v1/models/${model}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input }),
  });

  if (!createRes.ok) {
    const err = await createRes.text();
    throw new Error(`Replicate error ${createRes.status}: ${err}`);
  }

  let prediction = await createRes.json();
  const predId = prediction.id;

  // Poll for completion
  let attempts = 0;
  while (['starting', 'processing'].includes(prediction.status) && attempts < 30) {
    await new Promise((r) => setTimeout(r, 1000));
    const pollRes = await fetch(`${config.baseUrl}/v1/predictions/${predId}`, {
      headers: { Authorization: `Token ${apiKey}` },
    });
    prediction = await pollRes.json();
    attempts++;
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(`Replicate prediction failed: ${prediction.error || prediction.status}`);
  }

  const output = Array.isArray(prediction.output) ? prediction.output.join('') : String(prediction.output || '');

  return {
    id: predId,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: output },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    _metadata: { provider: config.name, cost: calculateCost(config.name, model, 0, 0) },
  };
}
