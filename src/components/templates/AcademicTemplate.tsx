import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const AcademicTemplate = ({ data, primaryColor = '#0D9488', fontFamily = 'serif' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="p-6 sm:p-10" style={{ backgroundColor: primaryColor }}>
      <div className="text-white text-center">
        <h1 className="text-xl sm:text-[34px] font-bold tracking-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-sm sm:text-[15px] text-teal-100 mt-1 font-medium">{data.personalInfo.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-[10px] text-teal-50/80">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
        </div>
      </div>
    </div>
    <div className="flex flex-col lg:flex-row flex-1">
      <div className="w-full lg:w-[62%] p-6 sm:p-8 pr-4 sm:pr-6 flex flex-col gap-5 sm:gap-6">
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Research Interest</h2>
            <div className="text-[11px] sm:text-[12px] leading-relaxed text-[#444] mt-2 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
          </section>
        )}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Academic Experience</h2>
            <div className="space-y-4 sm:space-y-5 mt-2">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                    <h3 className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">{exp.company || 'Institution'}</h3>
                    <span className="text-[9px] sm:text-[10px] text-[#777]">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] italic" style={{ color: primaryColor }}>{exp.position || 'Role'}</p>
                  <div className="text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="w-full lg:w-[38%] p-6 sm:p-8 pl-4 sm:pl-6 flex flex-col gap-5 sm:gap-6" style={{ backgroundColor: '#F0FDFA' }}>
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Education</h2>
            <div className="space-y-3 sm:space-y-4 mt-2">
              {data.educations.map(edu => (
                <div key={edu.id}>
                  <h3 className="text-[11px] sm:text-[12px] font-bold text-[#1a1a1a]">{edu.school || 'University'}</h3>
                  <p className="text-[10px] sm:text-[11px]" style={{ color: primaryColor }}>{edu.degree || 'Degree'}</p>
                  <p className="text-[9px] text-[#777] mt-0.5">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.15em]" style={{ color: primaryColor }}>Expertise</h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: primaryColor, color: primaryColor }}>{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
