import { Client, Databases, Permission, Role } from 'node-appwrite';

const DB_ID = process.env.APPWRITE_DATABASE_ID || 'byok_db';

function getDb() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');
  return new Databases(client);
}

const PERMS = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any()),
];

async function ensureCollection(db, id, name, attributes) {
  const results = { collection: null, attributes: [] };

  try {
    await db.createCollection(DB_ID, id, name, PERMS);
    results.collection = 'created';
  } catch (e) {
    results.collection = e.code === 409 ? 'already_exists' : `error: ${e.message}`;
  }

  for (const attr of attributes) {
    try {
      if (attr.type === 'string') {
        await db.createStringAttribute(DB_ID, id, attr.key, attr.size || 255, !!attr.required, attr.default ?? null);
      } else if (attr.type === 'boolean') {
        await db.createBooleanAttribute(DB_ID, id, attr.key, !!attr.required, attr.default ?? null);
      } else if (attr.type === 'double') {
        await db.createFloatAttribute(DB_ID, id, attr.key, !!attr.required, undefined, undefined, attr.default ?? null);
      } else if (attr.type === 'integer') {
        await db.createIntegerAttribute(DB_ID, id, attr.key, !!attr.required, undefined, undefined, attr.default ?? null);
      } else if (attr.type === 'datetime') {
        await db.createDatetimeAttribute(DB_ID, id, attr.key, !!attr.required);
      }
      results.attributes.push({ key: attr.key, status: 'created' });
    } catch (e) {
      results.attributes.push({ key: attr.key, status: e.code === 409 ? 'already_exists' : `error: ${e.message}` });
    }
    // Appwrite needs a moment between attribute creations
    await new Promise((r) => setTimeout(r, 300));
  }

  return results;
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Protect with INIT_SECRET env var (or fall back to ENCRYPTION_KEY)
  const secret = req.headers['x-init-secret'] || req.query.secret;
  const expected = process.env.INIT_SECRET || process.env.ENCRYPTION_KEY;

  if (!expected || secret !== expected) {
    return res.status(401).json({ error: 'Unauthorized. Set X-Init-Secret header or ?secret= query param matching your INIT_SECRET env var.' });
  }

  const db = getDb();
  const log = [];

  // 1. Ensure database exists
  try {
    await db.create(DB_ID, 'BYOK Database');
    log.push({ step: 'database', status: 'created' });
  } catch (e) {
    log.push({ step: 'database', status: e.code === 409 ? 'already_exists' : `error: ${e.message}` });
  }

  // 2. Collections
  const collections = [
    {
      id: 'api_keys',
      name: 'API Keys',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'provider', type: 'string', size: 100, required: true },
        { key: 'displayName', type: 'string', size: 255, required: true },
        { key: 'encryptedKey', type: 'string', size: 1024, required: true },
        { key: 'isActive', type: 'boolean', required: false, default: true },
        { key: 'monthlyBudget', type: 'double', required: false },
        { key: 'lastUsed', type: 'datetime', required: false },
        { key: 'monthlyUsage', type: 'double', required: false, default: 0 },
        { key: 'monthlyCost', type: 'double', required: false, default: 0 },
      ],
    },
    {
      id: 'routing_rules',
      name: 'Routing Rules',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'condition', type: 'string', size: 100, required: true },
        { key: 'conditionValue', type: 'string', size: 255, required: false, default: '' },
        { key: 'targetProvider', type: 'string', size: 100, required: true },
        { key: 'fallbackProvider', type: 'string', size: 100, required: false, default: '' },
        { key: 'priority', type: 'integer', required: false, default: 0 },
        { key: 'isActive', type: 'boolean', required: false, default: true },
      ],
    },
    {
      id: 'request_logs',
      name: 'Request Logs',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'model', type: 'string', size: 255, required: true },
        { key: 'provider', type: 'string', size: 100, required: true },
        { key: 'tokensInput', type: 'integer', required: false, default: 0 },
        { key: 'tokensOutput', type: 'integer', required: false, default: 0 },
        { key: 'tokensCached', type: 'integer', required: false, default: 0 },
        { key: 'estimatedCost', type: 'double', required: false, default: 0 },
        { key: 'statusCode', type: 'integer', required: false, default: 200 },
        { key: 'timestamp', type: 'datetime', required: false },
      ],
    },
    {
      id: 'gateway_keys',
      name: 'Gateway Keys',
      attributes: [
        { key: 'userId', type: 'string', size: 255, required: true },
        { key: 'displayName', type: 'string', size: 255, required: true },
        { key: 'hashedKey', type: 'string', size: 1024, required: true },
        { key: 'isActive', type: 'boolean', required: false, default: true },
        { key: 'lastUsed', type: 'datetime', required: false },
      ],
    },
  ];

  for (const col of collections) {
    const result = await ensureCollection(db, col.id, col.name, col.attributes);
    log.push({ collection: col.id, ...result });
  }

  const hasErrors = log.some((entry) =>
    entry.status?.startsWith('error') ||
    entry.attributes?.some((a) => a.status?.startsWith('error'))
  );

  return res.status(hasErrors ? 207 : 200).json({
    success: !hasErrors,
    message: hasErrors
      ? 'Completed with some errors — check log for details'
      : 'All collections initialized successfully',
    log,
  });
}
