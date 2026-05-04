import { verifyToken, extractBearerToken } from '../../lib/auth';
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
    const result = await databases.listDocuments(DB_ID, COLLECTIONS.ROUTING_RULES, [
      Query.equal('userId', userId),
      Query.orderDesc('priority'),
      Query.limit(100),
    ]);
    return res.status(200).json({ rules: result.documents });
  }

  if (req.method === 'POST') {
    const { name, condition, conditionValue, targetProvider, fallbackProvider, priority } = req.body;
    if (!name || !condition || !targetProvider) {
      return res.status(400).json({ error: 'name, condition, and targetProvider are required' });
    }
    const doc = await databases.createDocument(DB_ID, COLLECTIONS.ROUTING_RULES, 'unique()', {
      userId,
      name,
      condition,
      conditionValue: conditionValue || '',
      targetProvider,
      fallbackProvider: fallbackProvider || '',
      priority: priority || 0,
      isActive: true,
    });
    return res.status(201).json({ rule: doc });
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const existing = await databases.getDocument(DB_ID, COLLECTIONS.ROUTING_RULES, id);
    if (existing.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
    const doc = await databases.updateDocument(DB_ID, COLLECTIONS.ROUTING_RULES, id, updates);
    return res.status(200).json({ rule: doc });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const existing = await databases.getDocument(DB_ID, COLLECTIONS.ROUTING_RULES, id);
    if (existing.userId !== userId) return res.status(403).json({ error: 'Forbidden' });
    await databases.deleteDocument(DB_ID, COLLECTIONS.ROUTING_RULES, id);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
