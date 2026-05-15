import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCVs } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const userId = (req as any).userId || 'anonymous';
    const cvs = await getCVs(userId);

    return res.status(200).json({ cvs });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
