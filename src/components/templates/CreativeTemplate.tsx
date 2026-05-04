import type { CVData } from '../../store/useCVStore';
import { Icon } from '../Icon';

export const CreativeTemplate = ({ data }: { data: CVData }) => (
  <div className="bg-white w-full min-h-[1100px] flex flex-col relative overflow-hidden h-full">
    {/* Decorative Asymmetric Header Background */}
    <div className="absolute top-0 right-0 w-2/3 h-64 bg-surface-container-highest rounded-bl-xl z-0"></div>
    <div className="absolute top-0 right-0 w-1/3 h-48 bg-tertiary rounded-bl-xl z-0 opacity-10"></div>
    
    {/* Resume Content */}
    <div className="relative z-10 p-12 flex flex-col h-full gap-8">
      {/* Header */}
      <header className="flex justify-between items-end pb-8 border-b border-surface-variant">
        <div className="max-w-[60%]">
          <h1 className="font-display-lg text-display-lg text-on-surface font-black tracking-tighter leading-none mb-4 uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className="font-headline-md text-headline-md text-tertiary">{data.personalInfo.jobTitle || 'Job Title'}</p>
        </div>
        <div className="text-right space-y-1">
          {data.personalInfo.address && <p className="font-cv-serif text-cv-serif text-on-surface-variant">{data.personalInfo.address}</p>}
          {data.personalInfo.email && <p className="font-cv-serif text-cv-serif text-on-surface-variant">{data.personalInfo.email}</p>}
          {data.personalInfo.phone && <p className="font-cv-serif text-cv-serif text-on-surface-variant">{data.personalInfo.phone}</p>}
          {data.personalInfo.portfolio && <p className="font-cv-serif text-cv-serif text-on-surface-variant">{data.personalInfo.portfolio}</p>}
        </div>
      </header>

      {/* Two Column Layout for Body */}
      <div className="flex gap-12 flex-1">
        {/* Left Column (Main Content) */}
        <div className="w-2/3 space-y-10">
          {/* Experience */}
          {data.experiences.length > 0 && (
            <section>
              <h2 className="font-title-md text-title-md text-on-surface uppercase tracking-widest border-b-2 border-on-surface inline-block pb-1 mb-6">Experience</h2>
              <div className="space-y-6">
                {data.experiences.map((exp, i) => (
                  <div key={exp.id} className="relative pl-6 border-l border-surface-variant">
                    <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-2 ${i === 0 ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">{exp.position}</h3>
                      <span className="font-cv-serif text-cv-serif text-secondary">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p className="font-cv-serif text-cv-serif text-tertiary font-bold mb-2">{exp.company}</p>
                    <div 
                      className="font-cv-serif text-cv-serif text-on-surface-variant prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: exp.bulletPoints }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.educations.length > 0 && (
            <section>
              <h2 className="font-title-md text-title-md text-on-surface uppercase tracking-widest border-b-2 border-on-surface inline-block pb-1 mb-6">Education</h2>
              <div className="space-y-6">
                {data.educations.map(edu => (
                  <div key={edu.id} className="relative pl-6 border-l border-surface-variant">
                    <div className="absolute w-2 h-2 bg-surface-variant rounded-full -left-[5px] top-2"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">{edu.degree}</h3>
                      <span className="font-cv-serif text-cv-serif text-secondary">{edu.startDate} — {edu.endDate}</span>
                    </div>
                    <p className="font-cv-serif text-cv-serif text-tertiary font-bold mb-1">{edu.school}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar Content) */}
        <div className="w-1/3 space-y-10">
          {/* Skills */}
          {data.skills.length > 0 && (
            <section className="bg-surface-bright p-6 rounded-lg border border-tertiary-fixed-dim shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-tertiary-fixed rounded-bl-full z-0 opacity-50"></div>
              <h2 className="font-title-md text-title-md text-tertiary uppercase tracking-widest mb-6 relative z-10 flex items-center gap-2">
                <Icon name="psychology" className="text-[18px]" /> Skills
              </h2>
              <div className="space-y-5 relative z-10">
                <div className="flex flex-wrap gap-1">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="text-cv-serif text-cv-serif bg-surface-container px-2 py-0.5 rounded text-on-surface-variant border border-outline-variant">{skill}</span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* About */}
          {data.personalInfo.summary && (
            <section>
              <h2 className="font-title-md text-title-md text-on-surface uppercase tracking-widest border-b-2 border-on-surface inline-block pb-1 mb-6">Profile</h2>
              <div 
                className="font-cv-serif text-cv-serif text-on-surface-variant leading-relaxed text-justify prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  </div>
);
