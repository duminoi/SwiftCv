import type { CVData, CVProject } from '../store/useCVStore';

const API_BASE = '/api';

async function post<T = any>(path: string, body: unknown): Promise<T> {
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

async function get<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

async function del<T = any>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// ── AI Routes ──

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

export async function generateSummary(
  experiences: CVData['experiences'],
  education: CVData['educations'],
  jobTitle: string,
  lang: string
) {
  return post('/generate-summary', { experiences, education, jobTitle, lang });
}

export async function matchJD(cvData: CVData, jdText: string, lang: string) {
  return post('/match', { cvData, jdText, lang });
}

// ── CV CRUD Routes ──

export async function saveCVToCloud(cv: CVProject): Promise<void> {
  await post('/cv/save', { cv });
}

export async function loadCVsFromCloud(): Promise<{ cvs: any[] }> {
  return get('/cv/load');
}

export async function listCVsFromCloud(): Promise<{ cvs: { id: string; name: string; template: string; updatedAt: string }[] }> {
  return get('/cv/list');
}

export async function deleteCVFromCloud(id: string): Promise<void> {
  await del(`/cv/delete/${id}`);
}

// ── Cover Letter ──

export async function generateCoverLetter(cvData: CVData, companyName: string, jobTitle: string, tone: string, lang: string) {
  return post('/generate-cover-letter', { cvData, companyName, jobTitle, tone, lang });
}

// ── Stripe ──

export async function createCheckoutSession(priceId: string) {
  return post('/stripe/checkout', { priceId, successUrl: window.location.origin + '/?checkout=success', cancelUrl: window.location.origin + '/pricing' });
}

// ── LinkedIn Import ──

export async function importLinkedIn(pdfText: string) {
  return post('/import-linkedin', { pdfText });
}

// ── Auth Routes ──

export async function createAuthUser(id: string, email?: string, name?: string) {
  return post('/auth/create', { id, email, name });
}

export async function getAuthUser(id: string) {
  return get(`/auth/user/${id}`);
}

export async function migrateCVsToUser(userId: string, cvs: any[]) {
  return post('/auth/migrate', { userId, cvs });
}

export async function upgradeUserTier(userId: string, tier: string) {
  return post('/auth/upgrade', { userId, tier });
}
