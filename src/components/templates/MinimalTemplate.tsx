import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const MinimalTemplate = ({ data, primaryColor = '#18181B', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="p-10 sm:p-14 pb-6 sm:pb-8 text-center">
      <h1 className="text-2xl sm:text-[40px] font-light tracking-tight" style={{ color: primaryColor }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-sm sm:text-[16px] text-[#71717A] mt-1 font-light tracking-wide">{data.personalInfo.jobTitle || 'Job Title'}</p>
      <div className="w-12 h-px mx-auto my-4 sm:my-5" style={{ backgroundColor: primaryColor }}></div>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[10px] sm:text-[11px] text-[#A1A1AA]">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
      </div>
    </div>
    <div className="flex-1 px-10 sm:px-14 pb-10 sm:pb-14">
      {data.personalInfo.summary && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA] mb-2">About</h2>
          <div className="text-[11px] sm:text-[12px] leading-relaxed text-[#52525B] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
        </section>
      )}
      {data.experiences.length > 0 && (
        <section className="mb-6 sm:mb-8">
          <h2 className="text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA] mb-3">Experience</h2>
          <div className="space-y-5">
            {data.experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h3 className="text-[12px] sm:text-[14px] font-medium" style={{ color: primaryColor }}>{exp.company || 'Company'}</h3>
                  <span className="text-[9px] text-[#A1A1AA]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[10px] text-[#71717A] mb-1">{exp.position || 'Position'}</p>
                <div className="text-[11px] leading-relaxed text-[#52525B] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
        {data.educations.length > 0 && (
          <section className="flex-1">
            <h2 className="text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA] mb-2">Education</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <h3 className="text-[11px] font-medium" style={{ color: primaryColor }}>{edu.school || 'School'}</h3>
                <p className="text-[10px] text-[#71717A]">{edu.degree || 'Degree'}</p>
                <p className="text-[9px] text-[#A1A1AA] mt-0.5">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section className="flex-1">
            <h2 className="text-[9px] uppercase tracking-[0.3em] text-[#A1A1AA] mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] text-[#52525B] border-b border-[#D4D4D8] pb-0.5">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
