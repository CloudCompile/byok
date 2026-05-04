import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'mistral',
  displayName: 'Mistral AI',
  baseUrl: 'https://api.mistral.ai',
  models: [
    'mistral-large-latest',
    'mistral-small-latest',
    'mistral-nemo',
    'codestral-latest',
    'open-mixtral-8x22b',
    'open-mixtral-8x7b',
    'open-mistral-7b',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
