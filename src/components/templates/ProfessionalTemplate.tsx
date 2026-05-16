import type { CVData } from '../../store/useCVStore';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const ProfessionalTemplate = ({ data, primaryColor = '#0F172A', fontFamily = 'sans' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="p-6 sm:p-8 pb-4 sm:pb-5" style={{ backgroundColor: primaryColor }}>
      <h1 className="text-xl sm:text-[32px] font-bold text-white tracking-tight">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-sm sm:text-[15px] text-blue-200 mt-0.5 font-medium">{data.personalInfo.jobTitle || 'Job Title'}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-blue-100/70">
        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
        {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
      </div>
    </div>
    <div className="flex flex-col lg:flex-row flex-1">
      <div className="w-full lg:w-[63%] p-6 sm:p-8 pr-4 flex flex-col gap-5">
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: '#1E40AF' }}>Professional Summary</h2>
            <div className="w-8 h-0.5 mt-1.5 mb-2" style={{ backgroundColor: '#1E40AF' }}></div>
            <div className="text-[11px] leading-relaxed text-[#444] prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }} />
          </section>
        )}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: '#1E40AF' }}>Experience</h2>
            <div className="w-8 h-0.5 mt-1.5 mb-3" style={{ backgroundColor: '#1E40AF' }}></div>
            <div className="space-y-4">
              {data.experiences.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-[12px] font-bold text-[#1a1a1a]">{exp.position || 'Position'}</h3>
                    <span className="text-[9px] text-[#777] shrink-0">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-[10px] font-medium" style={{ color: '#1E40AF' }}>{exp.company || 'Company'}</p>
                  <div className="text-[11px] leading-relaxed text-[#444] mt-1 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: exp.bulletPoints }} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <div className="w-full lg:w-[37%] p-6 sm:p-8 pl-4 flex flex-col gap-5" style={{ backgroundColor: '#F1F5F9' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1E40AF' }}>
          <span className="text-white text-lg font-bold">{data.personalInfo.fullName?.charAt(0) || 'Y'}</span>
        </div>
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: '#1E40AF' }}>Education</h2>
            <div className="w-6 h-0.5 mt-1.5 mb-2" style={{ backgroundColor: '#1E40AF' }}></div>
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
          <section>
            <h2 className="text-[10px] uppercase font-bold tracking-[0.2em]" style={{ color: '#1E40AF' }}>Skills</h2>
            <div className="w-6 h-0.5 mt-1.5 mb-2" style={{ backgroundColor: '#1E40AF' }}></div>
            <div className="space-y-1.5">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-[#333]">{skill}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(60 + Math.abs(skill.length % 40), 100)}%`, backgroundColor: '#1E40AF' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
