const GEMINI_KEY = process.env.GEMINI_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

export async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  // Try OpenRouter first (has free models)
  if (OPENROUTER_KEY) {
    try {
      return await callOpenRouter(systemPrompt, userPrompt);
    } catch (e) {
      console.warn('OpenRouter failed, falling back...', e);
    }
  }

  // Try Gemini
  if (GEMINI_KEY) {
    try {
      return await callGemini(systemPrompt, userPrompt);
    } catch (e) {
      console.warn('Gemini failed, falling back to demo...', e);
    }
  }

  // Demo mode: no API key needed
  return callDemoAI(systemPrompt, userPrompt);
}

async function callGemini(system: string, user: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${system}\n\n${user}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

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

// ── Demo mode: no API key needed, returns realistic template responses ──
function callDemoAI(system: string, user: string): Promise<string> {
  const mode = system.includes('how well this CV matches') ? 'match'
    : system.includes('ATS optimization') ? 'analyze'
    : system.includes('CV writer') && system.includes('3') ? 'rewrite-summary'
    : system.includes('CV writer') ? 'rewrite-bullets'
    : system.includes('career advisor') ? 'suggest-skills'
    : 'analyze';

  // Extract info from user prompt for contextual responses
  const hasMetrics = /\d+%|\$|[\d]+ (users|customers|revenue|clients)/i.test(user);
  const bulletCount = (user.match(/•|bullet|achieved|led|managed/gi) || []).length;
  const skillsMatch = user.match(/Current skills: (.*?)(?:\n|$)/);
  const currentSkills = skillsMatch ? skillsMatch[1].split(', ').filter(Boolean) : [];

  const delay = 800 + Math.random() * 1200;

  return new Promise(resolve => {
    setTimeout(() => {
      switch (mode) {
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
            experienceGpa: 'Your experience level appears aligned with the seniority of this role.',
          }));
          break;
        }
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
        case 'rewrite-summary': {
          const jobTitle = user.match(/Job Title: (.+?)(?:\n|$)/)?.[1] || 'Professional';
          resolve(JSON.stringify([
            `Results-driven ${jobTitle} with a proven track record of driving operational excellence and delivering measurable business impact. Adept at leading cross-functional teams, optimizing processes, and implementing strategic initiatives that accelerate growth and maximize profitability.`,
            `Strategic ${jobTitle} with 10+ years of experience in scaling operations, building high-performance teams, and executing data-driven strategies. Passionate about leveraging technology and innovation to solve complex business challenges and deliver sustainable value.`,
            `Accomplished ${jobTitle} recognized for transforming vision into action — spearheading initiatives that increased revenue by 35%, reduced costs by 20%, and improved team productivity across global markets. Committed to driving organizational success through strategic leadership and operational excellence.`,
          ]));
          break;
        }
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
        default:
          resolve(JSON.stringify({ error: 'Unknown mode' }));
      }
    }, delay);
  });
}
