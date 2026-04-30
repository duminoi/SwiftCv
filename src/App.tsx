import React, { useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore, TemplateType } from './store/useCVStore';
import { 
  Download, 
  Languages, 
  Plus, 
  Trash2, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  User, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  Layout
} from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { analyzeCV } from './store/cvAnalyzer';
import './i18n';

// --- Sub-components ---

const SectionTitle = ({ children, icon: Icon }: { children: React.ReactNode, icon?: any }) => (
  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-4 mt-2">
    {Icon && <Icon size={20} className="text-blue-600" />}
    <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">{children}</h2>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }: any) => (
  <div className="flex flex-col gap-1 mb-3">
    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
    />
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
    updateSkills,
    language, 
    setLanguage,
    currentTemplate,
    setTemplate
  } = useCVStore();
  
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'templates'>('personal');
  const resumeRef = useRef<HTMLDivElement>(null);

  const analysis = useMemo(() => analyzeCV(data, language), [data, language]);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: `CV_${data.personalInfo.fullName.replace(/\s+/g, '_')}`,
  });

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'vi' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const tabs = [
    { id: 'personal', label: t('sections.personal'), icon: User },
    { id: 'experience', label: t('sections.experience'), icon: Briefcase },
    { id: 'education', label: t('sections.education'), icon: GraduationCap },
    { id: 'skills', label: t('sections.skills') || 'Skills', icon: Cpu },
    { id: 'templates', label: 'Templates', icon: Layout },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionTitle icon={User}>{t('sections.personal')}</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <InputField label={t('labels.fullName')} value={data.personalInfo.fullName} onChange={(v: any) => updatePersonalInfo({ fullName: v })} />
              <InputField label={t('labels.jobTitle')} value={data.personalInfo.jobTitle} onChange={(v: any) => updatePersonalInfo({ jobTitle: v })} />
              <InputField label={t('labels.email')} value={data.personalInfo.email} onChange={(v: any) => updatePersonalInfo({ email: v })} />
              <InputField label={t('labels.phone')} value={data.personalInfo.phone} onChange={(v: any) => updatePersonalInfo({ phone: v })} />
            </div>
            <InputField label={t('labels.address')} value={data.personalInfo.address} onChange={(v: any) => updatePersonalInfo({ address: v })} />
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t('sections.summary')}</label>
              <textarea
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                rows={6}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                placeholder={language === 'vi' ? 'Viết đoạn tóm tắt ngắn gọn về bản thân...' : 'Write a brief professional summary...'}
              />
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <SectionTitle icon={Briefcase}>{t('sections.experience')}</SectionTitle>
              <button onClick={addExperience} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold">
                <Plus size={18} /> {t('common.add') || 'Thêm'}
              </button>
            </div>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="p-5 border border-slate-100 rounded-2xl mb-6 bg-slate-50/50 group relative hover:border-blue-200 transition-colors shadow-sm">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label={t('labels.company')} value={exp.company} onChange={(v: any) => updateExperience(exp.id, { company: v })} />
                  <InputField label={t('labels.position')} value={exp.position} onChange={(v: any) => updateExperience(exp.id, { position: v })} />
                  <InputField label={t('labels.startDate')} value={exp.startDate} onChange={(v: any) => updateExperience(exp.id, { startDate: v })} />
                  <InputField label={t('labels.endDate')} value={exp.endDate} onChange={(v: any) => updateExperience(exp.id, { endDate: v })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">{t('labels.description')}</label>
                  <textarea
                    value={exp.bulletPoints.join('\n')}
                    onChange={(e) => updateExperience(exp.id, { bulletPoints: e.target.value.split('\n') })}
                    rows={4}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                    placeholder="• Thành tựu 1&#10;• Thành tựu 2"
                  />
                </div>
              </div>
            ))}
          </div>
        );
      case 'education':
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <SectionTitle icon={GraduationCap}>{t('sections.education')}</SectionTitle>
              <button onClick={addEducation} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold">
                <Plus size={18} /> {t('common.add') || 'Thêm'}
              </button>
            </div>
            {data.educations.map((edu) => (
              <div key={edu.id} className="p-5 border border-slate-100 rounded-2xl mb-6 bg-slate-50/50 group relative hover:border-blue-200 transition-colors shadow-sm">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label={t('labels.school')} value={edu.school} onChange={(v: any) => updateEducation(edu.id, { school: v })} />
                  <InputField label={t('labels.degree')} value={edu.degree} onChange={(v: any) => updateEducation(edu.id, { degree: v })} />
                  <InputField label={t('labels.startDate')} value={edu.startDate} onChange={(v: any) => updateEducation(edu.id, { startDate: v })} />
                  <InputField label={t('labels.endDate')} value={edu.endDate} onChange={(v: any) => updateEducation(edu.id, { endDate: v })} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'skills':
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionTitle icon={Cpu}>{t('sections.skills') || 'Skills'}</SectionTitle>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Kỹ năng (phân cách bằng dấu phẩy)</label>
              <textarea
                value={data.skills.join(', ')}
                onChange={(e) => updateSkills(e.target.value.split(',').map(s => s.trim()))}
                rows={4}
                className="px-3 py-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                placeholder="React, TypeScript, Node.js..."
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {data.skills.map((skill, i) => skill && (
                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      case 'templates':
        const templateList: { id: TemplateType, name: string, desc: string }[] = [
          { id: 'modern', name: 'Modern', desc: 'Thiết kế hiện đại, tập trung vào sự sạch sẽ và chuyên nghiệp.' },
          { id: 'minimal', name: 'Minimal', desc: 'Đơn giản, tinh tế, phù hợp cho mọi ngành nghề.' },
          { id: 'professional', name: 'Professional', desc: 'Bố cục truyền thống, nhấn mạnh vào kinh nghiệm dày dặn.' },
        ];
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <SectionTitle icon={Layout}>Chọn Mẫu CV</SectionTitle>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {templateList.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setTemplate(tpl.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    currentTemplate === tpl.id 
                      ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20' 
                      : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">{tpl.name}</span>
                    {currentTemplate === tpl.id && <CheckCircle2 size={20} className="text-blue-600" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{tpl.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">S</div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{t('app.title')}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">{t('app.tagline')}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <Languages size={18} className="text-blue-500" />
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => handlePrint()}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Download size={18} />
            {t('common.exportPDF')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="w-20 bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              title={tab.label}
              className={`p-3 rounded-2xl transition-all relative group ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-400 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              <tab.icon size={24} />
              {activeTab === tab.id && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {tab.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Editor (Left) */}
        <aside className="w-[35%] border-r border-slate-200 bg-white overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            {/* Analysis Card */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
              <div className="flex items-center justify-between mb-6 relative">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/20 rounded-xl">
                    <Award className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('analysis.score')}</h3>
                    <div className="text-3xl font-black tabular-nums">{analysis.total}<span className="text-sm text-slate-600 font-normal">/100</span></div>
                  </div>
                </div>
                <div className="h-14 w-14 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                   <div 
                    className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-700 ease-out" 
                    style={{ clipPath: `inset(${100 - analysis.total}% 0 0 0)` }}
                   />
                   <span className="text-[10px] font-black">{analysis.total}%</span>
                </div>
              </div>

              {analysis.suggestions.length > 0 ? (
                <div className="space-y-2 relative">
                  {analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[11px] text-slate-400 leading-snug">
                      <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-emerald-400 relative">
                  <CheckCircle2 size={18} />
                  <span className="font-bold">{t('analysis.perfect')}!</span>
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              {renderTabContent()}
            </div>
          </div>
        </aside>

        {/* Preview (Right) */}
        <section className="flex-1 bg-slate-100 overflow-y-auto flex flex-col items-center p-12 custom-scrollbar">
          {/* Resume Container */}
          <div
            ref={resumeRef}
            className={`w-[210mm] min-h-[297mm] bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col text-slate-900 leading-relaxed transition-all duration-500 ${
              currentTemplate === 'modern' ? 'p-[20mm] gap-8' : 
              currentTemplate === 'minimal' ? 'p-[25mm] gap-6' : 
              'p-[20mm] gap-10'
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* Template: MODERN */}
            {currentTemplate === 'modern' && (
              <>
                <header className="border-b-4 border-blue-600 pb-8 flex flex-col gap-3">
                  <h1 className="text-5xl font-black tracking-tighter uppercase text-slate-900">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                  <h2 className="text-xl font-bold text-blue-600 tracking-wide uppercase">{data.personalInfo.jobTitle || 'JOB TITLE'}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-slate-400" /> {data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.address}</span>
                  </div>
                </header>

                {data.personalInfo.summary && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3">Professional Profile</h3>
                    <p className="text-[11pt] leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{data.personalInfo.summary}</p>
                  </section>
                )}

                <div className="grid grid-cols-[1fr_250px] gap-12">
                  <div className="flex flex-col gap-10">
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 border-b border-slate-100 pb-2">Experience</h3>
                      <div className="flex flex-col gap-8">
                        {data.experiences.map((exp) => (
                          <div key={exp.id} className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600" />
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-black text-lg text-slate-900 uppercase leading-none">{exp.company || 'Company'}</h4>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                {exp.startDate} — {exp.endDate}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wider">{exp.position || 'Position'}</div>
                            <ul className="list-none flex flex-col gap-2 text-[10.5pt] text-slate-600">
                              {exp.bulletPoints.map((point, idx) => (
                                point.trim() && (
                                  <li key={idx} className="flex gap-2 leading-snug">
                                    <span className="text-blue-500 font-bold">•</span>
                                    {point}
                                  </li>
                                )
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="flex flex-col gap-10">
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 border-b border-slate-100 pb-2">Education</h3>
                      <div className="flex flex-col gap-6">
                        {data.educations.map((edu) => (
                          <div key={edu.id}>
                            <h4 className="font-black text-sm text-slate-900 uppercase leading-tight mb-1">{edu.school || 'School'}</h4>
                            <div className="text-xs font-bold text-slate-500 italic mb-1">{edu.degree || 'Degree'}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              {edu.startDate} — {edu.endDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-6 border-b border-slate-100 pb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => skill && (
                          <span key={i} className="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-black uppercase tracking-wider">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>
                  </div>
                </div>
              </>
            )}

            {/* Template: MINIMAL */}
            {currentTemplate === 'minimal' && (
              <div className="flex flex-col gap-10">
                <header className="text-center flex flex-col gap-4">
                  <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-slate-900">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                  <div className="flex justify-center flex-wrap gap-x-8 text-xs font-medium text-slate-400 uppercase tracking-widest">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.address}</span>
                  </div>
                </header>

                <div className="w-12 h-1 bg-slate-900 mx-auto" />

                <section className="max-w-2xl mx-auto text-center">
                  <p className="text-[11pt] leading-relaxed text-slate-600 italic font-serif">{data.personalInfo.summary}</p>
                </section>

                <section>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900 mb-8 text-center">Experience</h3>
                  <div className="flex flex-col gap-12">
                    {data.experiences.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-[200px_1fr] gap-8">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900 uppercase tracking-widest">{exp.company}</div>
                          <div className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</div>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">{exp.position}</div>
                          <ul className="flex flex-col gap-2 text-[10pt] text-slate-500 list-none">
                            {exp.bulletPoints.map((point, idx) => (
                              point.trim() && <li key={idx} className="leading-normal">{point}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-16">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900 mb-6">Education</h3>
                    <div className="flex flex-col gap-6">
                      {data.educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-1">{edu.school}</h4>
                          <div className="text-[10px] text-slate-500 uppercase tracking-widest">{edu.degree}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-900 mb-6">Expertise</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {data.skills.map((skill, i) => skill && (
                        <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{skill}</span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* Template: PROFESSIONAL */}
            {currentTemplate === 'professional' && (
              <div className="flex flex-col gap-8">
                <header className="flex justify-between items-end border-b-2 border-slate-900 pb-4">
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                    <h2 className="text-lg font-serif text-slate-700 italic">{data.personalInfo.jobTitle || 'JOB TITLE'}</h2>
                  </div>
                  <div className="text-right text-[10pt] text-slate-600 font-serif">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                  </div>
                </header>

                <section>
                  <h3 className="text-sm font-bold uppercase border-b border-slate-900 mb-3 font-serif">Executive Summary</h3>
                  <p className="text-[11pt] leading-relaxed text-slate-800 font-serif text-justify">{data.personalInfo.summary}</p>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase border-b border-slate-900 mb-4 font-serif">Professional Experience</h3>
                  <div className="flex flex-col gap-6">
                    {data.experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between font-serif font-bold text-slate-900">
                          <span>{exp.company}</span>
                          <span>{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <div className="italic font-serif text-slate-700 mb-2">{exp.position}</div>
                        <ul className="list-disc ml-5 flex flex-col gap-1 text-[10.5pt] text-slate-800 font-serif text-justify">
                          {exp.bulletPoints.map((point, idx) => (
                            point.trim() && <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase border-b border-slate-900 mb-4 font-serif">Academic Background</h3>
                  {data.educations.map((edu) => (
                    <div key={edu.id} className="flex justify-between font-serif text-slate-800 mb-2">
                      <div>
                        <span className="font-bold">{edu.school}</span>, {edu.degree}
                      </div>
                      <span className="italic">{edu.startDate} — {edu.endDate}</span>
                    </div>
                  ))}
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase border-b border-slate-900 mb-2 font-serif">Core Competencies</h3>
                  <p className="text-[11pt] text-slate-800 font-serif">
                    {data.skills.join(' • ')}
                  </p>
                </section>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-bold tracking-widest">
        <span>© 2026 SWIFTCV BY GEMINI</span>
        <div className="w-1 h-1 bg-slate-200 rounded-full" />
        <a href="#" className="hover:text-blue-500 transition-colors flex items-center gap-1 uppercase">
          <Globe size={12} /> Github
        </a>
      </footer>
    </div>
  );
}

export default App;
