import type { CVData, CVProject } from '../store/useCVStore';

// ── Base URL cho tất cả API calls (proxy qua Vite) ──
const API_BASE = '/api';

// ── POST generic: gọi API, tự động parse JSON, bắn lỗi nếu không OK ──
async function post<T = any>(path: string, body: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// ── GET generic ──
async function get<T = any>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// ── DELETE generic ──
async function del<T = any>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed (${res.status})`);
  }
  return res.json();
}

// ═══════════════════════════
//  AI Routes — gọi backend
// ═══════════════════════════

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

// ═══════════════════════════
//  CV CRUD — đồng bộ cloud
// ═══════════════════════════

export async function saveCVToCloud(cv: CVProject, token?: string): Promise<void> {
  await post('/cv/save', { cv }, token);
}

export async function loadCVsFromCloud(token?: string): Promise<{ cvs: any[] }> {
  return get('/cv/load', token);
}

export async function listCVsFromCloud(token?: string): Promise<{ cvs: { id: string; name: string; template: string; updatedAt: string }[] }> {
  return get('/cv/list', token);
}

export async function deleteCVFromCloud(id: string, token?: string): Promise<void> {
  await del(`/cv/delete/${id}`, token);
}

// ═══════════════════════════
//  Cover Letter
// ═══════════════════════════

export async function generateCoverLetter(cvData: CVData, companyName: string, jobTitle: string, tone: string, lang: string) {
  return post('/generate-cover-letter', { cvData, companyName, jobTitle, tone, lang });
}

// ═══════════════════════════
//  Stripe — thanh toán
// ═══════════════════════════

export async function createCheckoutSession(priceId: string) {
  return post('/stripe/checkout', { priceId, successUrl: window.location.origin + '/?checkout=success', cancelUrl: window.location.origin + '/pricing' });
}

// ═══════════════════════════
//  LinkedIn Import
// ═══════════════════════════

export async function importLinkedIn(pdfText: string) {
  return post('/import-linkedin', { pdfText });
}

// ═══════════════════════════
//  Tailor CV — 1-click tailor
// ═══════════════════════════

export async function tailorCV(cvData: CVData, jobDescription: string, lang: string) {
  return post('/tailor', { cvData, jobDescription, lang });
}

// ═══════════════════════════
//  Auth Routes — user + migrate
// ═══════════════════════════

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
