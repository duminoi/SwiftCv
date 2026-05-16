import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const GradientTemplate = ({ data, primaryColor = '#2563EB', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col lg:flex-row origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="w-full lg:w-[32%] p-6 sm:p-8 flex flex-col gap-5 text-white" style={{ background: 'linear-gradient(180deg, #2563EB, #7C3AED)' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3">
          <span className="text-2xl font-bold">{data.personalInfo.fullName?.charAt(0) || 'Y'}</span>
        </div>
        <h1 className="text-lg sm:text-[24px] font-bold leading-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-xs sm:text-[13px] text-white/80 mt-1">{data.personalInfo.jobTitle || 'Job Title'}</p>
      </div>
      <hr className="border-white/20" />
      <div className="space-y-2 text-[10px] sm:text-[11px] text-white/80">
        {data.personalInfo.email && <div className="flex items-center gap-2"><span className="text-white/50">📧</span>{data.personalInfo.email}</div>}
        {data.personalInfo.phone && <div className="flex items-center gap-2"><span className="text-white/50">📞</span>{data.personalInfo.phone}</div>}
        {data.personalInfo.address && <div className="flex items-center gap-2"><span className="text-white/50">📍</span><span className="truncate">{data.personalInfo.address}</span></div>}
        {data.personalInfo.linkedin && <div className="flex items-center gap-2"><span className="text-white/50">🔗</span><span className="truncate">{data.personalInfo.linkedin}</span></div>}
      </div>
      <hr className="border-white/20" />
      {data.educations.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/70 mb-2">Education</h2>
          {data.educations.map(edu => (
            <div key={edu.id} className="mb-3 last:mb-0">
              <h3 className="text-[11px] font-bold">{edu.school || 'School'}</h3>
              <p className="text-[10px] text-white/70">{edu.degree || 'Degree'}</p>
              <p className="text-[9px] text-white/50">{edu.startDate} - {edu.endDate}</p>
            </div>
          ))}
        </section>
      )}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.15em] text-white/70 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, i) => (
              <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white/15 text-white/90">{skill}</span>
            ))}
          </div>
        </section>
      )}
    </div>
    <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5 sm:gap-6">
      {data.personalInfo.summary && (
        <section>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>About</h2>
          <div className="w-8 h-0.5 mt-1 mb-2 rounded" style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}></div>
          <div className="text-[11px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
        </section>
      )}
      {data.experiences.length > 0 && (
        <section>
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Experience</h2>
          <div className="w-8 h-0.5 mt-1 mb-3 rounded" style={{ background: 'linear-gradient(90deg, #2563EB, #7C3AED)' }}></div>
          <div className="space-y-4">
            {data.experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-[12px] font-bold text-[#1a1a1a]">{exp.company || 'Company'}</h3>
                  <span className="text-[9px] text-[#777]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[10px] font-medium" style={{ color: '#7C3AED' }}>{exp.position || 'Position'}</p>
                <div className="text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  </div>
);
