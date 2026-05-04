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
  const { days = 30, limit = 200 } = req.query;

  const since = new Date();
  since.setDate(since.getDate() - parseInt(days));

  const result = await databases.listDocuments(DB_ID, COLLECTIONS.REQUEST_LOGS, [
    Query.equal('userId', userId),
    Query.greaterThanEqual('timestamp', since.toISOString()),
    Query.orderDesc('timestamp'),
    Query.limit(parseInt(limit)),
  ]);

  const logs = result.documents;

  // Aggregate stats
  const totalRequests = logs.length;
  const totalTokens = logs.reduce((s, l) => s + (l.tokensInput || 0) + (l.tokensOutput || 0), 0);
  const totalCost = logs.reduce((s, l) => s + (l.estimatedCost || 0), 0);

  // By provider
  const byProvider = {};
  const byModel = {};
  const byDay = {};

  for (const log of logs) {
    // Provider breakdown
    if (!byProvider[log.provider]) byProvider[log.provider] = { requests: 0, tokens: 0, cost: 0 };
    byProvider[log.provider].requests++;
    byProvider[log.provider].tokens += (log.tokensInput || 0) + (log.tokensOutput || 0);
    byProvider[log.provider].cost += log.estimatedCost || 0;

    // Model breakdown
    if (!byModel[log.model]) byModel[log.model] = { requests: 0, tokens: 0, cost: 0 };
    byModel[log.model].requests++;
    byModel[log.model].tokens += (log.tokensInput || 0) + (log.tokensOutput || 0);
    byModel[log.model].cost += log.estimatedCost || 0;

    // Daily
    const day = log.timestamp?.slice(0, 10) || 'unknown';
    if (!byDay[day]) byDay[day] = { requests: 0, tokens: 0, cost: 0 };
    byDay[day].requests++;
    byDay[day].tokens += (log.tokensInput || 0) + (log.tokensOutput || 0);
    byDay[day].cost += log.estimatedCost || 0;
  }

  // Format daily data as sorted array
  const dailyData = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({ date, ...stats }));

  return res.status(200).json({
    summary: {
      totalRequests,
      totalTokens,
      totalCost: parseFloat(totalCost.toFixed(6)),
      period: `${days} days`,
    },
    byProvider: Object.entries(byProvider).map(([provider, stats]) => ({ provider, ...stats })),
    byModel: Object.entries(byModel).map(([model, stats]) => ({ model, ...stats })),
    dailyData,
    recentLogs: logs.slice(0, 50),
  });
}
