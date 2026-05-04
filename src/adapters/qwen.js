import { createOpenAICompatAdapter } from './_openai_compat';

// Alibaba Cloud DashScope - Qwen models
const adapter = createOpenAICompatAdapter({
  name: 'qwen',
  displayName: 'Alibaba Qwen',
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode',
  models: [
    'qwen-max',
    'qwen-plus',
    'qwen-turbo',
    'qwen2.5-72b-instruct',
    'qwen2.5-32b-instruct',
    'qwen2.5-14b-instruct',
    'qwen2.5-7b-instruct',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
