import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'deepseek',
  displayName: 'DeepSeek',
  baseUrl: 'https://api.deepseek.com',
  models: ['deepseek-chat', 'deepseek-reasoner', 'deepseek-coder'],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
