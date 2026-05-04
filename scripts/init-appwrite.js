#!/usr/bin/env node
/**
 * Initialize Appwrite collections for BYOK Gateway
 * Run: node scripts/init-appwrite.js
 */

const { Client, Databases, Permission, Role, ID } = require('node-appwrite');

require('dotenv').config({ path: '.env.local' });

const client = new Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = process.env.APPWRITE_DATABASE_ID || 'byok_db';

async function main() {
  console.log('Initializing Appwrite database...');

  // Create database
  try {
    await db.create(DB_ID, 'BYOK Database');
    console.log('✓ Database created');
  } catch (e) {
    if (e.code === 409) console.log('✓ Database already exists');
    else throw e;
  }

  const perms = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any()),
  ];

  // api_keys collection
  await createCollection('api_keys', 'API Keys', [
    { key: 'userId', type: 'string', size: 255, required: true },
    { key: 'provider', type: 'string', size: 100, required: true },
    { key: 'displayName', type: 'string', size: 255, required: true },
    { key: 'encryptedKey', type: 'string', size: 1024, required: true },
    { key: 'isActive', type: 'boolean', required: false, default: true },
    { key: 'monthlyBudget', type: 'double', required: false },
    { key: 'lastUsed', type: 'datetime', required: false },
    { key: 'monthlyUsage', type: 'double', required: false, default: 0 },
    { key: 'monthlyCost', type: 'double', required: false, default: 0 },
  ]);

  // routing_rules collection
  await createCollection('routing_rules', 'Routing Rules', [
    { key: 'userId', type: 'string', size: 255, required: true },
    { key: 'name', type: 'string', size: 255, required: true },
    { key: 'condition', type: 'string', size: 100, required: true },
    { key: 'conditionValue', type: 'string', size: 255, required: false, default: '' },
    { key: 'targetProvider', type: 'string', size: 100, required: true },
    { key: 'fallbackProvider', type: 'string', size: 100, required: false, default: '' },
    { key: 'priority', type: 'integer', required: false, default: 0 },
    { key: 'isActive', type: 'boolean', required: false, default: true },
  ]);

  // request_logs collection
  await createCollection('request_logs', 'Request Logs', [
    { key: 'userId', type: 'string', size: 255, required: true },
    { key: 'model', type: 'string', size: 255, required: true },
    { key: 'provider', type: 'string', size: 100, required: true },
    { key: 'tokensInput', type: 'integer', required: false, default: 0 },
    { key: 'tokensOutput', type: 'integer', required: false, default: 0 },
    { key: 'estimatedCost', type: 'double', required: false, default: 0 },
    { key: 'statusCode', type: 'integer', required: false, default: 200 },
    { key: 'timestamp', type: 'datetime', required: false },
  ]);

  // gateway_keys collection
  await createCollection('gateway_keys', 'Gateway Keys', [
    { key: 'userId', type: 'string', size: 255, required: true },
    { key: 'displayName', type: 'string', size: 255, required: true },
    { key: 'hashedKey', type: 'string', size: 1024, required: true },
    { key: 'isActive', type: 'boolean', required: false, default: true },
    { key: 'lastUsed', type: 'datetime', required: false },
  ]);

  console.log('\n✅ All collections initialized!');
}

async function createCollection(id, name, attributes) {
  try {
    await db.createCollection(DB_ID, id, name, [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any()),
    ]);
    console.log(`✓ Collection '${id}' created`);
  } catch (e) {
    if (e.code === 409) console.log(`✓ Collection '${id}' already exists`);
    else throw e;
  }

  for (const attr of attributes) {
    await createAttribute(id, attr);
  }
}

async function createAttribute(collectionId, attr) {
  try {
    if (attr.type === 'string') {
      await db.createStringAttribute(DB_ID, collectionId, attr.key, attr.size || 255, !!attr.required, attr.default);
    } else if (attr.type === 'boolean') {
      await db.createBooleanAttribute(DB_ID, collectionId, attr.key, !!attr.required, attr.default);
    } else if (attr.type === 'double') {
      await db.createFloatAttribute(DB_ID, collectionId, attr.key, !!attr.required, undefined, undefined, attr.default);
    } else if (attr.type === 'integer') {
      await db.createIntegerAttribute(DB_ID, collectionId, attr.key, !!attr.required, undefined, undefined, attr.default);
    } else if (attr.type === 'datetime') {
      await db.createDatetimeAttribute(DB_ID, collectionId, attr.key, !!attr.required);
    }
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 200));
    process.stdout.write('.');
  } catch (e) {
    if (e.code === 409) {
      process.stdout.write('-');
    } else {
      console.error(`\nFailed to create attribute ${attr.key}:`, e.message);
    }
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
