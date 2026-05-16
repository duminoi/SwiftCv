import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const ElegantTemplate = ({ data, primaryColor = '#1C1917', fontFamily = 'serif' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #D4AF37, #1C1917 30%, #D4AF37 70%, #1C1917)' }}></div>
    <div className="p-8 sm:p-12 pt-6 sm:pt-10 text-center">
      <h1 className="text-2xl sm:text-[38px] font-bold tracking-wide" style={{ color: primaryColor }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-sm sm:text-[16px] mt-1 font-medium" style={{ color: '#D4AF37' }}>{data.personalInfo.jobTitle || 'Job Title'}</p>
      <div className="w-16 h-px mx-auto my-3 sm:my-4" style={{ backgroundColor: '#D4AF37' }}></div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] sm:text-[11px] text-[#666]">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
      </div>
    </div>
    <div className="flex-1 px-8 sm:px-12 pb-8 sm:pb-12">
      {data.personalInfo.summary && (
        <section className="mb-5 sm:mb-7">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-2" style={{ color: '#D4AF37' }}>Profile</h2>
          <div className="text-[11px] sm:text-[12px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
        </section>
      )}
      {data.experiences.length > 0 && (
        <section className="mb-5 sm:mb-7">
          <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-3" style={{ color: '#D4AF37' }}>Experience</h2>
          <div className="space-y-4">
            {data.experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-0.5">
                  <h3 className="text-[12px] sm:text-[14px] font-bold" style={{ color: primaryColor }}>{exp.company || 'Company'}</h3>
                  <span className="text-[9px] text-[#888]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-[#666] italic mb-1">{exp.position || 'Position'}</p>
                <div className="text-[11px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-8">
        {data.educations.length > 0 && (
          <section className="flex-1">
            <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-2" style={{ color: '#D4AF37' }}>Education</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="mb-3 last:mb-0">
                <h3 className="text-[11px] sm:text-[12px] font-bold" style={{ color: primaryColor }}>{edu.school || 'School'}</h3>
                <p className="text-[10px] text-[#666]">{edu.degree || 'Degree'}</p>
                <p className="text-[9px] text-[#999] mt-0.5">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </section>
        )}
        {data.skills.length > 0 && (
          <section className="flex-1">
            <h2 className="text-[10px] uppercase font-bold tracking-[0.25em] mb-2" style={{ color: '#D4AF37' }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] px-2.5 py-1 rounded font-medium border" style={{ borderColor: primaryColor, color: primaryColor }}>{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
