import { calculateCost } from '../lib/cost';

export const config = {
  name: 'cloudflare',
  displayName: 'Cloudflare Workers AI',
  baseUrl: 'https://api.cloudflare.com/client/v4',
  models: [
    '@cf/meta/llama-3.1-70b-instruct',
    '@cf/meta/llama-3.1-8b-instruct',
    '@cf/mistral/mistral-7b-instruct-v0.2',
    '@cf/google/gemma-7b-it',
    '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
  ],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: "accountId:apiToken"
  const [accountId, apiToken] = apiKey.split(':');
  const { model, messages, temperature, max_tokens } = openaiRequest;

  const response = await fetch(
    `${config.baseUrl}/accounts/${accountId}/ai/run/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
        })),
        ...(temperature !== undefined && { temperature }),
        ...(max_tokens && { max_tokens }),
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Cloudflare AI error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.result?.response || '';

  return {
    id: `cf-${Date.now()}`,
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
    usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
    _metadata: { provider: config.name, cost: calculateCost(config.name, model, 0, 0) },
  };
}
