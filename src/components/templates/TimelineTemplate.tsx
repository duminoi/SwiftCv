import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const TimelineTemplate = ({ data, primaryColor = '#059669', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="text-center p-6 sm:p-10 pb-4 sm:pb-6 border-b-4" style={{ borderBottomColor: primaryColor }}>
      <h1 className="text-xl sm:text-[38px] font-bold tracking-tight text-[#1a1a1a]">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-sm sm:text-[14px] font-medium mt-1" style={{ color: primaryColor }}>{data.personalInfo.jobTitle || 'Job Title'}</p>
      <div className="flex justify-center flex-wrap gap-x-3 sm:gap-x-4 gap-y-1 mt-2 sm:mt-3 text-[10px] sm:text-[11px] text-[#666]">
        {data.personalInfo.email && <span className="truncate max-w-[120px] sm:max-w-none">{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span className="truncate max-w-[120px] sm:max-w-none">{data.personalInfo.address}</span>}
      </div>
    </div>
    <div className="p-6 sm:p-10 flex-1">
      {data.personalInfo.summary && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-2 sm:mb-3" style={{ color: primaryColor }}>Professional Summary</h2>
          <div className="text-[11px] sm:text-[12px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
        </section>
      )}
      {data.experiences.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-3 sm:mb-4" style={{ color: primaryColor }}>Experience</h2>
          <div className="space-y-0">
            {data.experiences.map((exp, idx) => (
              <div key={exp.id} className="flex gap-3 sm:gap-5 pb-4 sm:pb-6 relative">
                <div className="flex flex-col items-center w-14 sm:w-20 shrink-0">
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#888] uppercase tracking-wide whitespace-nowrap">{exp.startDate || ''}</span>
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 sm:mt-1.5 mb-1 sm:mb-1.5 ring-2 ring-white z-10" style={{ backgroundColor: primaryColor }}></div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-[#888] uppercase tracking-wide whitespace-nowrap">{exp.endDate || ''}</span>
                </div>
                {idx < data.experiences.length - 1 && (
                  <div className="absolute left-[46px] sm:left-[70px] top-4 sm:top-6 bottom-0 w-0.5" style={{ backgroundColor: `${primaryColor}30` }}></div>
                )}
                <div className="flex-1 pb-2">
                  <h3 className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">{exp.company || 'Company'}</h3>
                  <p className="text-[10px] sm:text-[11px] italic mb-2" style={{ color: primaryColor }}>{exp.position || 'Position'}</p>
                  <div className="text-[11px] sm:text-[11.5px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-4 sm:mt-6">
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-2 sm:mb-3" style={{ color: primaryColor }}>Education</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-2 sm:mb-3">
                <h3 className="text-[11px] sm:text-[12px] font-bold text-[#1a1a1a]">{edu.school || 'School'}</h3>
                <p className="text-[10px] sm:text-[11px] text-[#555]">{edu.degree || 'Degree'}</p>
                <p className="text-[9px] sm:text-[10px] text-[#888]">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-2 sm:mb-3" style={{ color: primaryColor }}>Skills</h2>
            <div className="space-y-1 sm:space-y-1.5">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 h-1 sm:h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: '100%', backgroundColor: primaryColor }}></div>
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-[#444] w-16 sm:w-24 text-right truncate">{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
