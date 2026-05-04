import { calculateCost } from '../lib/cost';

export const config = {
  name: 'elevenlabs',
  displayName: 'ElevenLabs',
  baseUrl: 'https://api.elevenlabs.io/v1',
  models: ['eleven_multilingual_v2', 'eleven_monolingual_v1', 'eleven_turbo_v2'],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  const { model, messages } = openaiRequest;
  const lastMsg = messages[messages.length - 1];
  const text = typeof lastMsg?.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg?.content);

  const voiceId = 'pNInz6obpgDQGcFmaJgB'; // Default voice (Adam)
  const modelId = model || 'eleven_multilingual_v2';

  const response = await fetch(`${config.baseUrl}/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.5 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ElevenLabs error ${response.status}: ${err}`);
  }

  const audioBuffer = await response.arrayBuffer();
  const audioB64 = Buffer.from(audioBuffer).toString('base64');

  return {
    id: `elevenlabs-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content: `data:audio/mpeg;base64,${audioB64}` },
        finish_reason: 'stop',
      },
    ],
    usage: { prompt_tokens: text.length, completion_tokens: 0, total_tokens: text.length },
    _metadata: { provider: config.name, cost: (text.length / 1000) * 0.0003, audioBase64: audioB64 },
  };
}
