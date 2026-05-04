import { verifyToken, extractBearerToken, hashKey } from '../../lib/auth';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = extractBearerToken(req);
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { userId } = user;

  if (req.method === 'GET') {
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.GATEWAY_KEYS, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ]);
    return res.status(200).json({ keys: result.documents.map(({ hashedKey, ...rest }) => rest) });
  }

  if (req.method === 'POST') {
    const { displayName } = req.body;
    if (!displayName) return res.status(400).json({ error: 'displayName is required' });

    const secret = crypto.randomBytes(32).toString('base64url');
    const hashedKey = await hashKey(secret);

    const doc = await databases.createDocument(DB_ID, COLLECTIONS.GATEWAY_KEYS, 'unique()', {
      userId,
      displayName,
      hashedKey,
      isActive: true,
    });

    // Return the full key only once
    const fullKey = `byok_${doc.$id}_${secret}`;
    return res.status(201).json({ key: { ...doc, hashedKey: undefined }, fullKey });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const existing = await databases.getDocument(DB_ID, COLLECTIONS.GATEWAY_KEYS, id);
    if (existing.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
    await databases.updateDocument(DB_ID, COLLECTIONS.GATEWAY_KEYS, id, { isActive: false });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
