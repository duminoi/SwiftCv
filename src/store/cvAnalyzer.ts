import type { CVData } from './useCVStore';

export interface ScoreResult {
  total: number;
  breakdown: {
    personal: number;
    summary: number;
    experience: number;
    education: number;
    skills: number;
  };
  details: {
    contactCompleteness: { score: number; max: number };
    summaryQuality: { score: number; max: number };
    experienceDepth: { score: number; max: number };
    quantifiableMetrics: { score: number; max: number };
    actionVerbs: { score: number; max: number };
    keywordDensity: { score: number; max: number };
  };
  suggestions: string[];
}

const COMMON_KEYWORDS = [
  'react', 'typescript', 'javascript', 'node.js', 'python', 'java', 'aws', 'docker',
  'kubernetes', 'sql', 'nosql', 'agile', 'scrum', 'ci/cd', 'git', 'rest api',
  'leadership', 'management', 'strategy', 'operations', 'sales', 'marketing',
  'design', 'ui/ux', 'product management', 'project management', 'data analysis',
  'communication', 'problem solving', 'collaboration', 'negotiation', 'finance'
];

const ACTION_VERBS = [
  'led', 'spearheaded', 'achieved', 'delivered', 'drove', 'launched', 'developed',
  'implemented', 'created', 'designed', 'established', 'generated', 'increased',
  'reduced', 'improved', 'transformed', 'optimized', 'accelerated', 'expanded',
  'negotiated', 'orchestrated', 'pioneered', 'built', 'managed', 'directed',
  'supervised', 'coordinated', 'executed', 'produced', 'streamlined', 'enhanced',
  'boosted', 'secured', 'strengthened', 'maximized', 'restructured', 'reorganized'
];

function stripHtml(html: string): string {
  return html
    .replace(/<\/li>/g, '\n')
    .replace(/<\/p>/g, '\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
}

function extractBullets(raw: string): string[] {
  const text = stripHtml(raw);
  return text.split('\n').filter(p => p.trim().length > 0).map(p => p.trim());
}

function countActionVerbs(text: string): number {
  const lower = text.toLowerCase();
  return ACTION_VERBS.filter(v => new RegExp(`\\b${v}\\b`).test(lower)).length;
}

function countMetrics(text: string): number {
  const matches = text.match(/[\d]+%|\$\s*[\d,]+(?:\.\d+)?|[\d]+(?:\s*%|\s*users|\s*customers|\s*revenue|\s*sales|\s*clients|\s*projects|\s*team|\s*employees|\s*countries|\s*cities|\s*offices)/gi);
  return matches ? matches.length : 0;
}

const t = (vi: string, en: string, lang: string) => lang === 'vi' ? vi : en;

export const analyzeCV = (data: CVData, lang: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'es' | 'fr' | 'de'): ScoreResult => {
  const suggestions: string[] = [];
  const breakdown = { personal: 0, summary: 0, experience: 0, education: 0, skills: 0 };
  const details = {
    contactCompleteness: { score: 0, max: 10 },
    summaryQuality: { score: 0, max: 10 },
    experienceDepth: { score: 0, max: 15 },
    quantifiableMetrics: { score: 0, max: 10 },
    actionVerbs: { score: 0, max: 10 },
    keywordDensity: { score: 0, max: 5 },
  };

  if (!data) return { total: 0, breakdown, details, suggestions: ['Missing CV data'] };

  const pi = data.personalInfo || {};

  // ── 1. Personal / Contact (Max: 10 + 5 bonus = 15) ──
  let contactScore = 0;
  if (pi.fullName && pi.fullName.length > 2) contactScore += 2;
  if (pi.email && pi.email.includes('@') && pi.email.includes('.')) contactScore += 2;
  if (pi.phone && pi.phone.length >= 7) contactScore += 2;
  if (pi.linkedin) contactScore += 2;
  if (pi.github || pi.portfolio) contactScore += 2;
  details.contactCompleteness = { score: contactScore, max: 10 };

  const hasSocial = !!(pi.linkedin || pi.github || pi.portfolio);
  if (contactScore === 10) {
    breakdown.personal = 15;
    details.contactCompleteness.score = 10;
  } else {
    breakdown.personal = contactScore + (hasSocial ? 5 : 0);
    if (!pi.linkedin) suggestions.push(t('Hãy thêm LinkedIn để tăng độ tin cậy.', 'Add LinkedIn to boost credibility.', lang));
  }

  // ── 2. Summary (Max: 15) ──
  const summary = pi.summary || '';
  const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length;

  if (summaryWords > 0) {
    details.summaryQuality = { score: Math.min(summaryWords >= 30 ? 10 : 5, 10), max: 10 };
    if (summaryWords >= 30 && summaryWords <= 80) {
      breakdown.summary = 15;
    } else if (summaryWords > 80) {
      breakdown.summary = 10;
      suggestions.push(t('Tóm tắt hơi dài, lý tưởng 30-80 từ.', 'Summary is a bit long, ideal is 30-80 words.', lang));
    } else {
      breakdown.summary = 8;
      suggestions.push(t('Tóm tắt quá ngắn, hãy viết 30-80 từ.', 'Summary is too short, aim for 30-80 words.', lang));
    }
  } else {
    details.summaryQuality = { score: 0, max: 10 };
    suggestions.push(t('Thêm tóm tắt chuyên môn 30-80 từ.', 'Add a 30-80 word professional summary.', lang));
  }

  // ── 3. Experience (Max: 40 total) ──
  const experiences = data.experiences || [];
  if (experiences.length > 0) {
    let expDepthScore = 0;
    let totalMetrics = 0;
    let totalActionVerbs = 0;
    let totalBullets = 0;

    experiences.forEach(exp => {
      if (exp.company) expDepthScore += 1;
      if (exp.position) expDepthScore += 1;
      if (exp.startDate) expDepthScore += 0.5;

      const bullets = extractBullets(exp.bulletPoints || '');
      totalBullets += bullets.length;

      const validBullets = bullets.filter(b => b.length > 20);
      if (validBullets.length >= 3) expDepthScore += 2;
      else if (validBullets.length > 0) expDepthScore += 1;

      totalMetrics += countMetrics(exp.bulletPoints || '');
      totalActionVerbs += countActionVerbs(exp.bulletPoints || '');
    });

    const avgBulletsPerJob = experiences.length > 0 ? totalBullets / experiences.length : 0;

    details.experienceDepth = { score: Math.min(Math.round(expDepthScore), 15), max: 15 };
    details.quantifiableMetrics = { score: Math.min(totalMetrics * 2, 10), max: 10 };
    details.actionVerbs = { score: Math.min(totalActionVerbs * 1.5, 10), max: 10 };

    const depthScore = Math.min(expDepthScore, 15);
    const metricsScore = Math.min(totalMetrics * 2, 10);
    const verbsScore = Math.min(totalActionVerbs * 1.5, 10);
    breakdown.experience = Math.min(Math.round(depthScore + metricsScore + verbsScore), 40);

    if (avgBulletsPerJob < 2) {
      suggestions.push(t('Mỗi kinh nghiệm nên có ít nhất 3 bullet points chi tiết.', 'Each experience entry should have at least 3 detailed bullet points.', lang));
    }
    if (totalMetrics < 2) {
      suggestions.push(t('Thêm số liệu định lượng (%, $, số lượng) vào kinh nghiệm.', 'Add quantifiable metrics (%, $, numbers) to your experience.', lang));
    }
    if (totalActionVerbs < 3) {
      suggestions.push(t('Dùng nhiều action verbs mạnh hơn (Led, Achieved, Drove...).', 'Use more strong action verbs (Led, Achieved, Drove...).', lang));
    }
  } else {
    details.experienceDepth = { score: 0, max: 15 };
    details.quantifiableMetrics = { score: 0, max: 10 };
    details.actionVerbs = { score: 0, max: 10 };
    suggestions.push(t('Kinh nghiệm là phần quan trọng nhất, hãy bổ sung ngay.', 'Experience is the most important section, add it now.', lang));
  }

  // ── 4. Education (Max: 15) ──
  const educations = data.educations || [];
  if (educations.length > 0) {
    breakdown.education = 15;
  } else {
    suggestions.push(t('Đừng quên thông tin học vấn.', 'Don\'t forget your education information.', lang));
  }

  // ── 5. Skills & Keywords (Max: 15) ──
  const skills = data.skills || [];
  if (skills.length >= 8) {
    breakdown.skills += 10;
  } else if (skills.length >= 5) {
    breakdown.skills += 7;
  } else if (skills.length >= 3) {
    breakdown.skills += 4;
  } else if (skills.length > 0) {
    breakdown.skills += 2;
  }
  if (skills.length < 5) {
    suggestions.push(t('Nên có ít nhất 5 kỹ năng chuyên môn để tối ưu ATS.', 'Include at least 5 professional skills for ATS optimization.', lang));
  }

  const allText = JSON.stringify(data).toLowerCase();
  const foundKeywords = COMMON_KEYWORDS.filter(kw => allText.includes(kw));
  details.keywordDensity = { score: Math.min(foundKeywords.length, 5), max: 5 };
  if (foundKeywords.length >= 3) {
    breakdown.skills += 5;
  } else {
    suggestions.push(t('Thêm từ khóa chuyên ngành (React, AWS, Agile...) để qua bộ lọc ATS.', 'Add industry keywords (React, AWS, Agile...) to pass ATS filters.', lang));
  }

  const scoreValue = breakdown.personal + breakdown.summary + breakdown.experience + breakdown.education + breakdown.skills;

  return {
    total: Math.min(scoreValue, 100),
    breakdown,
    details,
    suggestions: [...new Set(suggestions)].slice(0, 6)
  };
};
