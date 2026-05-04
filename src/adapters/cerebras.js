import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'cerebras',
  displayName: 'Cerebras',
  baseUrl: 'https://api.cerebras.ai',
  models: ['llama3.1-8b', 'llama3.1-70b', 'llama3.3-70b'],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
