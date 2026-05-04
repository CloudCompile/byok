import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'perplexity',
  displayName: 'Perplexity',
  baseUrl: 'https://api.perplexity.ai',
  models: [
    'llama-3.1-sonar-large-128k-online',
    'llama-3.1-sonar-small-128k-online',
    'llama-3.1-sonar-huge-128k-online',
    'llama-3.1-sonar-large-128k-chat',
    'llama-3.1-sonar-small-128k-chat',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
