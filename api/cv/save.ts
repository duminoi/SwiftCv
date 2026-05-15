import type { VercelRequest, VercelResponse } from '@vercel/node';
import { saveCV } from '../db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { cv } = req.body;
    if (!cv || !cv.id) return res.status(400).json({ error: 'cv with id is required' });

    const userId = (req as any).userId || 'anonymous';
    await saveCV(userId, {
      user_id: userId,
      id: cv.id,
      name: cv.name || 'Untitled',
      data: cv.data,
      template: cv.template || 'executive',
      primary_color: cv.primaryColor || '#0061a4',
      font_family: cv.fontFamily || 'sans',
      updated_at: cv.updatedAt || new Date().toISOString(),
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
