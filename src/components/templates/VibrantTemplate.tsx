import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const VibrantTemplate = ({ data, primaryColor = '#EC4899', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="p-6 sm:p-8" style={{ background: 'linear-gradient(135deg, #EC4899, #06B6D4)' }}>
      <h1 className="text-2xl sm:text-[36px] font-bold text-white tracking-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-sm sm:text-[16px] text-white/90 mt-1 font-medium">{data.personalInfo.jobTitle || 'Job Title'}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[10px] text-white/80">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
      </div>
    </div>
    <div className="flex flex-col lg:flex-row flex-1">
      <div className="w-full lg:w-[60%] p-6 sm:p-8 flex flex-col gap-5">
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>About Me</h2>
            <div className="text-[11px] leading-relaxed text-[#444] mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
          </section>
        )}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Experience</h2>
            <div className="space-y-4 mt-3">
              {data.experiences.map(exp => (
                <div key={exp.id} className="border-l-2 pl-3" style={{ borderColor: primaryColor }}>
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-[12px] font-bold text-[#1a1a1a]">{exp.company || 'Company'}</h3>
                    <span className="text-[9px] text-[#888]">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-medium" style={{ color: '#06B6D4' }}>{exp.position || 'Position'}</p>
                  <div className="text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="w-full lg:w-[40%] p-6 sm:p-8 flex flex-col gap-5" style={{ backgroundColor: '#FFF5F9' }}>
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Education</h2>
            <div className="space-y-3 mt-2">
              {data.educations.map(edu => (
                <div key={edu.id} className="bg-white rounded-lg p-3 shadow-sm border border-[#06B6D4]/10">
                  <h3 className="text-[11px] font-bold text-[#1a1a1a]">{edu.school || 'School'}</h3>
                  <p className="text-[10px]" style={{ color: primaryColor }}>{edu.degree || 'Degree'}</p>
                  <p className="text-[9px] text-[#888] mt-0.5">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-full font-medium text-white" style={{ background: `linear-gradient(135deg, #EC4899, #06B6D4)` }}>{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
