import { verifyGatewayKey, extractBearerToken } from '../../../../lib/auth';
import { databases, DB_ID, COLLECTIONS, Query } from '../../../../lib/appwrite';
import { routeRequest } from '../../../../lib/router';

export const config = { api: { bodyParser: true, responseLimit: false } };

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const token = extractBearerToken(req);
    const user = await verifyGatewayKey(token);

    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid or missing API key', type: 'authentication_error' } });
    }

    const [keysResult, rulesResult] = await Promise.all([
      databases.listDocuments(DB_ID, COLLECTIONS.API_KEYS, [
        Query.equal('userId', user.userId),
        Query.equal('isActive', true),
        Query.limit(100),
      ]),
      databases.listDocuments(DB_ID, COLLECTIONS.ROUTING_RULES, [
        Query.equal('userId', user.userId),
        Query.equal('isActive', true),
        Query.orderDesc('priority'),
        Query.limit(50),
      ]),
    ]);

    const userKeys = keysResult.documents;
    const userRules = rulesResult.documents;

    if (userKeys.length === 0) {
      return res.status(400).json({
        error: { message: 'No API keys configured. Add provider keys in the dashboard.', type: 'configuration_error' },
      });
    }

    const openaiRequest = req.body;

    if (!openaiRequest.messages || !Array.isArray(openaiRequest.messages)) {
      return res.status(400).json({
        error: { message: 'messages array is required', type: 'invalid_request_error' },
      });
    }

    const response = await routeRequest(openaiRequest, userKeys, userRules, user.userId);

    if (response.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } finally {
        res.end();
      }
      return;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Gateway error:', error);
    return res.status(500).json({
      error: { message: error.message || 'Internal gateway error', type: 'server_error' },
    });
  }
}
