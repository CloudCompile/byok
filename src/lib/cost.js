// Per-1M-token pricing: { input, output, cached_input? }
// Image models: { type: 'image', cost_per_image }
// Sources: official provider pricing pages (May 2026)
export const PROVIDER_PRICING = {
  anthropic: {
    // Claude 4.x — cached_input = 10% of input
    'claude-opus-4-7':                   { input: 5,    output: 25,   cached_input: 0.5   },
    'claude-opus-4-6':                   { input: 5,    output: 25,   cached_input: 0.5   },
    'claude-opus-4-5':                   { input: 5,    output: 25,   cached_input: 0.5   },
    'claude-opus-4-1':                   { input: 15,   output: 75,   cached_input: 1.5   },
    'claude-opus-4':                     { input: 15,   output: 75,   cached_input: 1.5   },
    'claude-sonnet-4-6':                 { input: 3,    output: 15,   cached_input: 0.3   },
    'claude-sonnet-4-5':                 { input: 3,    output: 15,   cached_input: 0.3   },
    'claude-sonnet-4':                   { input: 3,    output: 15,   cached_input: 0.3   },
    'claude-haiku-4-5':                  { input: 1,    output: 5,    cached_input: 0.1   },
    // Claude 3.x (versioned IDs)
    'claude-3-5-sonnet-20241022':        { input: 3,    output: 15,   cached_input: 0.3   },
    'claude-3-5-sonnet-20240620':        { input: 3,    output: 15,   cached_input: 0.3   },
    'claude-3-5-haiku-20241022':         { input: 0.8,  output: 4,    cached_input: 0.08  },
    'claude-3-haiku-20240307':           { input: 0.25, output: 1.25, cached_input: 0.03  },
    'claude-3-opus-20240229':            { input: 15,   output: 75,   cached_input: 1.5   },
    'claude-3-sonnet-20240229':          { input: 3,    output: 15,   cached_input: 0.3   },
    'claude-haiku-4-5-20251001':         { input: 1,    output: 5,    cached_input: 0.1   },
    default:                             { input: 3,    output: 15,   cached_input: 0.3   },
  },

  openai: {
    // GPT-5.x family — cached_input = 50% of input
    'gpt-5.5':                           { input: 5,    output: 30,   cached_input: 2.5    },
    'gpt-5.5-pro':                       { input: 30,   output: 180,  cached_input: 15     },
    'gpt-5.4':                           { input: 2.5,  output: 15,   cached_input: 1.25   },
    'gpt-5.4-mini':                      { input: 0.75, output: 4.5,  cached_input: 0.375  },
    'gpt-5.4-nano':                      { input: 0.2,  output: 1.25, cached_input: 0.1    },
    'gpt-5.4-pro':                       { input: 30,   output: 180,  cached_input: 15     },
    'gpt-5.2':                           { input: 1.75, output: 14,   cached_input: 0.875  },
    'gpt-5.2-pro':                       { input: 21,   output: 168,  cached_input: 10.5   },
    'gpt-5.1':                           { input: 1.25, output: 10,   cached_input: 0.625  },
    'gpt-5':                             { input: 1.25, output: 10,   cached_input: 0.625  },
    'gpt-5-mini':                        { input: 0.25, output: 2,    cached_input: 0.125  },
    'gpt-5-nano':                        { input: 0.05, output: 0.4,  cached_input: 0.025  },
    'gpt-5-pro':                         { input: 15,   output: 120,  cached_input: 7.5    },
    // GPT-4.x family
    'gpt-4.1':                           { input: 2,    output: 8,    cached_input: 1      },
    'gpt-4.1-mini':                      { input: 0.4,  output: 1.6,  cached_input: 0.2    },
    'gpt-4.1-nano':                      { input: 0.1,  output: 0.4,  cached_input: 0.05   },
    'gpt-4o':                            { input: 2.5,  output: 10,   cached_input: 1.25   },
    'gpt-4o-2024-05-13':                 { input: 5,    output: 15,   cached_input: 2.5    },
    'gpt-4o-mini':                       { input: 0.15, output: 0.6,  cached_input: 0.075  },
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

  vertexai: {
    default:                             { input: 1.25, output: 5    },
  },

  deepinfra: {
    'meta-llama/Meta-Llama-3.1-70B-Instruct': { input: 0.52, output: 0.75 },
    'mistralai/Mixtral-8x7B-Instruct-v0.1':   { input: 0.27, output: 0.27 },
    default:                                  { input: 0.5,  output: 0.75 },
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

  // ElevenLabs — character-based TTS, hour-based STT, minute-based audio
  elevenlabs: {
    'eleven_flash_v2':                   { type: 'tts', cost_per_1k_chars: 0.05  },
    'eleven_flash_v2_5':                 { type: 'tts', cost_per_1k_chars: 0.05  },
    'eleven_turbo_v2':                   { type: 'tts', cost_per_1k_chars: 0.05  },
    'eleven_turbo_v2_5':                 { type: 'tts', cost_per_1k_chars: 0.05  },
    'eleven_multilingual_v2':            { type: 'tts', cost_per_1k_chars: 0.10  },
    'eleven_multilingual_v3':            { type: 'tts', cost_per_1k_chars: 0.10  },
    'scribe_v1':                         { type: 'stt', cost_per_hour: 0.22      },
    'scribe_v2':                         { type: 'stt', cost_per_hour: 0.22      },
    'scribe_v2_realtime':                { type: 'stt', cost_per_hour: 0.39      },
    'music_v1':                          { type: 'audio', cost_per_minute: 0.30  },
    'voice_isolator':                    { type: 'audio', cost_per_minute: 0.12  },
    'voice_changer':                     { type: 'audio', cost_per_minute: 0.12  },
    'sound_effects_v1':                  { type: 'audio', cost_per_minute: 0.12  },
    default:                             { type: 'tts', cost_per_1k_chars: 0.10  },
  },

  cloudflare: {
    // LLM models
    '@cf/meta/llama-3.2-1b-instruct':               { input: 0.027,  output: 0.201  },
    '@cf/meta/llama-3.2-3b-instruct':               { input: 0.051,  output: 0.335  },
    '@cf/meta/llama-3.1-8b-instruct-fp8-fast':      { input: 0.045,  output: 0.384  },
    '@cf/meta/llama-3.2-11b-vision-instruct':       { input: 0.049,  output: 0.676  },
    '@cf/meta/llama-3.1-70b-instruct-fp8-fast':     { input: 0.293,  output: 2.253  },
    '@cf/meta/llama-3.3-70b-instruct-fp8-fast':     { input: 0.293,  output: 2.253  },
    '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b': { input: 0.497,  output: 4.881  },
    '@cf/mistral/mistral-7b-instruct-v0.1':         { input: 0.110,  output: 0.190  },
    '@cf/mistralai/mistral-small-3.1-24b-instruct': { input: 0.351,  output: 0.555  },
    '@cf/meta/llama-3.1-8b-instruct':               { input: 0.282,  output: 0.827  },
    '@cf/meta/llama-3-8b-instruct':                 { input: 0.282,  output: 0.827  },
    '@cf/meta/llama-4-scout-17b-16e-instruct':      { input: 0.270,  output: 0.850  },
    '@cf/google/gemma-3-12b-it':                    { input: 0.345,  output: 0.556  },
    '@cf/qwen/qwq-32b':                             { input: 0.660,  output: 1.000  },
    '@cf/qwen/qwen2.5-coder-32b-instruct':          { input: 0.660,  output: 1.000  },
    '@cf/qwen/qwen3-30b-a3b-fp8':                   { input: 0.051,  output: 0.335  },
    '@cf/openai/gpt-oss-120b':                      { input: 0.350,  output: 0.750  },
    '@cf/openai/gpt-oss-20b':                       { input: 0.200,  output: 0.300  },
    '@cf/google/gemma-4-26b-a4b-it':               { input: 0.100,  output: 0.300  },
    '@cf/moonshotai/kimi-k2.5':                     { input: 0.600,  output: 3.000, cached_input: 0.100 },
    '@cf/moonshotai/kimi-k2.6':                     { input: 0.950,  output: 4.000, cached_input: 0.160 },
    '@cf/ibm-granite/granite-4.0-h-micro':          { input: 0.017,  output: 0.112  },
    '@cf/nvidia/nemotron-3-120b-a12b':              { input: 0.500,  output: 1.500  },
    // Embeddings
    '@cf/baai/bge-small-en-v1.5':                   { input: 0.020,  output: 0      },
    '@cf/baai/bge-base-en-v1.5':                    { input: 0.067,  output: 0      },
    '@cf/baai/bge-large-en-v1.5':                   { input: 0.204,  output: 0      },
    '@cf/baai/bge-m3':                              { input: 0.012,  output: 0      },
    '@cf/qwen/qwen3-embedding-0.6b':                { input: 0.012,  output: 0      },
    // Image generation
    '@cf/black-forest-labs/flux-1-schnell':         { type: 'image', cost_per_image: 0.003  },
    '@cf/black-forest-labs/flux-2-klein-9b':        { type: 'image', cost_per_image: 0.015  },
    // Audio
    '@cf/openai/whisper':                           { type: 'stt',   cost_per_hour: 0.03   },
    '@cf/openai/whisper-large-v3-turbo':            { type: 'stt',   cost_per_hour: 0.03   },
    '@cf/deepgram/aura-2-en':                       { type: 'tts',   cost_per_1k_chars: 0.03 },
    '@cf/deepgram/nova-3':                          { type: 'stt',   cost_per_hour: 0.312  },
    default:                                        { input: 0.11,   output: 0.11   },
  },

  stability: {
    'stable-diffusion-xl-1024-v1-0':    { type: 'image', cost_per_image: 0.065  },
    'sd3-medium':                        { type: 'image', cost_per_image: 0.035  },
    'sd3-large':                         { type: 'image', cost_per_image: 0.065  },
    'sd3-large-turbo':                   { type: 'image', cost_per_image: 0.04   },
    'stable-image-core':                 { type: 'image', cost_per_image: 0.03   },
    'stable-image-ultra':                { type: 'image', cost_per_image: 0.08   },
    default:                             { type: 'image', cost_per_image: 0.065  },
  },

  // Pollinations — text models in $/1M tokens, image models per image
  pollinations: {
    // Image generation models
    'flux':                              { type: 'image', cost_per_image: 0      }, // free
    'flux-pro':                          { type: 'image', cost_per_image: 0.005  },
    'flux-realism':                      { type: 'image', cost_per_image: 0.002  },
    'flux-anime':                        { type: 'image', cost_per_image: 0.001  },
    'flux-3d':                           { type: 'image', cost_per_image: 0.001  },
    'turbo':                             { type: 'image', cost_per_image: 0      }, // Flux Schnell, free
    'gptimage':                          { type: 'image', cost_per_image: 0.04   }, // DALL-E 3
    // Text/LLM models
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

function normalizeModel(model) {
  return model.toLowerCase().trim();
}

export function calculateCost(provider, model, inputTokens, outputTokens, cachedTokens = 0) {
  const providerPricing = PROVIDER_PRICING[provider];
  if (!providerPricing) {
    console.warn(`Unknown provider: ${provider}`);
    return 0;
  }

  const normalizedModel = normalizeModel(model);
  const pricing = providerPricing[normalizedModel] || providerPricing['default'];

  if (!pricing) {
    console.warn(`Unknown model: ${provider}/${model}`);
    return 0;
  }

  if (pricing.type === 'image') {
    return Number((pricing.cost_per_image || 0).toFixed(6));
  }

  if (pricing.type === 'tts') {
    // Adapter should set _metadata.cost directly with actual char count; this is a fallback
    return Number((pricing.cost_per_1k_chars || 0).toFixed(6));
  }

  if (pricing.type === 'stt' || pricing.type === 'audio') {
    return Number((pricing.cost_per_hour || pricing.cost_per_minute || 0).toFixed(6));
  }

  const uncached = Math.max(0, inputTokens - cachedTokens);
  const total =
    (uncached * pricing.input) / 1_000_000 +
    (cachedTokens * (pricing.cached_input ?? pricing.input)) / 1_000_000 +
    (outputTokens * pricing.output) / 1_000_000;
  return Number(total.toFixed(6));
}

export function getProviderPricing(provider, model) {
  const providerPricing = PROVIDER_PRICING[provider];
  if (!providerPricing) return null;

  const normalizedModel = normalizeModel(model);
  return providerPricing[normalizedModel] || providerPricing['default'] || null;
}
