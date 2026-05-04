import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'groq',
  displayName: 'Groq',
  baseUrl: 'https://api.groq.com/openai',
  models: [
    'llama-3.3-70b-versatile',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'mixtral-8x7b-32768',
    'gemma2-9b-it',
    'llama3-70b-8192',
    'llama3-8b-8192',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
