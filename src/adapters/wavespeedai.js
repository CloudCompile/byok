import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'wavespeedai',
  displayName: 'WaveSpeed AI',
  baseUrl: 'https://api.wavespeed.ai',
  models: ['wavespeed-ai/flux-dev', 'wavespeed-ai/flux-schnell', 'wavespeed-ai/wan2.1-t2v-480p'],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
