import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'together',
  displayName: 'Together AI',
  baseUrl: 'https://api.together.xyz',
  models: [
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'Qwen/Qwen2.5-72B-Instruct-Turbo',
    'google/gemma-2-27b-it',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
