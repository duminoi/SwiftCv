import type { CVData } from './useCVStore';

export interface ScoreResult {
  total: number;
  breakdown: {
    personal: number;
    summary: number;
    experience: number;
    education: number;
  };
  suggestions: string[];
}

export const analyzeCV = (data: CVData, lang: 'en' | 'vi'): ScoreResult => {
  let score = 0;
  const suggestions: string[] = [];
  const breakdown = { personal: 0, summary: 0, experience: 0, education: 0 };

  // 1. Personal Info Analysis
  if (data.personalInfo.fullName && data.personalInfo.fullName.length > 5) breakdown.personal += 5;
  if (data.personalInfo.email.includes('@')) breakdown.personal += 5;
  if (data.personalInfo.phone) breakdown.personal += 5;
  if (data.personalInfo.jobTitle) breakdown.personal += 5;
  if (breakdown.personal < 20) {
    suggestions.push(lang === 'vi' ? 'Hãy điền đầy đủ thông tin liên hệ.' : 'Please complete your contact information.');
  }

  // 2. Summary Analysis
  const summaryLength = data.personalInfo.summary.split(/\s+/).length;
  if (summaryLength >= 30 && summaryLength <= 100) {
    breakdown.summary = 20;
  } else if (summaryLength > 0) {
    breakdown.summary = 10;
    suggestions.push(lang === 'vi' ? 'Phần tóm tắt nên có độ dài từ 30-100 từ.' : 'Summary should be between 30-100 words.');
  } else {
    suggestions.push(lang === 'vi' ? 'Bạn nên có một đoạn tóm tắt chuyên môn.' : 'Add a professional summary to highlight your value.');
  }

  // 3. Experience Analysis
  if (data.experiences.length > 0) {
    let expScore = 0;
    data.experiences.forEach(exp => {
      if (exp.company && exp.position) expScore += 10;
      if (exp.bulletPoints.length >= 3) expScore += 10;
      
      const hasNumbers = exp.bulletPoints.some(p => /\d+/.test(p));
      if (!hasNumbers && exp.bulletPoints.length > 0) {
        suggestions.push(lang === 'vi' ? `Thêm số liệu (metrics) vào kinh nghiệm tại ${exp.company}.` : `Add quantifiable metrics to your role at ${exp.company}.`);
      }
    });
    breakdown.experience = Math.min(expScore, 40);
  } else {
    suggestions.push(lang === 'vi' ? 'Thêm ít nhất một kinh nghiệm làm việc.' : 'Add at least one work experience.');
  }

  // 4. Education Analysis
  if (data.educations.length > 0) {
    breakdown.education = 20;
  } else {
    suggestions.push(lang === 'vi' ? 'Thêm thông tin học vấn của bạn.' : 'Add your educational background.');
  }

  score = breakdown.personal + breakdown.summary + breakdown.experience + breakdown.education;

  return {
    total: score,
    breakdown,
    suggestions: suggestions.slice(0, 5) // Trả về tối đa 5 gợi ý
  };
};
