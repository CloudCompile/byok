import { createOpenAICompatAdapter } from './_openai_compat';

const adapter = createOpenAICompatAdapter({
  name: 'siliconflow',
  displayName: 'SiliconFlow',
  baseUrl: 'https://api.siliconflow.cn',
  models: [
    'deepseek-ai/DeepSeek-V3',
    'deepseek-ai/DeepSeek-R1',
    'Qwen/Qwen2.5-72B-Instruct',
    'Qwen/Qwen2.5-32B-Instruct',
    'meta-llama/Meta-Llama-3.1-70B-Instruct',
    'THUDM/glm-4-9b-chat',
  ],
});

export const config = adapter.config;
export const translate = adapter.translate.bind(adapter);
