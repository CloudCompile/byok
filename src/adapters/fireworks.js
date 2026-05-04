import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'fireworks',
  displayName: 'Fireworks AI',
  baseUrl: 'https://api.fireworks.ai/inference',
  models: [
    'accounts/fireworks/models/llama-v3p1-405b-instruct',
    'accounts/fireworks/models/llama-v3p1-70b-instruct',
    'accounts/fireworks/models/llama-v3p1-8b-instruct',
    'accounts/fireworks/models/mixtral-8x22b-instruct',
    'accounts/fireworks/models/qwen2p5-72b-instruct',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
