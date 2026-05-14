import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callAI } from './gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { cvData, lang = 'en' } = req.body;
    if (!cvData) return res.status(400).json({ error: 'cvData is required' });

    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are an expert ATS optimization consultant. Return ONLY valid JSON with: total (0-100), breakdown: {personal:0-15, summary:0-15, experience:0-40, education:0-15, skills:0-15}, details: {contactCompleteness:{score,max:10}, summaryQuality:{score,max:10}, experienceDepth:{score,max:15}, quantifiableMetrics:{score,max:10}, actionVerbs:{score,max:10}, keywordDensity:{score,max:5}}, suggestions: string[] (max 6, in ${language}). Be realistic.`,
      `Analyze this CV:\n\n${JSON.stringify(cvData, null, 2)}`
    );

    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    return res.status(200).json(JSON.parse(cleaned));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
