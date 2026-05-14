import type { CVData } from '../store/useCVStore';

const API_BASE = '/api';

async function post(path: string, body: unknown): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function analyzeCV(cvData: CVData, lang: string) {
  return post('/analyze', { cvData, lang });
}

export async function rewriteSummary(content: string, jobTitle: string, lang: string) {
  return post('/rewrite', { type: 'summary', content, jobTitle, lang });
}

export async function rewriteBullets(content: string, lang: string) {
  return post('/rewrite', { type: 'bullets', content, lang });
}

export async function suggestSkills(
  experiences: CVData['experiences'],
  summary: string,
  currentSkills: string[],
  lang: string
) {
  return post('/suggest-skills', { experiences, summary, currentSkills, lang });
}

export async function matchJD(cvData: CVData, jdText: string, lang: string) {
  return post('/match', { cvData, jdText, lang });
}
