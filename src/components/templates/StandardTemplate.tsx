import type { CVData } from '../../store/useCVStore';
import { Icon } from '../Icon';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const StandardTemplate = ({ data, primaryColor = '#0061a4', fontFamily = 'serif' }: Props) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col text-on-surface origin-top h-full" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <header className="border-b-2 pb-6 mb-6 p-10 pt-12" style={{ borderColor: primaryColor }}>
      <div className="flex items-start gap-6">
        {data.personalInfo.photo && (
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: primaryColor }}>
            <img src={data.personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-display-lg font-bold text-on-surface tracking-tight leading-none mb-4">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
          <h2 className="text-headline-md mb-6" style={{ color: primaryColor }}>{data.personalInfo.jobTitle || 'Job Title'}</h2>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
        {data.personalInfo.address && (
          <div className="flex items-center gap-1">
            <Icon name="location_on" className="text-[16px]" style={{ color: primaryColor }} />
            {data.personalInfo.address}
          </div>
        )}
        {data.personalInfo.email && (
          <div className="flex items-center gap-1">
            <Icon name="mail" className="text-[16px]" style={{ color: primaryColor }} />
            {data.personalInfo.email}
          </div>
        )}
        {data.personalInfo.phone && (
          <div className="flex items-center gap-1">
            <Icon name="phone" className="text-[16px]" style={{ color: primaryColor }} />
            {data.personalInfo.phone}
          </div>
        )}
        {data.personalInfo.linkedin && (
          <div className="flex items-center gap-1">
            <Icon name="link" className="text-[16px]" style={{ color: primaryColor }} />
            {data.personalInfo.linkedin}
          </div>
        )}
        {data.personalInfo.github && (
          <div className="flex items-center gap-1">
            <Icon name="link" className="text-[16px]" style={{ color: primaryColor }} />
            {data.personalInfo.github}
          </div>
        )}
      </div>
    </header>

    <div className="flex flex-1 px-10 pb-12 gap-10">
      <div className="w-1/3 flex flex-col gap-8 border-r border-outline-variant pr-8">
        {data.educations.length > 0 && (
          <section className="relative -m-4 p-4 rounded border-l-4" style={{ backgroundColor: `${primaryColor}0a`, borderLeftColor: primaryColor }}>
            <h3 className="text-title-md font-bold uppercase tracking-widest text-on-surface mb-4">Education</h3>
            {data.educations.map((edu) => (
              <div key={edu.id} className="mb-5 last:mb-0">
                <h4 className="font-bold text-on-surface text-base">{edu.school || 'School'}</h4>
                <div className="font-medium text-sm mb-1" style={{ color: primaryColor }}>{edu.degree || 'Degree'}</div>
                <div className="text-on-surface-variant text-xs mb-2">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h3 className="text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 mt-4">Skills</h3>
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              {data.skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }}></span>
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="w-2/3 flex flex-col gap-8">
        {data.personalInfo.summary && (
          <section>
            <h3 className="text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 border-b border-outline-variant pb-2">Professional Summary</h3>
            <div
              className="text-on-surface-variant leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
            />
          </section>
        )}

        {data.experiences.length > 0 && (
          <section>
            <h3 className="text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 border-b border-outline-variant pb-2">Experience</h3>
            <div className="flex flex-col gap-6">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-on-surface text-lg">{exp.company || 'Company'}</h4>
                    <span className="text-sm font-medium" style={{ color: primaryColor }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-on-surface-variant italic mb-3">{exp.position || 'Position'}</div>
                  <div
                    className="text-on-surface-variant space-y-2 leading-relaxed prose prose-sm max-w-none bullet-points-container"
                    dangerouslySetInnerHTML={{ __html: exp.bulletPoints }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);
