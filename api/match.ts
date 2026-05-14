import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callAI } from './gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { cvData, jdText, lang = 'en' } = req.body;
    if (!cvData || !jdText) return res.status(400).json({ error: 'cvData and jdText are required' });

    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are an ATS optimization expert. Analyze how well this CV matches the job description.
Return ONLY valid JSON with this EXACT schema:
{
  matchScore: number (0-100, overall match percentage),
  breakdown: { keywords: number (0-100), skills: number (0-100), experience: number (0-100), education: number (0-100) },
  missingKeywords: string[] (important keywords in JD missing from CV, max 10),
  matchingKeywords: string[] (keywords that DO match, max 10),
  suggestions: string[] (specific actionable advice to improve match, max 6, in ${language}),
  experienceGap: string (brief assessment of experience level match, in ${language})
}`,
      `CV Data:\n${JSON.stringify(cvData, null, 2)}\n\nJob Description:\n${jdText}`
    );

    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    return res.status(200).json(JSON.parse(cleaned));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
