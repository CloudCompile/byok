import { getAllProviders } from '../../adapters/index';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const providers = getAllProviders();
  return res.status(200).json({ providers });
}
