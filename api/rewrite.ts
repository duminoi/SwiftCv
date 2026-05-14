import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callAI } from './gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, content, jobTitle, lang = 'en' } = req.body;
    if (!type || !content) return res.status(400).json({ error: 'type and content required' });

    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    let result: string;

    if (type === 'summary') {
      result = await callAI(
        `You are a professional CV writer. Return ONLY a JSON array of 3 strings (summary versions in ${language}). Each 2-4 sentences, 40-80 words, include keywords naturally, start strong.`,
        `Job Title: ${jobTitle || 'N/A'}\n\nCurrent Summary:\n${content}`
      );
    } else if (type === 'bullets') {
      result = await callAI(
        `You are a professional CV writer. Return ONLY a JSON object: { versions: string[][] } with 2 arrays of 3-5 bullet points each. Use strong action verbs, include numbers, in ${language}.`,
        `Current bullet points:\n${content}`
      );
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    return res.status(200).json(JSON.parse(cleaned));
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
