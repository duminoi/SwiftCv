import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callAI } from './zen';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { experiences, summary, currentSkills, lang = 'en' } = req.body;
    if (!experiences) return res.status(400).json({ error: 'experiences is required' });

    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are a career advisor. Return ONLY a JSON array of strings (10-15 skill names in ${language}). Mix hard and soft skills, prioritize skills implied by experience but not listed.`,
      `Current skills: ${(currentSkills || []).join(', ')}\nSummary: ${summary || 'N/A'}\nExperience:\n${JSON.stringify(experiences, null, 2)}`
    );

    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    return res.status(200).json(JSON.parse(cleaned));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
