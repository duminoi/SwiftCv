// ── Biến môi trường: API key cho Zen và OpenRouter ──
const OPENCODE_API_KEY = process.env.OPENCODE_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_KEY;

// Cấu hình model Zen — có thể ghi đè qua biến môi trường
// Free models: big-pickle | deepseek-v4-flash-free | minimax-m2.5-free | nemotron-3-super-free
const ZEN_API_URL = process.env.ZEN_API_URL || 'https://opencode.ai/zen/v1/chat/completions';
const ZEN_MODEL = process.env.ZEN_MODEL || 'big-pickle';

// ── Hàm gọi AI chính ──
// Ưu tiên: Zen API → OpenRouter → Demo mode
export async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  // Thử Zen API trước (nếu có key)
  if (OPENCODE_API_KEY) {
    try {
      return await callZen(systemPrompt, userPrompt);
    } catch (e) {
      console.warn('Zen API failed, falling back...', e);
    }
  }

  // Nếu Zen lỗi → thử OpenRouter (nếu có key)
  if (OPENROUTER_KEY) {
    try {
      return await callOpenRouter(systemPrompt, userPrompt);
    } catch (e) {
      console.warn('OpenRouter failed, falling back to demo...', e);
    }
  }

  // Không có key hoặc tất cả đều lỗi → dùng demo mode
  return callDemoAI(systemPrompt, userPrompt);
}

// ── Gọi OpenCode Zen API (OpenAI-compatible) ──
async function callZen(system: string, user: string): Promise<string> {
  const res = await fetch(ZEN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENCODE_API_KEY}`,
    },
    body: JSON.stringify({
      model: ZEN_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });
  const rawText = await res.text();
  console.log(`[Zen API] Status: ${res.status}, Response length: ${rawText.length}`);
  if (!res.ok) throw new Error(`Zen API ${res.status}: ${rawText}`);

  // Parse JSON response, log lỗi nếu response không hợp lệ
  let data;
  try {
    data = JSON.parse(rawText);
  } catch (e) {
    console.error('[Zen API] Failed to parse JSON. Raw response:', rawText.substring(0, 500));
    throw new Error(`Zen API returned invalid JSON: ${rawText.substring(0, 200)}`);
  }

  // Lấy nội dung từ response chuẩn OpenAI format
  const content = data?.choices?.[0]?.message?.content || '';
  console.log(`[Zen API] Response content length: ${content.length}`);
  return content;
}

// ── Fallback: gọi OpenRouter (dùng Gemini Flash free) ──
async function callOpenRouter(system: string, user: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_KEY}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

// ── Demo mode: không cần API key, trả về dữ liệu giả lập ──
// Dùng regex trên system prompt để xác định loại request (mode)
export function callDemoAI(system: string, user: string): Promise<string> {
  const mode = system.includes('how well this CV matches') ? 'match'
    : system.includes('ATS optimization') ? 'analyze'
    : system.includes('CV writer') && system.includes('3') ? 'rewrite-summary'
    : system.includes('CV writer') ? 'rewrite-bullets'
    : system.includes('career advisor') ? 'suggest-skills'
    : system.includes('cover letter') ? 'cover-letter'
    : system.includes('data extraction') ? 'linkedin-import'
    : 'analyze';

  // Parse dữ liệu từ user prompt để tạo response "có vẻ thật"
  const hasMetrics = /\d+%|\$|[\d]+ (users|customers|revenue|clients)/i.test(user);
  const bulletCount = (user.match(/•|bullet|achieved|led|managed/gi) || []).length;
  const skillsMatch = user.match(/Current skills: (.*?)(?:\n|$)/);
  const currentSkills = skillsMatch ? skillsMatch[1].split(', ').filter(Boolean) : [];

  // Delay ngẫu nhiên 0.8-2s để giống AI thật
  const delay = 800 + Math.random() * 1200;

  return new Promise(resolve => {
    setTimeout(() => {
      switch (mode) {
        // ── JD Match: so sánh CV với mô tả công việc ──
        case 'match': {
          const jdKeywords = (user.match(/requirements?:?\s*([^]*?)(?:\n\n|$)/i)?.[1] || user).toLowerCase();
          const cvKeywords = ['react', 'typescript', 'leadership', 'management', 'python', 'aws', 'agile', 'docker', 'sql', 'communication'];
          const missing = cvKeywords.filter(k => !jdKeywords.includes(k)).slice(0, 6);
          const matching = cvKeywords.filter(k => jdKeywords.includes(k)).slice(0, 6);
          const matchPct = Math.min(40 + Math.floor(Math.random() * 40), 95);
          resolve(JSON.stringify({
            matchScore: matchPct,
            breakdown: {
              keywords: Math.min(30 + Math.floor(Math.random() * 70), 100),
              skills: Math.min(40 + Math.floor(Math.random() * 60), 100),
              experience: Math.min(50 + Math.floor(Math.random() * 50), 100),
              education: Math.min(60 + Math.floor(Math.random() * 40), 100),
            },
            missingKeywords: missing.length > 0 ? missing : ['Kubernetes', 'CI/CD', 'Terraform'],
            matchingKeywords: matching.length > 0 ? matching : ['Leadership', 'Project Management'],
            suggestions: [
              missing.length > 2 ? `Add missing keywords: ${missing.slice(0, 3).join(', ')}` : 'Your CV matches most keywords',
              'Tailor your professional summary to highlight JD-specific requirements',
              'Quantify achievements with metrics relevant to the job description',
              'Add a skills section that mirrors the key requirements listed',
            ].slice(0, 4 + Math.floor(Math.random() * 2)),
            experienceGap: 'Your experience level appears aligned with the seniority of this role.',
          }));
          break;
        }

        // ── Phân tích CV: đánh giá tổng thể ATS score ──
        case 'analyze': {
          const score = Math.min(45 + Math.floor(Math.random() * 30), 95);
          resolve(JSON.stringify({
            total: score,
            breakdown: {
              personal: Math.min(10 + Math.floor(Math.random() * 5), 15),
              summary: Math.min(6 + Math.floor(Math.random() * 9), 15),
              experience: Math.min(18 + Math.floor(Math.random() * 22), 40),
              education: Math.min(10 + Math.floor(Math.random() * 5), 15),
              skills: Math.min(8 + Math.floor(Math.random() * 7), 15),
            },
            details: {
              contactCompleteness: { score: 6 + Math.floor(Math.random() * 4), max: 10 },
              summaryQuality: { score: 4 + Math.floor(Math.random() * 6), max: 10 },
              experienceDepth: { score: 6 + Math.floor(Math.random() * 9), max: 15 },
              quantifiableMetrics: { score: hasMetrics ? 6 + Math.floor(Math.random() * 4) : 2 + Math.floor(Math.random() * 3), max: 10 },
              actionVerbs: { score: Math.min(bulletCount + Math.floor(Math.random() * 4), 10), max: 10 },
              keywordDensity: { score: Math.min(currentSkills.length + Math.floor(Math.random() * 2), 5), max: 5 },
            },
            suggestions: [
              'Add more quantifiable achievements with specific metrics (% growth, revenue, team size)',
              'Use stronger action verbs like "Led", "Delivered", "Optimized" instead of "Responsible for"',
              'Include industry-specific keywords from the job description to pass ATS filters',
              'Keep bullet points concise — aim for 1-2 lines each with measurable impact',
              currentSkills.length < 5 ? 'Add at least 5-8 skills relevant to your target role' : 'Consider adding a Professional Summary section to highlight your value proposition',
            ].slice(0, 4 + Math.floor(Math.random() * 2)),
          }));
          break;
        }

        // ── Rewrite Summary: 3 phiên bản summary khác nhau ──
        case 'rewrite-summary': {
          const jobTitle = user.match(/Job Title: (.+?)(?:\n|$)/)?.[1] || 'Professional';
          resolve(JSON.stringify([
            `Results-driven ${jobTitle} with a proven track record of driving operational excellence and delivering measurable business impact. Adept at leading cross-functional teams, optimizing processes, and implementing strategic initiatives that accelerate growth and maximize profitability.`,
            `Strategic ${jobTitle} with 10+ years of experience in scaling operations, building high-performance teams, and executing data-driven strategies. Passionate about leveraging technology and innovation to solve complex business challenges and deliver sustainable value.`,
            `Accomplished ${jobTitle} recognized for transforming vision into action — spearheading initiatives that increased revenue by 35%, reduced costs by 20%, and improved team productivity across global markets. Committed to driving organizational success through strategic leadership and operational excellence.`,
          ]));
          break;
        }

        // ── Rewrite Bullets: 2 bộ bullet points cải thiện ──
        case 'rewrite-bullets': {
          resolve(JSON.stringify({
            versions: [
              [
                'Led cross-functional teams to successfully deliver 15+ projects on time and under budget, achieving 98% client satisfaction rate',
                'Optimized operational workflows resulting in 30% reduction in processing time and $500K annual cost savings',
                'Developed and mentored a team of 12 engineers, improving code quality metrics by 40% and reducing bug rates by 60%',
              ],
              [
                'Spearheaded the implementation of agile methodologies across 4 departments, accelerating delivery cycles by 25%',
                'Drove revenue growth of $2.3M through strategic partnerships and new market expansion initiatives',
                'Architected scalable infrastructure that supported 300% user growth while maintaining 99.9% uptime SLA',
              ],
            ],
          }));
          break;
        }

        // ── Gợi ý kỹ năng: lọc từ danh sách hardcode, loại trừ skills hiện tại ──
        case 'suggest-skills': {
          const allSkills = [
            'Strategic Planning', 'Cross-functional Leadership', 'Business Development',
            'Data Analysis', 'Project Management', 'Agile Methodologies',
            'Stakeholder Management', 'Process Optimization', 'Team Building',
            'Financial Modeling', 'Digital Transformation', 'Change Management',
            'Market Research', 'Product Strategy', 'Risk Management',
            'Contract Negotiation', 'P&L Management', 'Performance Metrics',
            'UX Strategy', 'Technical Architecture', 'DevOps', 'Cloud Computing',
          ];
          const existing = new Set(currentSkills.map(s => s.toLowerCase()));
          const suggested = allSkills.filter(s => !existing.has(s.toLowerCase())).slice(0, 12);
          resolve(JSON.stringify(suggested));
          break;
        }

        // ── Cover Letter: template có sẵn, chỉ thay company + job title ──
        case 'cover-letter': {
          const companyName = user.match(/Company: (.+?)(?:\n|$)/)?.[1] || 'the company';
          const jobTitle = user.match(/Position: (.+?)(?:\n|$)/)?.[1] || 'the position';
          resolve(JSON.stringify({
            subject: `Application for ${jobTitle} - ${companyName}`,
            body: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}. With a proven track record of delivering measurable results and driving operational excellence, I am confident in my ability to make an immediate impact on your team.\n\nThroughout my career, I have consistently demonstrated the ability to lead cross-functional initiatives, optimize processes, and deliver projects that exceed expectations. My experience aligns directly with the requirements outlined in your job description, and I am excited about the opportunity to bring my expertise to ${companyName}.\n\nI would welcome the opportunity to discuss how my background, skills, and enthusiasm can contribute to your organization's continued success. Thank you for considering my application.\n\nSincerely,\n[Your Name]`,
            salutation: 'Best regards',
          }));
          break;
        }

        // ── LinkedIn Import: trả về dữ liệu fake để test giao diện ──
        case 'linkedin-import': {
          resolve(JSON.stringify({
            fullName: 'John Doe',
            jobTitle: 'Senior Software Engineer',
            email: 'john@example.com',
            phone: '+1-555-0123',
            address: 'San Francisco, CA',
            summary: 'Experienced software engineer with 8+ years building scalable web applications.',
            linkedin: 'https://linkedin.com/in/johndoe',
            experiences: [
              { id: 'exp1', company: 'Tech Corp', position: 'Senior Engineer', startDate: '2020-01', endDate: 'Present', bulletPoints: '<ul><li>Led team of 5 engineers to deliver microservices platform</li><li>Reduced API response time by 40%</li></ul>' },
            ],
            educations: [
              { id: 'edu1', school: 'UC Berkeley', degree: 'BS Computer Science', startDate: '2012-09', endDate: '2016-05' },
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
          }));
          break;
        }

        // ── Generate Summary từ đầu (dùng cho nút Generate trong form) ──
        case 'generate-summary': {
          const jobTitle = user.match(/Target Role: (.+?)(?:\n|$)/)?.[1] || 'Professional';
          resolve(JSON.stringify([
            `Dynamic ${jobTitle} with extensive experience driving business growth through innovative solutions and strategic leadership. Proven ability to manage complex projects, build high-performing teams, and deliver results that exceed organizational objectives.`,
            `Results-oriented ${jobTitle} recognized for combining technical expertise with business acumen to solve complex challenges. Track record of implementing process improvements that reduced costs by 25% while increasing team productivity and stakeholder satisfaction.`,
            `Accomplished ${jobTitle} with a passion for excellence and a history of transformative impact. Expertise spans strategic planning, cross-functional collaboration, and data-driven decision making that consistently delivers measurable business outcomes.`,
          ]));
          break;
        }
        default:
          resolve(JSON.stringify({ error: 'Unknown mode' }));
      }
    }, delay);
  });
}
