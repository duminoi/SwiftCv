import React, { useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from './store/useCVStore';
import { useReactToPrint } from 'react-to-print';
import { analyzeCV } from './store/cvAnalyzer';
import './i18n';

// --- Sub-components ---

const Icon = ({ name, className = '', filled = false }: { name: string, className?: string, filled?: boolean }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}>
    {name}
  </span>
);

const InputField = ({ label, value, onChange, type = "text", rows }: any) => (
  <div className="relative">
    <label className="absolute -top-2 left-2 bg-surface-container-lowest px-1 font-label-small text-label-small text-primary">
      {label}
    </label>
    {rows ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-4 py-3 rounded border border-outline bg-transparent focus:border-primary focus:border-2 focus:outline-none font-body-md text-body-md text-on-surface resize-none"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded border border-outline bg-transparent focus:border-primary focus:border-2 focus:outline-none font-body-md text-body-md text-on-surface"
      />
    )}
  </div>
);

// --- Main App Component ---

function App() {
  const { t, i18n } = useTranslation();
  const { 
    data, 
    updatePersonalInfo, 
    addExperience, 
    updateExperience, 
    removeExperience, 
    addEducation, 
    updateEducation, 
    removeEducation, 
    addSkill,
    removeSkill,
    language, 
    setLanguage
  } = useCVStore();
  
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'analysis'>('personal');
  const [newSkill, setNewSkill] = useState('');
  const resumeRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(() => analyzeCV(data, language), [data, language]);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `CV_${data.personalInfo.fullName.replace(/\s+/g, '_')}`,
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const tabs = [
    { id: 'personal', label: t('sections.personal'), icon: 'person' },
    { id: 'experience', label: t('sections.experience'), icon: 'work' },
    { id: 'education', label: t('sections.education'), icon: 'school' },
    { id: 'skills', label: t('sections.skills') || 'Skills', icon: 'psychology' },
    { id: 'analysis', label: 'AI Analysis', icon: 'insights' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.personal')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Manage your personal and contact details.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <InputField label={t('labels.fullName')} value={data.personalInfo.fullName} onChange={(v: any) => updatePersonalInfo({ fullName: v })} />
                <InputField label={t('labels.jobTitle')} value={data.personalInfo.jobTitle} onChange={(v: any) => updatePersonalInfo({ jobTitle: v })} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <InputField label={t('labels.email')} value={data.personalInfo.email} onChange={(v: any) => updatePersonalInfo({ email: v })} />
                <InputField label={t('labels.phone')} value={data.personalInfo.phone} onChange={(v: any) => updatePersonalInfo({ phone: v })} />
              </div>
              <InputField label={t('labels.address')} value={data.personalInfo.address} onChange={(v: any) => updatePersonalInfo({ address: v })} />
              <div className="grid grid-cols-2 gap-5">
                <InputField label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v: any) => updatePersonalInfo({ linkedin: v })} />
                <InputField label="GitHub" value={data.personalInfo.github} onChange={(v: any) => updatePersonalInfo({ github: v })} />
              </div>
              <InputField label={t('sections.summary')} value={data.personalInfo.summary} onChange={(v: any) => updatePersonalInfo({ summary: v })} rows={4} />
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.experience')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Detail your work experience.</p>
            </div>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm relative group">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container opacity-0 group-hover:opacity-100"
                >
                  <Icon name="delete" />
                </button>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label={t('labels.company')} value={exp.company} onChange={(v: any) => updateExperience(exp.id, { company: v })} />
                    <InputField label={t('labels.position')} value={exp.position} onChange={(v: any) => updateExperience(exp.id, { position: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label={t('labels.startDate')} value={exp.startDate} onChange={(v: any) => updateExperience(exp.id, { startDate: v })} />
                    <InputField label={t('labels.endDate')} value={exp.endDate} onChange={(v: any) => updateExperience(exp.id, { endDate: v })} />
                  </div>
                  <InputField label={t('labels.description')} value={exp.bulletPoints.join('\n')} onChange={(v: any) => updateExperience(exp.id, { bulletPoints: v.split('\n') })} rows={4} />
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center gap-2 text-primary font-title-md text-title-md hover:bg-primary-container/10 transition-colors">
              <Icon name="add" />
              {t('common.add') || 'Add Experience'}
            </button>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.education')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Detail your academic background to establish your foundation.</p>
            </div>
            {data.educations.map((edu) => (
              <div key={edu.id} className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm relative group">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors p-2 rounded-full hover:bg-error-container opacity-0 group-hover:opacity-100"
                >
                  <Icon name="delete" />
                </button>
                <div className="space-y-5">
                  <InputField label={t('labels.school')} value={edu.school} onChange={(v: any) => updateEducation(edu.id, { school: v })} />
                  <InputField label={t('labels.degree')} value={edu.degree} onChange={(v: any) => updateEducation(edu.id, { degree: v })} />
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label={t('labels.startDate')} value={edu.startDate} onChange={(v: any) => updateEducation(edu.id, { startDate: v })} />
                    <InputField label={t('labels.endDate')} value={edu.endDate} onChange={(v: any) => updateEducation(edu.id, { endDate: v })} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center gap-2 text-primary font-title-md text-title-md hover:bg-primary-container/10 transition-colors">
              <Icon name="add" />
              {t('common.add') || 'Add Education'}
            </button>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.skills')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Add skills relevant to your expertise.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm space-y-5">
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="E.g., React, UI Design..."
                    className="w-full px-4 py-3 rounded border border-outline bg-transparent focus:border-primary focus:border-2 focus:outline-none font-body-md text-body-md text-on-surface"
                  />
                </div>
                <button type="submit" className="px-6 rounded bg-primary text-on-primary font-title-md text-title-md hover:opacity-90 transition-opacity">
                  <Icon name="add" />
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-medium">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-error transition-colors flex items-center justify-center">
                      <Icon name="close" className="text-[16px]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'analysis':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">AI Analysis</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">CV Score and optimization tips.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-container rounded-full text-on-primary-container">
                    <Icon name="military_tech" />
                  </div>
                  <div>
                    <h3 className="font-label-small text-label-small text-on-surface-variant uppercase tracking-widest">{t('analysis.score')}</h3>
                    <div className="text-4xl font-headline-md font-bold text-primary">{analysis.total}<span className="text-lg text-on-surface-variant">/100</span></div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {analysis.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-error-container/20 p-3 rounded border border-error-container text-on-surface text-sm">
                    <Icon name="error" className="text-error mt-0.5 shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                ))}
                {analysis.suggestions.length === 0 && (
                  <div className="flex items-center gap-3 text-sm text-green-600 bg-green-50 p-3 rounded">
                    <Icon name="check_circle" />
                    <span className="font-bold">{t('analysis.perfect')}!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-hidden">
      {/* TopAppBar */}
      <header className="flex justify-between items-center w-full px-6 h-16 bg-white dark:bg-slate-900 border-b border-outline-variant z-50 shrink-0">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black tracking-tight text-primary">SwiftCv</span>
          <div className="h-6 w-px bg-outline-variant mx-2"></div>
          <span className="font-title-md text-title-md text-on-surface-variant">The International Standard</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const newLang = language === 'en' ? 'vi' : 'en';
              setLanguage(newLang);
              i18n.changeLanguage(newLang);
            }}
            className="px-5 py-2 rounded-full border border-primary text-primary font-title-md text-title-md hover:bg-slate-50 transition-colors uppercase"
          >
            {language}
          </button>
          <button 
            onClick={() => handlePrint()}
            className="px-5 py-2 rounded-full bg-primary text-on-primary font-title-md text-title-md hover:opacity-90 transition-opacity shadow-sm"
          >
            Download PDF
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Editor (40%) */}
        <section className="w-full md:w-[40%] bg-surface flex flex-col border-r border-outline-variant h-full overflow-hidden shrink-0">
          <nav className="bg-white border-b border-outline-variant px-4 py-2 shrink-0 overflow-x-auto custom-scrollbar">
            <ul className="flex items-center gap-2 min-w-max">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-title-md text-title-md transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary-container text-on-primary-container' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <Icon name={tab.icon} filled={activeTab === tab.id} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Editor Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {renderTabContent()}
          </div>
        </section>

        {/* Right Panel: Canvas Preview (60%) */}
        <section className="hidden md:flex flex-col w-[60%] bg-surface-container-low p-8 overflow-y-auto items-center custom-scrollbar">
          {/* Canvas Toolbar */}
          <div className="w-full max-w-[850px] flex justify-between items-center mb-6 no-print">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-outline-variant shadow-sm">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="font-label-small text-label-small text-on-surface-variant">Auto-saved</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white rounded-full border border-outline-variant shadow-sm text-on-surface-variant hover:text-primary transition-colors">
                <Icon name="zoom_in" />
              </button>
              <span className="font-label-small text-label-small text-on-surface-variant w-12 text-center">100%</span>
              <button className="p-2 bg-white rounded-full border border-outline-variant shadow-sm text-on-surface-variant hover:text-primary transition-colors">
                <Icon name="zoom_out" />
              </button>
            </div>
          </div>

          {/* The CV Paper */}
          <div 
            ref={resumeRef}
            className="cv-paper bg-white w-full max-w-[850px] min-h-[1100px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 flex flex-col font-cv-serif text-on-surface origin-top"
          >
            {/* CV Header */}
            <header className="border-b-2 border-primary pb-6 mb-6 p-10 pt-12">
              <h1 className="font-title-md text-display-lg font-bold text-on-surface tracking-tight leading-none mb-4">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
              <h2 className="font-title-md text-headline-md text-primary mb-6">{data.personalInfo.jobTitle || 'Job Title'}</h2>
              
              <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant font-title-md">
                <div className="flex items-center gap-1">
                  <Icon name="location_on" className="text-[16px] text-primary" />
                  {data.personalInfo.address || 'Location'}
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="mail" className="text-[16px] text-primary" />
                  {data.personalInfo.email || 'Email'}
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="phone" className="text-[16px] text-primary" />
                  {data.personalInfo.phone || 'Phone'}
                </div>
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
              </div>

              {/* Right Column (Main Content) */}
              <div className="w-2/3 flex flex-col gap-8">
                {data.personalInfo.summary && (
                  <section>
                    <h3 className="font-title-md text-title-md font-bold uppercase tracking-widest text-on-surface mb-4 border-b border-outline-variant pb-2">Professional Summary</h3>
                    <p className="text-on-surface-variant leading-relaxed">
                      {data.personalInfo.summary}
                    </p>
                  </section>
                )}

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
                        <ul className="list-disc list-outside ml-4 text-on-surface-variant space-y-2 leading-relaxed">
                          {exp.bulletPoints.map((point, idx) => point.trim() && (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
          <div className="h-16 w-full shrink-0 no-print"></div>
        </section>
      </main>
    </div>
  );
}

export default App;