import 'dotenv/config';
import http from 'http';
import express from 'express';
import { callAI, safeParseJSON } from '../api/zen';
import { getCVs, saveCV, deleteCV, getUser, createUser, updateUserTier } from '../api/db';

const app = express();
app.use(express.json({ limit: '5mb' }));

// ── Helper: làm sạch JSON từ response AI ──
// safeParseJSON từ api/zen đã xử lý toàn bộ

// ═══════════════════════════════════════════
//  AI ROUTES
// ═══════════════════════════════════════════

// ── POST /api/analyze: Phân tích CV, tính ATS score ──
app.post('/api/analyze', async (req, res) => {
  try {
    const { cvData, lang = 'en' } = req.body;
    if (!cvData) return res.status(400).json({ error: 'cvData is required' });
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are an expert ATS optimization consultant. Return ONLY valid JSON with: total (0-100), breakdown: {personal:0-15, summary:0-15, experience:0-40, education:0-15, skills:0-15}, details: {contactCompleteness:{score,max:10}, summaryQuality:{score,max:10}, experienceDepth:{score,max:15}, quantifiableMetrics:{score,max:10}, actionVerbs:{score,max:10}, keywordDensity:{score,max:5}}, suggestions: string[] (max 6, in ${language}).`,
      `Analyze this CV:\n\n${JSON.stringify(cvData, null, 2)}`
    );
    console.log('[Analyze] Raw AI response length:', result?.length || 0);
    console.log('[Analyze] Raw AI response preview:', result?.substring(0, 300));
    const parsed = safeParseJSON(result);
    if (!parsed.total || !parsed.breakdown || !parsed.suggestions) {
      throw new Error('Invalid response structure');
    }
    parsed.source = 'ai';
    res.json(parsed);
  } catch (err: any) {
    console.error('[Analyze] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/rewrite: Viết lại summary hoặc bullet points ──
app.post('/api/rewrite', async (req, res) => {
  try {
    const { type, content, jobTitle, lang = 'en' } = req.body;
    if (!type || !content) return res.status(400).json({ error: 'type and content required' });
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const systemPrompt = type === 'summary'
      ? `You are a professional CV writer. Return ONLY a JSON array of 3 strings (summary versions in ${language}). Each 2-4 sentences, 40-80 words, include keywords naturally, start strong.`
      : `You are a professional CV writer. Return ONLY a JSON object: { versions: string[][] } with 2 arrays of 3-5 bullet points each. Use strong action verbs, include numbers, in ${language}.`;
    const userPrompt = type === 'summary'
      ? `Job Title: ${jobTitle || 'N/A'}\n\nCurrent Summary:\n${content}`
      : `Current bullet points:\n${content}`;
    const result = await callAI(systemPrompt, userPrompt);
    res.json(safeParseJSON(result));
  } catch (err: any) {
    console.error('[Rewrite] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/suggest-skills: Gợi ý kỹ năng ──
app.post('/api/suggest-skills', async (req, res) => {
  try {
    const { experiences, summary, currentSkills, lang = 'en' } = req.body;
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are a career advisor. Return ONLY a JSON array of strings (10-15 skill names in ${language}). Mix hard and soft skills, prioritize skills implied by experience but not listed.`,
      `Current skills: ${(currentSkills || []).join(', ')}\nSummary: ${summary || 'N/A'}\nExperience:\n${JSON.stringify(experiences, null, 2)}`
    );
    res.json(safeParseJSON(result));
  } catch (err: any) {
    console.error('[SuggestSkills] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/generate-summary: Tạo summary mới ──
app.post('/api/generate-summary', async (req, res) => {
  try {
    const { experiences, education, jobTitle, lang = 'en' } = req.body;
    if (!experiences) return res.status(400).json({ error: 'experiences is required' });
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const result = await callAI(
      `You are a professional CV writer. Return ONLY a JSON array of 3 strings (professional summary versions in ${language}). Each 2-4 sentences, 40-80 words, include keywords naturally, start strong. Base the summary on the provided experience and education.`,
      `Target Role: ${jobTitle || 'N/A'}\nExperiences:\n${JSON.stringify(experiences, null, 2)}\nEducation:\n${JSON.stringify(education || [], null, 2)}`
    );
    res.json(safeParseJSON(result));
  } catch (err: any) {
    console.error('[GenerateSummary] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/match: So khớp CV với JD ──
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
    res.json(safeParseJSON(result));
  } catch (err: any) {
    console.error('[Match] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  CV CRUD ROUTES — lưu/xoá CV qua file JSON
// ═══════════════════════════════════════════

const ANON_USER = 'anonymous';

// ── Feature Gating Middleware ──
// Giới hạn số lần dùng AI cho free users
const USAGE_LIMITS: Record<string, number> = {
  free: 5,
  pro: -1,      // unlimited
  business: -1,
  lifetime: -1,
};

function checkUsage(userId: string, endpoint: string) {
  // Môi trường dev luôn cho phép, prod sẽ check DB
  const user = getUser(userId);
  if (!user || user.tier === 'free') {
    return { allowed: true, remaining: 5, tier: 'free' };
  }
  return { allowed: true, remaining: -1, tier: user.tier };
}

// Danh sách các endpoint AI cần tracking usage
const aiEndpoints = ['/api/analyze', '/api/rewrite', '/api/suggest-skills', '/api/match', '/api/generate-summary', '/api/generate-cover-letter'];

// ── POST /api/cv/save: Lưu CV (upsert) ──
app.post('/api/cv/save', async (req, res) => {
  try {
    const { cv } = req.body;
    if (!cv || !cv.id) return res.status(400).json({ error: 'cv with id is required' });
    await saveCV(ANON_USER, {
      user_id: ANON_USER,
      id: cv.id,
      name: cv.name || 'Untitled',
      data: JSON.stringify(cv.data),
      template: cv.template || 'executive',
      primary_color: cv.primaryColor || '#0061a4',
      font_family: cv.fontFamily || 'sans',
      updated_at: cv.updatedAt || new Date().toISOString(),
    });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/cv/load: Lấy tất cả CV ──
app.get('/api/cv/load', async (req, res) => {
  try {
    const cvs = await getCVs(ANON_USER);
    res.json({ cvs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/cv/list: Lấy danh sách CV dạng tóm tắt (cho sidebar) ──
app.get('/api/cv/list', async (req, res) => {
  try {
    const cvs = await getCVs(ANON_USER);
    const summaries = cvs.map(cv => ({
      id: cv.id,
      name: cv.name,
      template: cv.template,
      updatedAt: cv.updated_at,
    }));
    res.json({ cvs: summaries });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/cv/delete/:id: Xoá CV ──
app.delete('/api/cv/delete/:id', async (req, res) => {
  try {
    await deleteCV(ANON_USER, req.params.id);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  AUTH ROUTES — đăng ký, login, migrate
// ═══════════════════════════════════════════

// ── POST /api/auth/create: Tạo user mới (nếu chưa tồn tại) ──
app.post('/api/auth/create', async (req, res) => {
  try {
    const { id, email, name } = req.body;
    if (!id) return res.status(400).json({ error: 'id is required' });
    const existing = getUser(id);
    if (existing) return res.json({ user: existing, created: false });
    const user = { id, email, name, tier: 'free' as const, createdAt: new Date().toISOString() };
    createUser(user);
    res.json({ user, created: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/auth/user/:id: Lấy thông tin user ──
app.get('/api/auth/user/:id', async (req, res) => {
  try {
    const user = getUser(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/migrate: Chuyển CV từ anonymous → tài khoản ──
app.post('/api/auth/migrate', async (req, res) => {
  try {
    const { userId, cvs } = req.body;
    if (!userId || !cvs) return res.status(400).json({ error: 'userId and cvs required' });
    for (const cv of cvs) {
      await saveCV(userId, { ...cv, user_id: userId });
    }
    res.json({ ok: true, migrated: cvs.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/auth/upgrade: Nâng cấp tier (free → pro/business/lifetime) ──
app.post('/api/auth/upgrade', async (req, res) => {
  try {
    const { userId, tier } = req.body;
    if (!userId || !tier) return res.status(400).json({ error: 'userId and tier required' });
    updateUserTier(userId, tier);
    res.json({ ok: true, tier });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  COVER LETTER — tạo thư xin việc
// ═══════════════════════════════════════════

app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { cvData, companyName, jobTitle, tone = 'professional', lang = 'en' } = req.body;
    if (!cvData || !companyName) return res.status(400).json({ error: 'cvData and companyName required' });
    const language = lang === 'vi' ? 'Vietnamese' : 'English';
    const toneGuide = tone === 'professional'
      ? 'Formal, respectful, traditional business letter tone'
      : 'Conversational, modern, slightly casual but still professional';
    const result = await callAI(
      `You are a professional cover letter writer. Return ONLY a JSON object with: subject (string), body (string, 3-4 paragraphs in ${language}), and salutation (string). Tone: ${toneGuide}. Do not invent facts not present in the CV.`,
      `CV Data:\n${JSON.stringify(cvData, null, 2)}\n\nCompany: ${companyName}\nPosition: ${jobTitle || 'N/A'}`
    );
    res.json(safeParseJSON(result));
  } catch (err: any) {
    console.error('[CoverLetter] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  STRIPE API — thanh toán (demo mode)
// ═══════════════════════════════════════════

// ── POST /api/stripe/checkout: Tạo session checkout Stripe ──
// Nếu không có STRIPE_SECRET_KEY → trả về URL demo
app.post('/api/stripe/checkout', async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) return res.status(400).json({ error: 'priceId required' });

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.json({
        url: `/pricing?upgraded=${priceId}`,
        demo: true,
        message: 'Stripe not configured. Set STRIPE_SECRET_KEY for real payments.',
      });
    }

    const stripe = await import('stripe');
    const client = new stripe.default(process.env.STRIPE_SECRET_KEY);
    const session = await client.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl || 'http://localhost:5173/?checkout=success',
      cancel_url: cancelUrl || 'http://localhost:5173/pricing',
    });
    res.json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/stripe/webhook: Xử lý webhook từ Stripe ──
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.json({ received: true, demo: true });
  }
  try {
    const stripe = await import('stripe');
    const client = new stripe.default(process.env.STRIPE_SECRET_KEY);
    const event = client.webhooks.constructEvent(
      JSON.stringify(req.body), sig, process.env.STRIPE_WEBHOOK_SECRET
    );
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      console.log(`Checkout completed: ${session.id}, customer: ${session.customer}`);
    }
    res.json({ received: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  LINKEDIN IMPORT — parse dữ liệu từ LinkedIn PDF
// ═══════════════════════════════════════════

app.post('/api/import-linkedin', async (req, res) => {
  try {
    const { pdfText } = req.body;
    if (!pdfText) return res.status(400).json({ error: 'pdfText is required' });
    const result = await callAI(
      `You are a data extraction specialist. Parse the LinkedIn profile text and return ONLY valid JSON with this EXACT schema:
{
  fullName: string,
  jobTitle: string,
  email: string,
  phone: string,
  address: string,
  summary: string,
  linkedin: string,
  experiences: [{ id: string, company: string, position: string, startDate: string, endDate: string, bulletPoints: string }],
  educations: [{ id: string, school: string, degree: string, startDate: string, endDate: string }],
  skills: string[]
}
Use empty strings for missing fields. Generate unique IDs for each entry. Format bulletPoints as HTML <ul><li>...</li></ul>.`,
      `LinkedIn Profile Text:\n${pdfText}`
    );
    res.json(safeParseJSON(result));
  } catch (err: any) {
    console.error('[LinkedInImport] AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════
//  SERVER STARTUP
// ═══════════════════════════════════════════

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`);
  const model = process.env.ZEN_MODEL || 'big-pickle';
  const keySet = !!process.env.OPENCODE_API_KEY;
  console.log(`> AI model: ${model} (${keySet ? 'API key set ✓' : 'DEMO mode — no API key'})`);
  console.log('> Set OPENCODE_API_KEY=your_key and ZEN_MODEL=model_name to customize.');
  console.log('> Free models: big-pickle, deepseek-v4-flash-free, minimax-m2.5-free, nemotron-3-super-free');
  console.log('> Optional fallback: set OPENROUTER_API_KEY for OpenRouter.');
});
