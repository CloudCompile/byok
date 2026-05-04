import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { databases, DB_ID, COLLECTIONS, Query } from './appwrite';

const JWT_SECRET = process.env.JWT_SECRET || 'insecure-dev-secret-change-in-production';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function hashKey(key) {
  return bcrypt.hash(key, 12);
}

export async function compareKey(key, hash) {
  return bcrypt.compare(key, hash);
}

export async function verifyGatewayKey(rawKey) {
  if (!rawKey) return null;

  try {
    // Gateway keys are prefixed: byok_<keyId>_<secret>
    const parts = rawKey.split('_');
    if (parts.length < 3 || parts[0] !== 'byok') return null;

    const keyId = parts[1];

    const doc = await databases.getDocument(DB_ID, COLLECTIONS.GATEWAY_KEYS, keyId);

    if (!doc || !doc.isActive) return null;

    const secret = parts.slice(2).join('_');
    const valid = await compareKey(secret, doc.hashedKey);

    if (!valid) return null;

    // Update lastUsed
    await databases.updateDocument(DB_ID, COLLECTIONS.GATEWAY_KEYS, keyId, {
      lastUsed: new Date().toISOString(),
    }).catch(() => {});

    return { userId: doc.userId, keyId };
  } catch {
    return null;
  }
}

export function extractBearerToken(req) {
  const auth = req.headers.authorization || req.headers['x-api-key'];
  if (!auth) return null;
  return auth.startsWith('Bearer ') ? auth.slice(7) : auth;
}
