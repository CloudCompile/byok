import { calculateCost } from '../lib/cost';

export const config = {
  name: 'ibm',
  displayName: 'IBM watsonx',
  baseUrl: 'https://us-south.ml.cloud.ibm.com',
  models: [
    'ibm/granite-13b-chat-v2',
    'ibm/granite-34b-code-instruct',
    'meta-llama/llama-3-1-70b-instruct',
    'mistralai/mistral-large',
  ],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: "apiKey:projectId" or JSON
  let ibmApiKey, projectId, region = 'us-south';
  try {
    const parsed = JSON.parse(apiKey);
    ibmApiKey = parsed.apiKey;
    projectId = parsed.projectId;
    region = parsed.region || 'us-south';
  } catch {
    const parts = apiKey.split(':');
    ibmApiKey = parts[0];
    projectId = parts[1];
  }

  // Get IAM token
  const iamRes = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${ibmApiKey}`,
  });
  if (!iamRes.ok) throw new Error('IBM IAM token fetch failed');
  const { access_token } = await iamRes.json();

  const { model, messages, temperature, max_tokens } = openaiRequest;
  const prompt = messages.map((m) => `${m.role}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`).join('\n') + '\nassistant:';

  const response = await fetch(`https://${region}.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: model,
      input: prompt,
      project_id: projectId,
      parameters: {
        ...(temperature !== undefined && { temperature }),
        ...(max_tokens && { max_new_tokens: max_tokens }),
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`IBM watsonx error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.results?.[0]?.generated_text || '';
  const inputTokens = data.results?.[0]?.input_token_count || 0;
  const outputTokens = data.results?.[0]?.generated_token_count || 0;

  return {
    id: `ibm-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
    usage: { prompt_tokens: inputTokens, completion_tokens: outputTokens, total_tokens: inputTokens + outputTokens },
    _metadata: { provider: config.name, cost: 0 },
  };
}
