import type { CVData } from '../../store/useCVStore';

export const MinimalistTemplate = ({ data }: { data: CVData }) => (
  <div className="bg-white w-full min-h-[1100px] relative origin-top h-full">
    <div className="p-[80px] font-cv-serif text-cv-serif text-[#1a1a1a] flex flex-col gap-12">
      {/* Header */}
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-[42px] leading-tight font-bold tracking-tight uppercase" style={{ fontFamily: "'Noto Serif', serif" }}>{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-[14px] uppercase tracking-[0.2em] text-[#666666]">{data.personalInfo.jobTitle || 'Job Title'}</p>
        
        <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-2 text-[11px] text-[#444444] tracking-wide">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.email && data.personalInfo.phone && <span className="w-[3px] h-[3px] rounded-full bg-[#999999]"></span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {(data.personalInfo.email || data.personalInfo.phone) && data.personalInfo.address && <span className="w-[3px] h-[3px] rounded-full bg-[#999999]"></span>}
          {data.personalInfo.address && <span>{data.personalInfo.address}</span>}
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-[#e5e5e5]"></div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div>
          <div 
            className="text-[13px] leading-relaxed text-justify text-[#333333] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </div>
      )}

      {/* Experience */}
      {data.experiences.length > 0 && (
        <div className="flex flex-col gap-8">
          <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1a1a1a] pb-2 border-b border-[#e5e5e5]">Professional Experience</h2>
          {data.experiences.map(exp => (
            <div key={exp.id} className="flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[14px] font-bold">{exp.company || 'Company'}</h3>
                <span className="text-[11px] text-[#666666] tracking-wide">{exp.startDate} — {exp.endDate}</span>
              </div>
              <p className="text-[12px] italic text-[#444444]">{exp.position || 'Position'}</p>
              <div 
                className="prose prose-sm max-w-none text-[12px] leading-relaxed text-[#333333]"
                dangerouslySetInnerHTML={{ __html: exp.bulletPoints }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Education & Skills */}
      <div className="grid grid-cols-2 gap-12">
        {/* Education */}
        {data.educations.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1a1a1a] pb-2 border-b border-[#e5e5e5]">Education</h2>
            {data.educations.map(edu => (
              <div key={edu.id} className="flex flex-col gap-1">
                <h3 className="text-[13px] font-bold">{edu.school || 'School'}</h3>
                <p className="text-[12px] text-[#444444]">{edu.degree || 'Degree'}</p>
                <span className="text-[11px] text-[#666666] mt-1">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-[11px] uppercase tracking-[0.25em] font-bold text-[#1a1a1a] pb-2 border-b border-[#e5e5e5]">Core Competencies</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {data.skills.map((skill, i) => (
                  <span key={i} className="text-[12px] text-[#333333]">{skill}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);
