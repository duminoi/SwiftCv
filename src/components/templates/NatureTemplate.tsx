import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const NatureTemplate = ({ data, primaryColor = '#2E8B57', fontFamily = 'serif' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="p-8 sm:p-12 pb-6 text-center" style={{ background: 'linear-gradient(180deg, #2E8B57, #1a6b3a)' }}>
      <h1 className="text-xl sm:text-[32px] font-bold text-white tracking-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-sm sm:text-[15px] text-green-100 mt-1">{data.personalInfo.jobTitle || 'Job Title'}</p>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3 text-[10px] text-green-50/80">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
      </div>
    </div>
    <div className="flex-1 p-8 sm:p-10">
      {data.personalInfo.summary && (
        <section className="mb-5 sm:mb-7">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Profile</h2>
          <div className="w-10 h-0.5 mt-1.5 mb-2 rounded" style={{ backgroundColor: primaryColor }}></div>
          <div className="text-[11px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
        </section>
      )}
      {data.experiences.length > 0 && (
        <section className="mb-5 sm:mb-7">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Experience</h2>
          <div className="w-10 h-0.5 mt-1.5 mb-3 rounded" style={{ backgroundColor: primaryColor }}></div>
          <div className="space-y-4">
            {data.experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="text-[12px] font-bold text-[#1a1a1a]">{exp.company || 'Company'}</h3>
                      <span className="text-[9px] text-[#777]">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <p className="text-[10px] font-medium text-[#555]">{exp.position || 'Position'}</p>
                    <div className="text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {data.educations.length > 0 && (
          <section className="flex-1">
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Education</h2>
            <div className="w-8 h-0.5 mt-1.5 mb-2 rounded" style={{ backgroundColor: primaryColor }}></div>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <h3 className="text-[11px] font-bold text-[#1a1a1a]">{edu.school || 'School'}</h3>
                <p className="text-[10px] text-[#555]">{edu.degree || 'Degree'}</p>
                <p className="text-[9px] text-[#888] mt-0.5">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section className="flex-1">
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: primaryColor }}>Skills</h2>
            <div className="w-8 h-0.5 mt-1.5 mb-2 rounded" style={{ backgroundColor: primaryColor }}></div>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: primaryColor }}>{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
