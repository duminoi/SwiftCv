import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const ModernTemplate = ({ data, primaryColor = '#2563eb', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="p-6 sm:p-10 pb-0" style={{ backgroundColor: primaryColor }}>
      <div className="text-white">
        <h1 className="text-xl sm:text-[36px] font-bold tracking-tight leading-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-sm sm:text-[16px] text-white/80 mt-1 font-medium">{data.personalInfo.jobTitle || 'Job Title'}</p>
      </div>
      <div className="flex flex-wrap gap-x-3 sm:gap-x-5 gap-y-1 mt-3 sm:mt-4 text-[10px] sm:text-[11px] text-white/70 pb-4 sm:pb-6">
        {data.personalInfo.email && <span className="truncate max-w-[120px] sm:max-w-none">{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span className="truncate max-w-[120px] sm:max-w-none">{data.personalInfo.address}</span>}
        {data.personalInfo.linkedin && <span className="truncate max-w-[120px] sm:max-w-none">{data.personalInfo.linkedin}</span>}
      </div>
    </div>
    <div className="flex flex-col lg:flex-row flex-1">
      <div className="w-full lg:w-[65%] p-6 sm:p-8 pr-4 sm:pr-6 flex flex-col gap-5 sm:gap-7">
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] mb-2 sm:mb-3" style={{ color: primaryColor }}>Profile</h2>
            <div className="text-[11px] sm:text-[12px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
          </section>
        )}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] mb-3 sm:mb-4" style={{ color: primaryColor }}>Experience</h2>
            <div className="space-y-4 sm:space-y-5">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                    <h3 className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">{exp.company || 'Company'}</h3>
                    <span className="text-[9px] sm:text-[10px] text-[#777]" style={{ color: primaryColor }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-[#555] italic mb-1.5">{exp.position || 'Position'}</p>
                  <div className="text-[11px] sm:text-[11.5px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="w-full lg:w-[35%] p-6 sm:p-8 pl-4 sm:pl-6 flex flex-col gap-5 sm:gap-7" style={{ backgroundColor: '#f8fafc' }}>
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] mb-2 sm:mb-3" style={{ color: primaryColor }}>Education</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 sm:mb-4 last:mb-0">
                <h3 className="text-[11px] sm:text-[12px] font-bold text-[#1a1a1a]">{edu.school || 'School'}</h3>
                <p className="text-[10px] sm:text-[11px] text-[#555]">{edu.degree || 'Degree'}</p>
                <p className="text-[9px] sm:text-[10px] text-[#888] mt-0.5">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.2em] mb-2 sm:mb-3" style={{ color: primaryColor }}>Skills</h2>
            <div className="flex flex-wrap gap-1 sm:gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
