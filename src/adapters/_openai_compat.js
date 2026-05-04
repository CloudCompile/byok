// Base factory for OpenAI-compatible providers
import { calculateCost } from '../lib/cost';

export function createOpenAICompatAdapter({ name, displayName, baseUrl, models, authHeader }) {
  return {
    config: { name, displayName, baseUrl, models, openaiCompatible: true },
    async translate(openaiRequest, apiKey) {
      const headers = {
        'Content-Type': 'application/json',
        ...(authHeader ? authHeader(apiKey) : { Authorization: `Bearer ${apiKey}` }),
      };

      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(openaiRequest),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`${name} error ${response.status}: ${err}`);
      }

      if (openaiRequest.stream) {
        return { stream: true, body: response.body, provider: name };
      }

      const data = await response.json();
      const inputTokens = data.usage?.prompt_tokens || 0;
      const outputTokens = data.usage?.completion_tokens || 0;

      return {
        ...data,
        _metadata: {
          provider: name,
          cost: calculateCost(name, openaiRequest.model, inputTokens, outputTokens),
        },
      };
    },
  };
}
