import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'xai',
  displayName: 'xAI Grok',
  baseUrl: 'https://api.x.ai',
  models: ['grok-2-latest', 'grok-2-vision-1212', 'grok-beta'],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
