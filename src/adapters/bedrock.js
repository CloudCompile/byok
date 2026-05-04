import { calculateCost } from '../lib/cost';

export const config = {
  name: 'bedrock',
  displayName: 'AWS Bedrock',
  baseUrl: null,
  models: [
    'anthropic.claude-3-5-sonnet-20241022-v2:0',
    'anthropic.claude-3-haiku-20240307-v1:0',
    'meta.llama3-1-70b-instruct-v1:0',
    'amazon.titan-text-premier-v1:0',
    'mistral.mixtral-8x7b-instruct-v0:1',
  ],
  openaiCompatible: false,
};

export async function translate(openaiRequest, apiKey) {
  // apiKey format: "accessKeyId:secretAccessKey:region" or JSON
  let credentials;
  try {
    credentials = JSON.parse(apiKey);
  } catch {
    const parts = apiKey.split(':');
    credentials = {
      accessKeyId: parts[0],
      secretAccessKey: parts.slice(1, -1).join(':'),
      region: parts[parts.length - 1] || 'us-east-1',
    };
  }

  const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');

  const client = new BedrockRuntimeClient({
    region: credentials.region || 'us-east-1',
    credentials: {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      ...(credentials.sessionToken && { sessionToken: credentials.sessionToken }),
    },
  });

  const { model, messages, max_tokens, temperature } = openaiRequest;

  // Use Anthropic format for claude models, otherwise converse API
  const isAnthropic = model.startsWith('anthropic.');
  let body;

  if (isAnthropic) {
    const systemMsg = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');
    body = {
      anthropic_version: 'bedrock-2023-05-31',
      messages: userMessages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: max_tokens || 4096,
      ...(systemMsg && { system: systemMsg.content }),
      ...(temperature !== undefined && { temperature }),
    };
  } else {
    body = {
      inputText: messages.map((m) => `${m.role}: ${m.content}`).join('\n'),
      textGenerationConfig: {
        maxTokenCount: max_tokens || 2048,
        ...(temperature !== undefined && { temperature }),
      },
    };
  }

  const command = new InvokeModelCommand({
    modelId: model,
    body: JSON.stringify(body),
    contentType: 'application/json',
    accept: 'application/json',
  });

  const response = await client.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));

  let content = '';
  let inputTokens = 0;
  let outputTokens = 0;

  if (isAnthropic) {
    content = responseBody.content?.[0]?.text || '';
    inputTokens = responseBody.usage?.input_tokens || 0;
    outputTokens = responseBody.usage?.output_tokens || 0;
  } else {
    content = responseBody.results?.[0]?.outputText || responseBody.outputText || '';
    inputTokens = responseBody.inputTextTokenCount || 0;
    outputTokens = responseBody.results?.[0]?.tokenCount || 0;
  }

  return {
    id: `bedrock-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: 'assistant', content },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: inputTokens,
      completion_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
    },
    _metadata: { provider: config.name, cost: calculateCost(config.name, model, inputTokens, outputTokens) },
  };
}
