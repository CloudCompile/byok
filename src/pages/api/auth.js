import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth';
import { databases, DB_ID, Query } from '../../lib/appwrite';

// Simple password-based auth for the dashboard
// Users collection is managed externally via Appwrite Auth or a simple users table
// For this implementation, we use a single-user setup with env vars

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { action, email, password, userId } = req.body;

  if (action === 'login') {
    // Single-user mode: compare against env vars
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@byok.app';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    const adminUserId = process.env.ADMIN_USER_ID || 'default-user';

    if (email !== adminEmail) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (adminPasswordHash) {
      const valid = await bcrypt.compare(password, adminPasswordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    } else if (password !== (process.env.ADMIN_PASSWORD || 'changeme')) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ userId: adminUserId, email });
    return res.status(200).json({ token, userId: adminUserId });
  }

  if (action === 'verify') {
    const { verifyToken } = await import('../../lib/auth');
    const result = verifyToken(req.headers.authorization?.replace('Bearer ', ''));
    if (!result) return res.status(401).json({ error: 'Invalid token' });
    return res.status(200).json({ valid: true, userId: result.userId });
  }

  return res.status(400).json({ error: 'Unknown action' });
}
