import type { CVData } from '../../store/useCVStore';
import { Icon } from '../Icon';

interface Props {
  data: CVData;
  primaryColor?: string;
  fontFamily?: 'sans' | 'serif' | 'mono';
}

const FONT_MAP = { sans: 'Inter, system-ui, sans-serif', serif: "'Noto Serif', serif", mono: "'Geist Mono', monospace" };

export const PixelsTemplate = ({ data, primaryColor = '#00497d', fontFamily = 'serif' }: Props) => (
  <div className="flex w-full min-h-[1100px] h-full bg-white" style={{ fontFamily: FONT_MAP[fontFamily] }}>
    <div className="w-[35%] bg-[#191c20] text-white p-8 flex flex-col border-r border-[#3c4858]/20">
      <div className="mb-12">
        <h1 className="text-[32px] leading-tight font-bold tracking-tight mb-2 uppercase">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-sm uppercase tracking-widest" style={{ color: '#9fcaff' }}>{data.personalInfo.jobTitle || 'Job Title'}</p>
      </div>

      <div className="mb-10">
        <h2 className="text-sm uppercase tracking-widest text-[#bbc7db] mb-4 border-b border-[#535f70]/30 pb-2">Contact</h2>
        <ul className="space-y-3 text-[11px] text-[#eceef4]">
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
          <h2 className="text-sm uppercase tracking-widest text-[#bbc7db] mb-4 border-b border-[#535f70]/30 pb-2">Core Stack</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-[#DFE2EB]/10 border border-[#DFE2EB]/20 rounded text-[10px] text-[#f2f3fa]">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {data.educations.length > 0 && (
        <div className="mb-10 mt-auto">
          <h2 className="text-sm uppercase tracking-widest text-[#bbc7db] mb-4 border-b border-[#535f70]/30 pb-2">Education</h2>
          <div className="flex flex-col gap-4">
            {data.educations.map(edu => (
              <div key={edu.id}>
                <div className="text-[12px] text-[#d1e4ff] mb-1">{edu.school}</div>
                <div className="text-[11px] text-[#eceef4]">{edu.degree}</div>
                <div className="text-[10px] text-[#535f70] mt-1">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="w-[65%] p-10 bg-white text-[#191c20]">
      {data.personalInfo.summary && (
        <div className="mb-8">
          <div
            className="text-[#535f70] text-[13px] leading-relaxed prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: data.personalInfo.summary }}
          />
        </div>
      )}

      {data.experiences.length > 0 && (
        <div className="relative">
          <h2 className="text-sm uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: primaryColor }}>
            <Icon name="work_history" className="text-[16px]" />
            Experience
          </h2>

          {data.experiences.map(exp => (
            <div key={exp.id} className="mb-8 relative pl-6 border-l border-[#DFE2EB]">
              <div className="absolute w-2 h-2 rounded-full -left-[4.5px] top-1.5" style={{ backgroundColor: primaryColor }}></div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-[#191c20] font-semibold text-[15px]">{exp.position}</h3>
                <span className="text-[11px] text-[#535f70]">{exp.startDate} — {exp.endDate}</span>
              </div>
              <div className="text-[12px] mb-3" style={{ color: primaryColor }}>{exp.company}</div>
              <div
                className="text-[12px] text-[#414750] prose prose-sm max-w-none mb-3"
                dangerouslySetInnerHTML={{ __html: exp.bulletPoints }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
