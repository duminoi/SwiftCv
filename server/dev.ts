import express from 'express';
import { callAI } from '../api/gemini';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.post('/api/analyze', async (req, res) => {
  try {
    const { cvData, lang = 'en' } = req.body;
    if (!cvData) return res.status(400).json({ error: 'cvData is required' });
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are an expert ATS optimization consultant. Return ONLY valid JSON with: total (0-100), breakdown: {personal:0-15, summary:0-15, experience:0-40, education:0-15, skills:0-15}, details: {contactCompleteness:{score,max:10}, summaryQuality:{score,max:10}, experienceDepth:{score,max:15}, quantifiableMetrics:{score,max:10}, actionVerbs:{score,max:10}, keywordDensity:{score,max:5}}, suggestions: string[] (max 6, in ${language}).`,
      `Analyze this CV:\n\n${JSON.stringify(cvData, null, 2)}`
    );
    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/rewrite', async (req, res) => {
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
    } else return res.status(400).json({ error: 'Invalid type' });
    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/suggest-skills', async (req, res) => {
  try {
    const { experiences, summary, currentSkills, lang = 'en' } = req.body;
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are a career advisor. Return ONLY a JSON array of strings (10-15 skill names in ${language}). Mix hard and soft skills, prioritize skills implied by experience but not listed.`,
      `Current skills: ${(currentSkills || []).join(', ')}\nSummary: ${summary || 'N/A'}\nExperience:\n${JSON.stringify(experiences, null, 2)}`
    );
    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/match', async (req, res) => {
  try {
    const { cvData, jdText, lang = 'en' } = req.body;
    if (!cvData || !jdText) return res.status(400).json({ error: 'cvData and jdText required' });
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are an ATS optimization expert. Analyze how well this CV matches the job description.
Return ONLY valid JSON with: matchScore (0-100), breakdown: {keywords:0-100, skills:0-100, experience:0-100, education:0-100}, missingKeywords: string[] (max 10), matchingKeywords: string[] (max 10), suggestions: string[] (max 6, in ${language}), experienceGap: string.`,
      `CV Data:\n${JSON.stringify(cvData, null, 2)}\n\nJob Description:\n${jdText}`
    );
    const cleaned = result.replace(/```(?:json)?\s*/gi, '').trim();
    res.json(JSON.parse(cleaned));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`);
  console.log('> No API key? Running in DEMO mode with realistic fake responses.');
  console.log('> Set GEMINI_API_KEY or OPENROUTER_API_KEY for real AI.');
});
