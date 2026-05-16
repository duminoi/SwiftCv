import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callAI, safeParseJSON } from './zen';

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

    const parsed = safeParseJSON(result);
    if (!parsed.total || !parsed.breakdown || !parsed.suggestions) {
      throw new Error('Invalid response structure');
    } 
    return res.status(200).json(parsed);
  } catch (err: any) {
    console.error('[analyze API] Error:', err.message);
    console.error('[analyze API] Stack:', err.stack);
    return res.status(500).json({ 
      error: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
}
