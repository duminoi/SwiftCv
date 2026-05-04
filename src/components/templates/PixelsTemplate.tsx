import type { CVData } from '../../store/useCVStore';
import { Icon } from '../Icon';

export const PixelsTemplate = ({ data }: { data: CVData }) => (
  <div className="flex w-full min-h-[1100px] h-full bg-white">
    {/* Left: Skill Matrix (35%) */}
    <div className="w-[35%] bg-[#191c20] text-white p-8 flex flex-col border-r border-[#3c4858]/20">
      <div className="mb-12">
        <h1 className="font-headline-md text-[32px] leading-tight font-bold tracking-tight mb-2 uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="font-geist-mono text-[#9fcaff] text-sm uppercase tracking-widest">{data.personalInfo.jobTitle || 'Job Title'}</p>
      </div>

      <div className="mb-10">
        <h2 className="font-title-md text-sm uppercase tracking-widest text-[#bbc7db] mb-4 border-b border-[#535f70]/30 pb-2">Contact</h2>
        <ul className="space-y-3 font-geist-mono text-[11px] text-[#eceef4]">
          {data.personalInfo.email && (
            <li className="flex items-center gap-3">
              <Icon name="mail" className="text-[14px] text-[#d1e4ff]" />
              {data.personalInfo.email}
            </li>
          )}
          {data.personalInfo.phone && (
            <li className="flex items-center gap-3">
              <Icon name="phone" className="text-[14px] text-[#d1e4ff]" />
              {data.personalInfo.phone}
            </li>
          )}
          {data.personalInfo.address && (
            <li className="flex items-center gap-3">
              <Icon name="location_on" className="text-[14px] text-[#d1e4ff]" />
              {data.personalInfo.address}
            </li>
          )}
          {data.personalInfo.linkedin && (
             <li className="flex items-center gap-3">
              <Icon name="link" className="text-[14px] text-[#d1e4ff]" />
              {data.personalInfo.linkedin}
            </li>
          )}
        </ul>
      </div>

      {data.skills.length > 0 && (
        <div className="mb-10">
          <h2 className="font-title-md text-sm uppercase tracking-widest text-[#bbc7db] mb-4 border-b border-[#535f70]/30 pb-2">Core Stack</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-[#DFE2EB]/10 border border-[#DFE2EB]/20 rounded font-geist-mono text-[10px] text-[#f2f3fa]">{skill}</span>
            ))}
          </div>
        </div>
      )}
      
      {data.educations.length > 0 && (
        <div className="mb-10 mt-auto">
          <h2 className="font-title-md text-sm uppercase tracking-widest text-[#bbc7db] mb-4 border-b border-[#535f70]/30 pb-2">Education</h2>
          <div className="flex flex-col gap-4">
            {data.educations.map(edu => (
              <div key={edu.id}>
                <div className="font-geist-mono text-[12px] text-[#d1e4ff] mb-1">{edu.school}</div>
                <div className="font-cv-serif text-[11px] text-[#eceef4]">{edu.degree}</div>
                <div className="font-geist-mono text-[10px] text-[#535f70] mt-1">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Right: Experience Details (65%) */}
    <div className="w-[65%] p-10 bg-white text-[#191c20]">
      {data.personalInfo.summary && (
        <div className="mb-8">
          <div 
            className="font-cv-serif text-[#535f70] text-[13px] leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </div>
      )}

      {data.experiences.length > 0 && (
        <div className="relative">
          <h2 className="font-title-md text-sm uppercase tracking-widest text-[#00497d] mb-6 flex items-center gap-2">
            <Icon name="work_history" className="text-[16px]" />
            Experience
          </h2>
          
          {data.experiences.map(exp => (
            <div key={exp.id} className="mb-8 relative pl-6 border-l border-[#DFE2EB]">
              <div className="absolute w-2 h-2 rounded-full bg-[#00497d] -left-[4.5px] top-1.5"></div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-title-md text-[#191c20] font-semibold text-[15px]">{exp.position}</h3>
                <span className="font-geist-mono text-[11px] text-[#535f70]">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="font-geist-mono text-[12px] text-[#00497d] mb-3">{exp.company}</div>
              
              <div 
                className="font-cv-serif text-[12px] text-[#414750] prose prose-sm max-w-none mb-3"
                dangerouslySetInnerHTML={{ __html: exp.bulletPoints }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
