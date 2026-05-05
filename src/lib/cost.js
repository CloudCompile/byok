// Per-1M-token pricing: { input, output }
// Sources: official provider pricing pages (May 2026)
export const PROVIDER_PRICING = {
  anthropic: {
    // Claude 4.x
    'claude-opus-4-7':                   { input: 5,    output: 25 },
    'claude-opus-4-6':                   { input: 5,    output: 25 },
    'claude-opus-4-5':                   { input: 5,    output: 25 },
    'claude-opus-4-1':                   { input: 15,   output: 75 },
    'claude-opus-4':                     { input: 15,   output: 75 },
    'claude-sonnet-4-6':                 { input: 3,    output: 15 },
    'claude-sonnet-4-5':                 { input: 3,    output: 15 },
    'claude-sonnet-4':                   { input: 3,    output: 15 },
    'claude-haiku-4-5':                  { input: 1,    output: 5  },
    // Claude 3.x (versioned IDs)
    'claude-3-5-sonnet-20241022':        { input: 3,    output: 15 },
    'claude-3-5-sonnet-20240620':        { input: 3,    output: 15 },
    'claude-3-5-haiku-20241022':         { input: 0.8,  output: 4  },
    'claude-3-haiku-20240307':           { input: 0.25, output: 1.25 },
    'claude-3-opus-20240229':            { input: 15,   output: 75 },
    'claude-3-sonnet-20240229':          { input: 3,    output: 15 },
    'claude-haiku-4-5-20251001':         { input: 1,    output: 5  },
    default:                             { input: 3,    output: 15 },
  },

  openai: {
    // GPT-5.x family
    'gpt-5.5':                           { input: 5,    output: 30   },
    'gpt-5.5-pro':                       { input: 30,   output: 180  },
    'gpt-5.4':                           { input: 2.5,  output: 15   },
    'gpt-5.4-mini':                      { input: 0.75, output: 4.5  },
    'gpt-5.4-nano':                      { input: 0.2,  output: 1.25 },
    'gpt-5.4-pro':                       { input: 30,   output: 180  },
    'gpt-5.2':                           { input: 1.75, output: 14   },
    'gpt-5.2-pro':                       { input: 21,   output: 168  },
    'gpt-5.1':                           { input: 1.25, output: 10   },
    'gpt-5':                             { input: 1.25, output: 10   },
    'gpt-5-mini':                        { input: 0.25, output: 2    },
    'gpt-5-nano':                        { input: 0.05, output: 0.4  },
    'gpt-5-pro':                         { input: 15,   output: 120  },
    // GPT-4.x family
    'gpt-4.1':                           { input: 2,    output: 8    },
    'gpt-4.1-mini':                      { input: 0.4,  output: 1.6  },
    'gpt-4.1-nano':                      { input: 0.1,  output: 0.4  },
    'gpt-4o':                            { input: 2.5,  output: 10   },
    'gpt-4o-2024-05-13':                 { input: 5,    output: 15   },
    'gpt-4o-mini':                       { input: 0.15, output: 0.6  },
    // o-series
    'o1':                                { input: 15,   output: 60   },
    'o1-pro':                            { input: 150,  output: 600  },
    'o3':                                { input: 2,    output: 8    },
    'o3-pro':                            { input: 20,   output: 80   },
    'o4-mini':                           { input: 1.1,  output: 4.4  },
    'o3-mini':                           { input: 1.1,  output: 4.4  },
    'o1-mini':                           { input: 1.1,  output: 4.4  },
    // Legacy GPT-4
    'gpt-4-turbo':                       { input: 10,   output: 30   },
    'gpt-4-turbo-2024-04-09':            { input: 10,   output: 30   },
    'gpt-4-0125-preview':                { input: 10,   output: 30   },
    'gpt-4-1106-preview':                { input: 10,   output: 30   },
    'gpt-4-0613':                        { input: 30,   output: 60   },
    'gpt-4-32k':                         { input: 60,   output: 120  },
    // Legacy GPT-3.5
    'gpt-3.5-turbo':                     { input: 0.5,  output: 1.5  },
    'gpt-3.5-turbo-0125':                { input: 0.5,  output: 1.5  },
    'gpt-3.5-turbo-1106':                { input: 1,    output: 2    },
    'gpt-3.5-turbo-instruct':            { input: 1.5,  output: 2    },
    // Embeddings
    'text-embedding-3-small':            { input: 0.02, output: 0    },
    'text-embedding-3-large':            { input: 0.13, output: 0    },
    'text-embedding-ada-002':            { input: 0.1,  output: 0    },
    default:                             { input: 2.5,  output: 10   },
  },

  google: {
    'gemini-2.0-flash':                  { input: 0.075, output: 0.3  },
    'gemini-2.0-flash-exp':              { input: 0,     output: 0    },
    'gemini-1.5-pro':                    { input: 3.5,   output: 10.5 },
    'gemini-1.5-flash':                  { input: 0.075, output: 0.3  },
    'gemini-1.5-flash-8b':               { input: 0.0375,output: 0.15 },
    default:                             { input: 0.075, output: 0.3  },
  },

  deepseek: {
    'deepseek-chat':                     { input: 0.27,  output: 1.1  },
    'deepseek-reasoner':                 { input: 0.55,  output: 2.19 },
    'deepseek-coder':                    { input: 0.27,  output: 1.1  },
    default:                             { input: 0.27,  output: 1.1  },
  },

  openrouter: {
    default:                             { input: 1,    output: 3    },
  },

  groq: {
    'llama-3.3-70b-versatile':           { input: 0.59, output: 0.79 },
    'llama-3.1-70b-versatile':           { input: 0.59, output: 0.79 },
    'llama-3.1-8b-instant':              { input: 0.05, output: 0.08 },
    'llama3-70b-8192':                   { input: 0.59, output: 0.79 },
    'llama3-8b-8192':                    { input: 0.05, output: 0.08 },
    'mixtral-8x7b-32768':                { input: 0.24, output: 0.24 },
    'gemma2-9b-it':                      { input: 0.2,  output: 0.2  },
    default:                             { input: 0.59, output: 0.79 },
  },

  together: {
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo': { input: 3.5,  output: 3.5  },
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo':  { input: 0.88, output: 0.88 },
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo':   { input: 0.18, output: 0.18 },
    'mistralai/Mixtral-8x7B-Instruct-v0.1':           { input: 0.6,  output: 0.6  },
    'Qwen/Qwen2.5-72B-Instruct-Turbo':                { input: 1.2,  output: 1.2  },
    default:                                          { input: 0.9,  output: 0.9  },
  },

  fireworks: {
    'accounts/fireworks/models/llama-v3p1-405b-instruct': { input: 3,   output: 3   },
    'accounts/fireworks/models/llama-v3p1-70b-instruct':  { input: 0.9, output: 0.9 },
    'accounts/fireworks/models/llama-v3p1-8b-instruct':   { input: 0.2, output: 0.2 },
    default:                                              { input: 0.9, output: 0.9 },
  },

  mistral: {
    'mistral-large-latest':              { input: 3,    output: 9    },
    'mistral-small-latest':              { input: 0.2,  output: 0.6  },
    'mistral-nemo':                      { input: 0.15, output: 0.15 },
    'codestral-latest':                  { input: 1,    output: 3    },
    'open-mixtral-8x22b':                { input: 2,    output: 6    },
    'open-mixtral-8x7b':                 { input: 0.7,  output: 0.7  },
    default:                             { input: 0.2,  output: 0.6  },
  },

  cohere: {
    'command-r-plus':                    { input: 3,    output: 15   },
    'command-r':                         { input: 0.5,  output: 1.5  },
    'command':                           { input: 1,    output: 2    },
    'command-light':                     { input: 0.3,  output: 0.6  },
    default:                             { input: 0.5,  output: 1.5  },
  },

  perplexity: {
    'llama-3.1-sonar-large-128k-online': { input: 1,    output: 1    },
    'llama-3.1-sonar-small-128k-online': { input: 0.2,  output: 0.2  },
    'llama-3.1-sonar-huge-128k-online':  { input: 5,    output: 5    },
    default:                             { input: 1,    output: 1    },
  },

  siliconflow: {
    'deepseek-ai/DeepSeek-V3':           { input: 0.27, output: 1.1  },
    'Qwen/Qwen2.5-72B-Instruct':         { input: 0.57, output: 0.57 },
    default:                             { input: 0.3,  output: 0.6  },
  },

  cerebras: {
    'llama3.1-8b':                       { input: 0.1,  output: 0.1  },
    'llama3.1-70b':                      { input: 0.6,  output: 0.6  },
    'llama3.3-70b':                      { input: 0.85, output: 0.85 },
    default:                             { input: 0.5,  output: 0.5  },
  },

  xai: {
    'grok-2-latest':                     { input: 2,    output: 10   },
    'grok-2-vision-1212':                { input: 2,    output: 10   },
    'grok-beta':                         { input: 5,    output: 15   },
    default:                             { input: 2,    output: 10   },
  },

  bedrock: {
    'anthropic.claude-3-5-sonnet-20241022-v2:0': { input: 3,    output: 15   },
    'anthropic.claude-3-haiku-20240307-v1:0':    { input: 0.25, output: 1.25 },
    'meta.llama3-1-70b-instruct-v1:0':           { input: 0.72, output: 0.72 },
    'amazon.titan-text-premier-v1:0':            { input: 0.5,  output: 1.5  },
    default:                                     { input: 1,    output: 3    },
  },

  azure: {
    default:                             { input: 5,    output: 15   },
  },

  vertexai: {
    default:                             { input: 1.25, output: 5    },
  },

  deepinfra: {
    'meta-llama/Meta-Llama-3.1-70B-Instruct': { input: 0.52, output: 0.75 },
    'mistralai/Mixtral-8x7B-Instruct-v0.1':   { input: 0.27, output: 0.27 },
    default:                                  { input: 0.5,  output: 0.75 },
  },

  replicate: {
    default:                             { input: 0.65, output: 2.75 },
  },

  huggingface: {
    default:                             { input: 0.1,  output: 0.1  },
  },

  ollama: {
    default:                             { input: 0,    output: 0    },
  },

  wavespeedai: {
    default:                             { input: 0.5,  output: 1.5  },
  },

  inference: {
    default:                             { input: 0.4,  output: 1.2  },
  },

  anyscale: {
    default:                             { input: 0.5,  output: 1.5  },
  },

  modal: {
    default:                             { input: 0.6,  output: 1.8  },
  },

  voyage: {
    'voyage-3':                          { input: 0.06, output: 0    },
    'voyage-3-lite':                     { input: 0.02, output: 0    },
    'voyage-code-3':                     { input: 0.06, output: 0    },
    default:                             { input: 0.06, output: 0    },
  },

  jina: {
    default:                             { input: 0.02, output: 0    },
  },

  nomic: {
    default:                             { input: 0.1,  output: 0    },
  },

  portkey: {
    default:                             { input: 1,    output: 3    },
  },

  cloudflare: {
    default:                             { input: 0.11, output: 0.11 },
  },

  bifrost: {
    default:                             { input: 1,    output: 3    },
  },

  // Pollinations — prices in $/1M tokens (1 pollen = $1)
  pollinations: {
    'flux':                              { input: 0,      output: 0      }, // free image
    'openai':                            { input: 0.2,    output: 1.25   }, // GPT-5.4 Nano
    'openai-fast':                       { input: 0.05,   output: 0.4    }, // GPT-5 Nano
    'openai-large':                      { input: 2.5,    output: 15     }, // GPT-5.4
    'openai-audio':                      { input: 0.6,    output: 2.4    }, // GPT Audio Mini
    'openai-audio-large':                { input: 2.5,    output: 10     }, // GPT Audio 1.5
    'gpt-5.5':                           { input: 5,      output: 30     },
    'claude':                            { input: 3.3,    output: 16.5   }, // Claude Sonnet 4.6
    'claude-fast':                       { input: 1.11,   output: 5.5    }, // Claude Haiku 4.5
    'claude-large':                      { input: 5.5,    output: 27.5   }, // Claude Opus 4.6
    'claude-opus-4.7':                   { input: 5.5,    output: 27.5   },
    'gemini':                            { input: 0.75,   output: 4.5    }, // Gemini 3 Flash
    'gemini-fast':                       { input: 0.3,    output: 1.2    }, // Gemini 2.5 Flash Lite
    'gemini-search':                     { input: 0.3,    output: 1.2    },
    'gemini-large':                      { input: 3,      output: 18     }, // Gemini 3.1 Pro
    'gemini-flash-lite-3.1':             { input: 0.38,   output: 2.25   },
    'llama':                             { input: 0.71,   output: 0.71   }, // Llama 3.3 70B
    'llama-scout':                       { input: 0.16,   output: 0.64   }, // Llama 4 Scout
    'llama-maverick':                    { input: 0.25,   output: 1      }, // Llama 4 Maverick
    'mistral':                           { input: 0.1,    output: 0.3    }, // Mistral Small 3.1
    'mistral-large':                     { input: 0.5,    output: 1.5    }, // Mistral Large 3
    'deepseek':                          { input: 0.15,   output: 0.29   }, // DeepSeek V4 Flash
    'deepseek-pro':                      { input: 1.74,   output: 3.48   }, // DeepSeek V4 Pro
    'perplexity-fast':                   { input: 1,      output: 1      }, // Perplexity Sonar
    'perplexity-reasoning':              { input: 2,      output: 8      },
    'qwen-coder':                        { input: 0.06,   output: 0.22   }, // Qwen3 Coder 30B
    'qwen-coder-large':                  { input: 0.45,   output: 2.25   },
    'qwen-vision':                       { input: 0.15,   output: 0.6    },
    'qwen-large':                        { input: 0.5,    output: 3      }, // Qwen3.6 Plus
    'qwen-safety':                       { input: 0.01,   output: 0.01   },
    'grok':                              { input: 2,      output: 6      }, // Grok 4.20
    'grok-large':                        { input: 2,      output: 6      }, // Grok 4.20 Reasoning
    'kimi':                              { input: 0.6,    output: 3      }, // Kimi K2.5
    'kimi-k2.6':                         { input: 0.95,   output: 4      },
    'nova-fast':                         { input: 0.04,   output: 0.15   }, // Nova Micro
    'nova':                              { input: 0.33,   output: 2.75   }, // Nova 2 Lite
    'minimax':                           { input: 0.3,    output: 1.2    },
    'glm':                               { input: 1,      output: 3.2    },
    'midijourney':                       { input: 1.11,   output: 5.5    },
    'midijourney-large':                 { input: 5.5,    output: 27.5   },
    default:                             { input: 0.2,    output: 1.25   },
  },

  custom: {
    default:                             { input: 0,    output: 0    },
  },

  ibm: {
    default:                             { input: 1,    output: 3    },
  },

  qwen: {
    'qwen-max':                          { input: 1.6,  output: 6.4  },
    'qwen-plus':                         { input: 0.4,  output: 1.2  },
    'qwen-turbo':                        { input: 0.05, output: 0.2  },
    'qwen2.5-72b-instruct':              { input: 0.57, output: 0.57 },
    default:                             { input: 0.4,  output: 1.2  },
  },
};

export function calculateCost(provider, model, inputTokens, outputTokens) {
  const providerPricing = PROVIDER_PRICING[provider];
  if (!providerPricing) return 0;

  const pricing = providerPricing[model] || providerPricing['default'];
  if (!pricing) return 0;

  return (inputTokens * pricing.input) / 1_000_000 + (outputTokens * pricing.output) / 1_000_000;
}

export function getProviderPricing(provider, model) {
  const providerPricing = PROVIDER_PRICING[provider];
  if (!providerPricing) return null;
  return providerPricing[model] || providerPricing['default'] || null;
}
