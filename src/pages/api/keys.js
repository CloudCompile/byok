import { verifyToken, extractBearerToken } from '../../lib/auth';
import { encrypt, decrypt } from '../../lib/encryption';
import { databases, DB_ID, COLLECTIONS, Query } from '../../lib/appwrite';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = extractBearerToken(req);
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { userId } = user;

  if (req.method === 'GET') {
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.API_KEYS, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
      Query.limit(100),
    ]);
    // Never return the encrypted key
    const keys = result.documents.map(({ encryptedKey, ...rest }) => rest);
    return res.status(200).json({ keys });
  }

  if (req.method === 'POST') {
    const { provider, displayName, apiKey, monthlyBudget } = req.body;

    if (!provider || !displayName || !apiKey) {
      return res.status(400).json({ error: 'provider, displayName, and apiKey are required' });
    }

    const encryptedKey = encrypt(apiKey);

    const doc = await databases.createDocument(DB_ID, COLLECTIONS.API_KEYS, 'unique()', {
      userId,
      provider,
      displayName,
      encryptedKey,
      isActive: true,
      monthlyBudget: monthlyBudget || null,
      monthlyUsage: 0,
      monthlyCost: 0,
    });

    const { encryptedKey: _, ...safe } = doc;
    return res.status(201).json({ key: safe });
  }

  if (req.method === 'PUT') {
    const { id, displayName, isActive, monthlyBudget, apiKey } = req.body;
    if (!id) return res.status(400).json({ error: 'id is required' });

    const existing = await databases.getDocument(DB_ID, COLLECTIONS.API_KEYS, id);
    if (existing.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updates = {
      ...(displayName !== undefined && { displayName }),
      ...(isActive !== undefined && { isActive }),
      ...(monthlyBudget !== undefined && { monthlyBudget }),
      ...(apiKey && { encryptedKey: encrypt(apiKey) }),
    };

    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.API_KEYS, id, updates);
    const { encryptedKey: _, ...safe } = doc;
    return res.status(200).json({ key: safe });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });

    const existing = await databases.getDocument(DB_ID, COLLECTIONS.API_KEYS, id);
    if (existing.userId !== userId) return res.status(403).json({ error: 'Forbidden' });

    await databases.deleteDocument(DB_ID, COLLECTIONS.API_KEYS, id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
