import { calculateCost } from '../lib/cost';

export const config = {
  name: 'stability',
  displayName: 'Stability AI',
  baseUrl: 'https://api.stability.ai',
  models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6', 'sd3-medium', 'sd3-large'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages } = openaiRequest;
  const lastMsg = messages[messages.length - 1];
  const prompt = typeof lastMsg?.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg?.content);

  const engineId = model || 'stable-diffusion-xl-1024-v1-0';

  const response = await fetch(`${config.baseUrl}/v1/generation/${engineId}/text-to-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt, weight: 1 }],
      cfg_scale: 7,
      height: 1024,
      width: 1024,
      steps: 30,
      samples: 1,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Stability AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const imageB64 = data.artifacts?.[0]?.base64 || '';

  return {
    id: `stability-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: `data:image/png;base64,${imageB64}` },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    _metadata: { provider: config.name, cost: 0.02, imageBase64: imageB64 },
  };
}
