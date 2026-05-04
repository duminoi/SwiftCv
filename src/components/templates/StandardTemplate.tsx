import type { CVData } from '../../store/useCVStore';
import { Icon } from '../Icon';

export const StandardTemplate = ({ data }: { data: CVData }) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col font-cv-serif text-on-surface origin-top h-full">
    {/* CV Header */}
    <header className="border-b-2 border-primary pb-6 mb-6 p-10 pt-12">
      <h1 className="font-title-md text-display-lg font-bold text-on-surface tracking-tight leading-none mb-4">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
      <h2 className="font-title-md text-headline-md text-primary mb-6">{data.personalInfo.jobTitle || 'Job Title'}</h2>
      
      <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant font-title-md">
        {data.personalInfo.address && (
          <div className="flex items-center gap-1">
            <Icon name="location_on" className="text-[16px] text-primary" />
            {data.personalInfo.address}
          </div>
        )}
        {data.personalInfo.email && (
          <div className="flex items-center gap-1">
            <Icon name="mail" className="text-[16px] text-primary" />
            {data.personalInfo.email}
          </div>
        )}
        {data.personalInfo.phone && (
          <div className="flex items-center gap-1">
            <Icon name="phone" className="text-[16px] text-primary" />
            {data.personalInfo.phone}
          </div>
        )}
        {data.personalInfo.linkedin && (
          <div className="flex items-center gap-1">
            <Icon name="link" className="text-[16px] text-primary" />
            {data.personalInfo.linkedin}
          </div>
        )}
        {data.personalInfo.github && (
          <div className="flex items-center gap-1">
            <Icon name="link" className="text-[16px] text-primary" />
            {data.personalInfo.github}
          </div>
        )}
      </div>
    </header>

    {/* CV Body 2-Column */}
    <div className="flex flex-1 px-10 pb-12 gap-10">
      {/* Left Column (Meta & Secondary) */}
      <div className="w-1/3 flex flex-col gap-8 border-r border-outline-variant pr-8">
        {/* Education Section */}
        {data.educations.length > 0 && (
          <section className="relative bg-primary-container/10 -m-4 p-4 rounded border-l-4 border-primary">
            <h3 className="font-title-md text-title-md font-bold uppercase tracking-widest text-on-surface mb-4">Education</h3>
            {data.educations.map((edu) => (
              <div key={edu.id} className="mb-5 last:mb-0">
                <h4 className="font-bold text-on-surface text-base">{edu.school || 'School'}</h4>
                <div className="text-primary font-medium text-sm mb-1">{edu.degree || 'Degree'}</div>
                <div className="text-on-surface-variant text-xs mb-2">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </section>
        )}

        {data.skills.length > 0 && (
          <section>
            <h3 className="font-title-md text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 mt-4">Skills</h3>
            <ul className="flex flex-col gap-2 text-sm text-on-surface-variant">
              {data.skills.map((skill, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0"></span>
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right Column (Main Content) */}
      <div className="w-2/3 flex flex-col gap-8">
        {data.personalInfo.summary && (
          <section>
            <h3 className="font-title-md text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 border-b border-outline-variant pb-2">Professional Summary</h3>
            <div 
              className="text-on-surface-variant leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
            />
          </section>
        )}

        {data.experiences.length > 0 && (
          <section>
            <h3 className="font-title-md text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 border-b border-outline-variant pb-2">Experience</h3>
            <div className="flex flex-col gap-6">
              {data.experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-on-surface text-lg">{exp.company || 'Company'}</h4>
                    <span className="text-sm text-primary font-medium">{exp.startDate} - {exp.endDate}</span>
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
