import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'anyscale',
  displayName: 'Anyscale',
  baseUrl: 'https://api.endpoints.anyscale.com',
  models: [
    'meta-llama/Llama-2-70b-chat-hf',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'codellama/CodeLlama-70b-Instruct-hf',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
