import React, { useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from './store/useCVStore';
import type { TemplateType, FontType, CVData } from './store/useCVStore';
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
  Layout,
  Palette,
  Type,
  X,
  Link as LinkIcon,
  RotateCcw,
  Settings,
  FileJson,
  Upload,
  Info
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
      value={value || ''}
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
    addSkill,
    removeSkill,
    resetData,
    importData,
    language, 
    setLanguage,
    currentTemplate,
    setTemplate,
    primaryColor,
    setPrimaryColor,
    fontFamily,
    setFontFamily
  } = useCVStore();
  
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'settings'>('personal');
  const [newSkill, setNewSkill] = useState('');
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `CV_Data_${data.personalInfo.fullName.replace(/\s+/g, '_')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string) as CVData;
          // Basic validation
          if (importedData.personalInfo && importedData.experiences) {
            importData(importedData);
            alert(language === 'vi' ? 'Nhập dữ liệu thành công!' : 'Data imported successfully!');
          } else {
            throw new Error('Invalid format');
          }
        } catch (error) {
          alert(language === 'vi' ? 'File không hợp lệ!' : 'Invalid JSON file!');
        }
      };
      reader.readAsText(file);
    }
  };

  const tabs = [
    { id: 'personal', label: t('sections.personal'), icon: User },
    { id: 'experience', label: t('sections.experience'), icon: Briefcase },
    { id: 'education', label: t('sections.education'), icon: GraduationCap },
    { id: 'skills', label: t('sections.skills') || 'Skills', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const colors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Slate', value: '#475569' },
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Amber', value: '#d97706' },
    { name: 'Black', value: '#000000' },
  ];

  const fonts: { id: FontType, name: string, css: string }[] = [
    { id: 'sans', name: 'Sans-serif', css: "'Inter', sans-serif" },
    { id: 'serif', name: 'Serif', css: "'Merriweather', serif" },
    { id: 'mono', name: 'Monospace', css: "'Fira Code', monospace" },
  ];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

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
            
            <div className="grid grid-cols-3 gap-4 mt-2">
              <InputField label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v: any) => updatePersonalInfo({ linkedin: v })} placeholder="linkedin.com/in/..." />
              <InputField label="GitHub" value={data.personalInfo.github} onChange={(v: any) => updatePersonalInfo({ github: v })} placeholder="github.com/..." />
              <InputField label="Portfolio" value={data.personalInfo.portfolio} onChange={(v: any) => updatePersonalInfo({ portfolio: v })} placeholder="yourwebsite.dev" />
            </div>

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
            <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Thêm kỹ năng mới (ví dụ: React, SQL...)"
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                <Plus size={20} />
              </button>
            </form>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold border border-slate-800 animate-in zoom-in-50 duration-200">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="p-0.5 hover:bg-white/20 rounded-full transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        const templateList: { id: TemplateType, name: string, desc: string }[] = [
          { id: 'modern', name: t('templates.modern.name'), desc: t('templates.modern.desc') },
          { id: 'minimal', name: t('templates.minimal.name'), desc: t('templates.minimal.desc') },
          { id: 'professional', name: t('templates.professional.name'), desc: t('templates.professional.desc') },
          { id: 'creative', name: t('templates.creative.name'), desc: t('templates.creative.desc') },
        ];
        return (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-10">
            <section>
              <SectionTitle icon={Layout}>{t('labels.template')}</SectionTitle>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {templateList.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      currentTemplate === tpl.id 
                        ? 'border-blue-600 bg-blue-50/50' 
                        : 'border-slate-100 bg-white hover:border-blue-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-800">{tpl.name}</div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{tpl.desc}</p>
                  </button>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-2 gap-8">
              <section>
                <SectionTitle icon={Palette}>{t('labels.color')}</SectionTitle>
                <div className="flex flex-wrap gap-2 mt-4">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setPrimaryColor(c.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        primaryColor === c.value ? 'border-white ring-2 ring-blue-500' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                  <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 border-slate-200 overflow-hidden"
                  />
                </div>
              </section>

              <section>
                <SectionTitle icon={Type}>{t('labels.font')}</SectionTitle>
                <div className="flex flex-col gap-2 mt-4">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id)}
                      style={{ fontFamily: f.css }}
                      className={`px-3 py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${
                        fontFamily === f.id 
                          ? 'border-blue-600 bg-blue-50 text-blue-700' 
                          : 'border-slate-100 bg-white text-slate-500'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <section className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <SectionTitle icon={FileJson}>{t('labels.dataManagement')}</SectionTitle>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <Download size={16} /> {t('common.export')}
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 p-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                >
                  <Upload size={16} /> {t('common.import')}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportJSON} 
                  accept=".json" 
                  className="hidden" 
                />
                <button 
                  onClick={() => {
                    if(confirm(t('common.confirmReset'))) resetData();
                  }}
                  className="flex items-center justify-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-black text-red-600 hover:bg-red-100 transition-all col-span-2"
                >
                  <RotateCcw size={16} /> {t('common.reset')}
                </button>
              </div>
              <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-400 leading-relaxed italic">
                <Info size={12} className="shrink-0 mt-0.5" />
                <p>{t('labels.tip')}</p>
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  const getFontCSS = () => {
    switch(fontFamily) {
      case 'serif': return "'Merriweather', serif";
      case 'mono': return "'Fira Code', monospace";
      default: return "'Inter', sans-serif";
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
                <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
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
                    className="absolute inset-0 rounded-full border-4 transition-all duration-700 ease-out" 
                    style={{ 
                      clipPath: `inset(${100 - analysis.total}% 0 0 0)`,
                      borderColor: analysis.total > 80 ? '#10b981' : analysis.total > 50 ? '#3b82f6' : '#f59e0b'
                    }}
                   />
                   <span className="text-[10px] font-black">{analysis.total}%</span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6 relative border-t border-slate-800 pt-6">
                {Object.entries(analysis.breakdown).map(([key, val]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{key}</span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(val / (key === 'experience' ? 40 : 20)) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {analysis.suggestions.length > 0 ? (
                <div className="space-y-2 relative border-t border-slate-800 pt-4">
                  {analysis.suggestions.slice(0, 3).map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[11px] text-slate-400 leading-snug">
                      <AlertCircle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 text-sm text-emerald-400 relative border-t border-slate-800 pt-4">
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
              currentTemplate === 'creative' ? 'p-0 flex-row gap-0' :
              'p-[20mm] gap-10'
            }`}
            style={{ fontFamily: getFontCSS() }}
          >
            {/* Template: MODERN */}
            {currentTemplate === 'modern' && (
              <>
                <header className="border-b-4 pb-8 flex flex-col gap-3" style={{ borderColor: primaryColor }}>
                  <h1 className="text-5xl font-black tracking-tighter uppercase text-slate-900">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                  <h2 className="text-xl font-bold tracking-wide uppercase" style={{ color: primaryColor }}>{data.personalInfo.jobTitle || 'JOB TITLE'}</h2>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-slate-500">
                    <span className="flex items-center gap-1.5"><Globe size={14} className="text-slate-400" /> {data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] font-black uppercase tracking-widest mt-2" style={{ color: primaryColor }}>
                    {data.personalInfo.linkedin && <span className="flex items-center gap-1"><Globe size={10} /> {data.personalInfo.linkedin}</span>}
                    {data.personalInfo.github && <span className="flex items-center gap-1"><Globe size={10} /> {data.personalInfo.github}</span>}
                    {data.personalInfo.portfolio && <span className="flex items-center gap-1"><LinkIcon size={10} /> {data.personalInfo.portfolio}</span>}
                  </div>
                </header>

                {data.personalInfo.summary && (
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-3" style={{ color: primaryColor }}>Professional Profile</h3>
                    <p className="text-[11pt] leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{data.personalInfo.summary}</p>
                  </section>
                )}

                <div className="grid grid-cols-[1fr_250px] gap-12">
                  <div className="flex flex-col gap-10">
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2" style={{ color: primaryColor }}>Experience</h3>
                      <div className="flex flex-col gap-8">
                        {data.experiences.map((exp) => (
                          <div key={exp.id} className="relative pl-6 border-l-2 border-slate-100">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4" style={{ borderColor: primaryColor }} />
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="font-black text-lg text-slate-900 uppercase leading-none">{exp.company || 'Company'}</h4>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                {exp.startDate} — {exp.endDate}
                              </span>
                            </div>
                            <div className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: primaryColor }}>{exp.position || 'Position'}</div>
                            <ul className="list-none flex flex-col gap-2 text-[10.5pt] text-slate-600">
                              {exp.bulletPoints.map((point, idx) => (
                                point.trim() && (
                                  <li key={idx} className="flex gap-2 leading-snug">
                                    <span className="font-bold" style={{ color: primaryColor }}>•</span>
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
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2" style={{ color: primaryColor }}>Education</h3>
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
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 border-b border-slate-100 pb-2" style={{ color: primaryColor }}>Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => skill && (
                          <span key={i} className="px-2.5 py-1 text-white rounded text-[10px] font-black uppercase tracking-wider" style={{ backgroundColor: primaryColor }}>
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
                  <div className="flex justify-center flex-wrap gap-x-6 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    {data.personalInfo.linkedin && <span>LinkedIn: {data.personalInfo.linkedin}</span>}
                    {data.personalInfo.github && <span>GitHub: {data.personalInfo.github}</span>}
                  </div>
                </header>

                <div className="w-12 h-1 mx-auto" style={{ backgroundColor: primaryColor }} />

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
                          <div className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: primaryColor }}>{exp.position}</div>
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
                        <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest" style={{ color: primaryColor }}>{skill}</span>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* Template: PROFESSIONAL */}
            {currentTemplate === 'professional' && (
              <div className="flex flex-col gap-8">
                <header className="flex justify-between items-end border-b-2 pb-4" style={{ borderColor: primaryColor }}>
                  <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">{data.personalInfo.fullName || 'YOUR NAME'}</h1>
                    <h2 className="text-lg font-serif italic text-slate-700">{data.personalInfo.jobTitle || 'JOB TITLE'}</h2>
                  </div>
                  <div className="text-right text-[10pt] text-slate-600 font-serif">
                    <div>{data.personalInfo.email}</div>
                    <div>{data.personalInfo.phone}</div>
                    <div>{data.personalInfo.address}</div>
                  </div>
                </header>

                <section>
                  <h3 className="text-sm font-bold uppercase border-b mb-3 font-serif" style={{ borderColor: primaryColor }}>Executive Summary</h3>
                  <p className="text-[11pt] leading-relaxed text-slate-800 font-serif text-justify">{data.personalInfo.summary}</p>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase border-b mb-4 font-serif" style={{ borderColor: primaryColor }}>Professional Experience</h3>
                  <div className="flex flex-col gap-6">
                    {data.experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between font-serif font-bold text-slate-900">
                          <span>{exp.company}</span>
                          <span>{exp.startDate} — {exp.endDate}</span>
                        </div>
                        <div className="italic font-serif text-slate-700 mb-2" style={{ color: primaryColor }}>{exp.position}</div>
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
                  <h3 className="text-sm font-bold uppercase border-b mb-4 font-serif" style={{ borderColor: primaryColor }}>Academic Background</h3>
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
                  <h3 className="text-sm font-bold uppercase border-b mb-2 font-serif" style={{ borderColor: primaryColor }}>Core Competencies</h3>
                  <p className="text-[11pt] text-slate-800 font-serif">
                    {data.skills.join(' • ')}
                  </p>
                </section>
              </div>
            )}

            {/* Template: CREATIVE */}
            {currentTemplate === 'creative' && (
              <div className="flex min-h-[297mm]">
                {/* Left Sidebar */}
                <aside className="w-[300px] text-white p-12 flex flex-col gap-10" style={{ backgroundColor: primaryColor }}>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black uppercase leading-tight tracking-tighter">{data.personalInfo.fullName || 'NAME'}</h1>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">{data.personalInfo.jobTitle || 'TITLE'}</h2>
                  </div>

                  <section className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/20 pb-2">Contact</h3>
                    <div className="flex flex-col gap-4 text-xs font-bold opacity-90">
                      <span className="flex items-center gap-2"><Globe size={14} /> {data.personalInfo.email}</span>
                      <span className="flex items-center gap-2"><Briefcase size={14} /> {data.personalInfo.phone}</span>
                      <span className="flex items-center gap-2"><User size={14} /> {data.personalInfo.address}</span>
                      {data.personalInfo.linkedin && <span className="flex items-center gap-2"><Globe size={14} /> {data.personalInfo.linkedin}</span>}
                      {data.personalInfo.github && <span className="flex items-center gap-2"><Globe size={14} /> {data.personalInfo.github}</span>}
                    </div>
                  </section>

                  <section className="flex flex-col gap-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/20 pb-2">Expertise</h3>
                    <div className="flex flex-col gap-3">
                      {data.skills.map((skill, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <span className="text-[10px] font-black uppercase tracking-widest">{skill}</span>
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="flex flex-col gap-6 mt-auto">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/20 pb-2">Education</h3>
                    <div className="flex flex-col gap-6">
                      {data.educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-black text-xs uppercase mb-1">{edu.school}</h4>
                          <p className="text-[10px] opacity-70 mb-1">{edu.degree}</p>
                          <span className="text-[9px] font-black opacity-50">{edu.startDate} — {edu.endDate}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </aside>

                {/* Right Content */}
                <main className="flex-1 p-16 bg-white flex flex-col gap-12">
                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-6 border-l-4 pl-4" style={{ borderColor: primaryColor }}>Summary</h3>
                    <p className="text-[11pt] text-slate-600 leading-relaxed font-medium">{data.personalInfo.summary}</p>
                  </section>

                  <section>
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-8 border-l-4 pl-4" style={{ borderColor: primaryColor }}>Experience</h3>
                    <div className="flex flex-col gap-10">
                      {data.experiences.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-baseline mb-2">
                            <h4 className="font-black text-xl text-slate-900 uppercase tracking-tighter">{exp.company}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.startDate} — {exp.endDate}</span>
                          </div>
                          <div className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: primaryColor }}>{exp.position}</div>
                          <ul className="flex flex-col gap-3">
                            {exp.bulletPoints.map((point, idx) => (
                              point.trim() && (
                                <li key={idx} className="text-[10.5pt] text-slate-500 flex gap-3 leading-snug">
                                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }} />
                                  {point}
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                </main>
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
