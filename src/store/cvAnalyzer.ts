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
  suggestions: string[];
}

const COMMON_KEYWORDS = [
  'react', 'typescript', 'javascript', 'node.js', 'python', 'java', 'aws', 'docker', 
  'kubernetes', 'sql', 'nosql', 'agile', 'scrum', 'ci/cd', 'git', 'rest api'
];

export const analyzeCV = (data: CVData, lang: 'en' | 'vi'): ScoreResult => {
  let score = 0;
  const suggestions: string[] = [];
  const breakdown = { 
    personal: 0, 
    summary: 0, 
    experience: 0, 
    education: 0,
    skills: 0
  };

  // 1. Personal Info Analysis (Max: 15)
  if (data.personalInfo.fullName && data.personalInfo.fullName.length > 5) breakdown.personal += 5;
  if (data.personalInfo.email.includes('@')) breakdown.personal += 3;
  if (data.personalInfo.phone) breakdown.personal += 3;
  if (data.personalInfo.linkedin || data.personalInfo.github) breakdown.personal += 4;
  
  if (breakdown.personal < 15) {
    suggestions.push(lang === 'vi' ? 'Hãy điền đầy đủ thông tin liên hệ và mạng xã hội chuyên nghiệp.' : 'Please complete your contact info and professional social links.');
  }

  // 2. Summary Analysis (Max: 15)
  const summaryLength = data.personalInfo.summary.trim().split(/\s+/).length;
  if (summaryLength >= 40 && summaryLength <= 80) {
    breakdown.summary = 15;
  } else if (summaryLength > 0) {
    breakdown.summary = 8;
    suggestions.push(lang === 'vi' ? 'Phần tóm tắt lý tưởng nên từ 40-80 từ để tối ưu ATS.' : 'Ideal summary length is 40-80 words for ATS optimization.');
  } else {
    suggestions.push(lang === 'vi' ? 'Thêm một đoạn tóm tắt chuyên môn để làm nổi bật giá trị của bạn.' : 'Add a professional summary to highlight your value.');
  }

  // 3. Experience Analysis (Max: 40)
  if (data.experiences.length > 0) {
    let expPoints = 0;
    data.experiences.forEach(exp => {
      if (exp.company && exp.position) expPoints += 5;
      
      // Bullet points analysis
      const validBullets = exp.bulletPoints.filter(p => p.trim().length > 20);
      if (validBullets.length >= 3) expPoints += 10;
      else if (validBullets.length > 0) expPoints += 5;

      // Metrics check (Numbers, percentages, currency)
      const hasMetrics = exp.bulletPoints.some(p => /[\d%]+/.test(p) || /\$\d+/.test(p));
      if (hasMetrics) expPoints += 5;
      else if (exp.bulletPoints.length > 0) {
        suggestions.push(lang === 'vi' ? `Thêm số liệu (%, $, số lượng) vào kinh nghiệm tại ${exp.company}.` : `Add quantifiable metrics (%, $, numbers) to your role at ${exp.company}.`);
      }
    });
    breakdown.experience = Math.min(expPoints, 40);
  } else {
    suggestions.push(lang === 'vi' ? 'Kinh nghiệm làm việc là phần quan trọng nhất, hãy bổ sung ngay.' : 'Work experience is crucial, please add your professional history.');
  }

  // 4. Education Analysis (Max: 15)
  if (data.educations.length > 0) {
    breakdown.education = 15;
  } else {
    suggestions.push(lang === 'vi' ? 'Đừng quên thông tin học vấn của bạn.' : 'Do not forget to include your educational background.');
  }

  // 5. Skills & Keywords Analysis (Max: 15)
  if (data.skills.length >= 5) {
    breakdown.skills += 10;
  } else if (data.skills.length > 0) {
    breakdown.skills += 5;
    suggestions.push(lang === 'vi' ? 'Nên có ít nhất 5 kỹ năng chuyên môn.' : 'Include at least 5 professional skills.');
  }

  // Keyword optimization check
  const allText = JSON.stringify(data).toLowerCase();
  const foundKeywords = COMMON_KEYWORDS.filter(kw => allText.includes(kw));
  if (foundKeywords.length >= 3) {
    breakdown.skills += 5;
  } else {
    suggestions.push(lang === 'vi' ? 'Thêm các từ khóa chuyên ngành (ví dụ: React, AWS, Agile) để vượt qua bộ lọc ATS.' : 'Add industry keywords (e.g., React, AWS, Agile) to pass ATS filters.');
  }

  score = breakdown.personal + breakdown.summary + breakdown.experience + breakdown.education + breakdown.skills;

  return {
    total: Math.min(score, 100),
    breakdown,
    suggestions: [...new Set(suggestions)].slice(0, 5)
  };
};
