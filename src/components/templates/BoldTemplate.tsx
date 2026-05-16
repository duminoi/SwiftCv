import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const BoldTemplate = ({ data, primaryColor = '#DC2626', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="flex flex-col lg:flex-row flex-1">
      <div className="w-full lg:w-[70%] flex flex-col">
        <div className="p-6 sm:p-8" style={{ backgroundColor: '#1E293B' }}>
          <h1 className="text-2xl sm:text-[38px] font-black text-white tracking-tight uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="text-sm sm:text-[16px] font-bold mt-1" style={{ color: primaryColor }}>{data.personalInfo.jobTitle || 'Job Title'}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-300">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
          </div>
        </div>
        <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5">
          {data.personalInfo.summary && (
            <section>
              <h2 className="text-[10px] uppercase font-black tracking-[0.25em]" style={{ color: primaryColor }}>Summary</h2>
              <div className="w-full h-0.5 mt-1 mb-2" style={{ backgroundColor: primaryColor }}></div>
              <div className="text-[11px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
            </section>
          )}
          {data.experiences.length > 0 && (
            <section>
              <h2 className="text-[10px] uppercase font-black tracking-[0.25em]" style={{ color: primaryColor }}>Experience</h2>
              <div className="w-full h-0.5 mt-1 mb-3" style={{ backgroundColor: primaryColor }}></div>
              <div className="space-y-4">
                {data.experiences.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-[12px] font-bold text-[#1a1a1a]">{exp.company || 'Company'}</h3>
                      <span className="text-[9px] font-bold" style={{ color: primaryColor }}>{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-[#555]">{exp.position || 'Position'}</p>
                    <div className="text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <div className="w-full lg:w-[30%] p-6 sm:p-8 flex flex-col gap-5" style={{ backgroundColor: '#FEF2F2' }}>
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em]" style={{ color: primaryColor }}>Education</h2>
            <div className="space-y-3 mt-2">
              {data.educations.map(edu => (
                <div key={edu.id}>
                  <h3 className="text-[11px] font-bold text-[#1a1a1a]">{edu.school || 'School'}</h3>
                  <p className="text-[10px] text-[#555]">{edu.degree || 'Degree'}</p>
                  <p className="text-[9px] text-[#888]">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-black tracking-[0.2em]" style={{ color: primaryColor }}>Skills</h2>
            <div className="space-y-1.5 mt-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="text-[10px] font-semibold text-[#333] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
