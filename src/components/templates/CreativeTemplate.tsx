import type { CVData } from '../../store/useCVStore';
import { Icon } from '../Icon';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const CreativeTemplate = ({ data, primaryColor = '#0061a4', fontFamily = 'serif' }: Props) => {
  const tertiaryColor = primaryColor;

  return (
    <div className="bg-white w-full min-h-[1100px] flex flex-col relative overflow-hidden h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
      <div className="absolute top-0 right-0 w-2/3 h-48 sm:h-64 bg-surface-container-highest rounded-bl-xl z-0"></div>
      <div className="absolute top-0 right-0 w-1/3 h-32 sm:h-48 rounded-bl-xl z-0 opacity-10" style={{ backgroundColor: tertiaryColor }}></div>

      <div className="relative z-10 p-6 sm:p-12 flex flex-col h-full gap-6 sm:gap-8">
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end pb-6 sm:pb-8 border-b border-surface-variant gap-4">
          <div className="max-w-full sm:max-w-[60%]">
            <h1 className="text-xl sm:text-display-lg text-on-surface font-black tracking-tighter leading-none mb-2 sm:mb-4 uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className="text-base sm:text-headline-md" style={{ color: tertiaryColor }}>{data.personalInfo.jobTitle || 'Job Title'}</p>
          </div>
          <div className="text-left sm:text-right space-y-1">
            {data.personalInfo.address && <p className="text-on-surface-variant text-xs sm:text-sm">{data.personalInfo.address}</p>}
            {data.personalInfo.email && <p className="text-on-surface-variant text-xs sm:text-sm">{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p className="text-on-surface-variant text-xs sm:text-sm">{data.personalInfo.phone}</p>}
            {data.personalInfo.portfolio && <p className="text-on-surface-variant text-xs sm:text-sm">{data.personalInfo.portfolio}</p>}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 flex-1">
          <div className="w-full lg:w-2/3 space-y-8 sm:space-y-10">
            {data.experiences.length > 0 && (
              <section>
                <h2 className="text-title-md text-on-surface uppercase tracking-widest border-b-2 border-on-surface inline-block pb-1 mb-4 sm:mb-6">Experience</h2>
                <div className="space-y-4 sm:space-y-6">
                  {data.experiences.map((exp, i) => (
                    <div key={exp.id} className="relative pl-4 sm:pl-6 border-l border-surface-variant">
                      <div className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full -left-[3.5px] sm:-left-[5px] top-2 ${i === 0 ? '' : 'bg-surface-variant'}`}
                        style={i === 0 ? { backgroundColor: primaryColor } : undefined}
                      ></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                        <h3 className="text-title-md text-on-surface font-bold">{exp.position}</h3>
                        <span className="text-secondary text-xs sm:text-sm">{exp.startDate} — {exp.endDate}</span>
                      </div>
                      <p className="font-bold mb-2 text-sm sm:text-base" style={{ color: tertiaryColor }}>{exp.company}</p>
                      <div
                        className="text-on-surface-variant prose prose-sm max-w-none text-xs sm:text-sm"
                        dangerouslySetInnerHTML={{ __html: exp.bulletPoints }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {data.educations.length > 0 && (
              <section>
                <h2 className="text-title-md text-on-surface uppercase tracking-widest border-b-2 border-on-surface inline-block pb-1 mb-4 sm:mb-6">Education</h2>
                <div className="space-y-4 sm:space-y-6">
                  {data.educations.map(edu => (
                    <div key={edu.id} className="relative pl-4 sm:pl-6 border-l border-surface-variant">
                      <div className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-surface-variant rounded-full -left-[3.5px] sm:-left-[5px] top-2"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1 gap-1">
                        <h3 className="text-title-md text-on-surface font-bold">{edu.degree}</h3>
                        <span className="text-secondary text-xs sm:text-sm">{edu.startDate} — {edu.endDate}</span>
                      </div>
                      <p className="font-bold mb-1 text-sm sm:text-base" style={{ color: tertiaryColor }}>{edu.school}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="w-full lg:w-1/3 space-y-8 sm:space-y-10">
            {data.skills.length > 0 && (
              <section className="bg-surface-bright p-4 sm:p-6 rounded-lg border border-tertiary-fixed-dim shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 rounded-bl-full z-0 opacity-50" style={{ backgroundColor: tertiaryColor }}></div>
                <h2 className="text-title-md uppercase tracking-widest mb-4 sm:mb-6 relative z-10 flex items-center gap-2" style={{ color: tertiaryColor }}>
                  <Icon name="psychology" className="text-[16px] sm:text-[18px]" /> Skills
                </h2>
                <div className="space-y-5 relative z-10">
                  <div className="flex flex-wrap gap-1">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="bg-surface-container px-2 py-0.5 rounded text-on-surface-variant border border-outline-variant text-xs">{skill}</span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {data.personalInfo.summary && (
              <section>
                <h2 className="text-title-md text-on-surface uppercase tracking-widest border-b-2 border-on-surface inline-block pb-1 mb-4 sm:mb-6">Profile</h2>
                <div
                  className="text-on-surface-variant leading-relaxed text-justify prose prose-sm max-w-none text-xs sm:text-sm"
                  dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
