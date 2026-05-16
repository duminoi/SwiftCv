import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const CompactTemplate = ({ data, primaryColor = '#334155', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
      <div>
        <h1 className="text-lg sm:text-[28px] font-bold" style={{ color: primaryColor }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-xs sm:text-[13px] text-[#64748B] font-medium mt-0.5">{data.personalInfo.jobTitle || 'Job Title'}</p>
      </div>
      <div className="text-right text-[9px] sm:text-[10px] text-[#64748B] leading-relaxed">
        {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
        {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
        {data.personalInfo.address && <div className="max-w-[180px] truncate">{data.personalInfo.address}</div>}
      </div>
    </div>
    <hr style={{ borderColor: primaryColor, opacity: 0.3 }} />
    <div className="flex flex-col lg:flex-row flex-1 p-4 sm:p-6 gap-4 sm:gap-6">
      <div className="w-full lg:w-[58%] flex flex-col gap-3 sm:gap-4">
        {data.personalInfo.summary && (
          <section>
            <h3 className="text-[9px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Summary</h3>
            <div className="text-[10px] sm:text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
          </section>
        )}
        {data.experiences.length > 0 && (
          <section>
            <h3 className="text-[9px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Experience</h3>
            <div className="space-y-3 mt-1">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-bold text-[#1a1a1a]">{exp.position || 'Position'}</span>
                    <span className="text-[8px] text-[#888]">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[9px] font-medium" style={{ color: primaryColor }}>{exp.company || 'Company'}</p>
                  <div className="text-[10px] leading-relaxed text-[#444] mt-0.5 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="w-full lg:w-[42%] flex flex-col gap-3 sm:gap-4">
        {data.educations.length > 0 && (
          <section>
            <h3 className="text-[9px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Education</h3>
            <div className="space-y-2 mt-1">
              {data.educations.map(edu => (
                <div key={edu.id}>
                  <div className="text-[10px] font-semibold text-[#1a1a1a]">{edu.school || 'School'}</div>
                  <div className="text-[9px] text-[#555]">{edu.degree || 'Degree'}</div>
                  <div className="text-[8px] text-[#888]">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <h3 className="text-[9px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Skills</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${primaryColor}10`, color: primaryColor }}>{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
