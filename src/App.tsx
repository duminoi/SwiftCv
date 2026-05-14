import React, { useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from './store/useCVStore';
import { analyzeCV } from './store/cvAnalyzer';
import html2pdf from 'html2pdf.js';
import { StandardTemplate } from './components/templates/StandardTemplate';
import { MinimalistTemplate } from './components/templates/MinimalistTemplate';
import { PixelsTemplate } from './components/templates/PixelsTemplate';
import { CreativeTemplate } from './components/templates/CreativeTemplate';
import { RichTextEditor } from './components/RichTextEditor';
import { analyzeCV as apiAnalyze, rewriteSummary, rewriteBullets, suggestSkills, matchJD } from './services/api';
import './i18n';

// --- Sub-components ---

const Icon = ({ name, className = '', filled = false, style }: { name: string, className?: string, filled?: boolean, style?: React.CSSProperties }) => (
  <span className={`material-symbols-outlined ${className}`} style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0", ...style }}>
    {name}
  </span>
);

const ScoreGauge = ({ value, max = 100, size = 120, thickness = 10, label = '' }: { value: number; max?: number; size?: number; thickness?: number; label?: string }) => {
  const pct = Math.min(value / max, 1);
  const color = pct >= 0.7 ? '#14B8A6' : pct >= 0.4 ? '#F59E0B' : '#EF4444';
  const bgColor = pct >= 0.7 ? '#14B8A620' : pct >= 0.4 ? '#F59E0B20' : '#EF444420';
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const [animatedOffset, setAnimatedOffset] = React.useState(circumference);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimatedOffset(offset), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={thickness} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animatedOffset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none" style={{ color }}>{value}</span>
        {label && <span className="text-[9px] text-on-surface-variant font-medium mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

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
    setLanguage,
    currentTemplate,
    setTemplate,
    primaryColor,
    setPrimaryColor,
    fontFamily,
    setFontFamily,
    resetData,
    importData,
  } = useCVStore();
  
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'analysis' | 'templates' | 'settings' | 'match'>('personal');
  const [newSkill, setNewSkill] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiState, setAiState] = useState<{ loading: boolean; result: any; error: string | null }>({ loading: false, result: null, error: null });
  const [rewriteState, setRewriteState] = useState<{ id: string | null; loading: boolean; result: any }>({ id: null, loading: false, result: null });
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const analysis = useMemo(() => analyzeCV(data, language), [data, language]);

  const sectionProgress = useMemo(() => {
    const pi = data.personalInfo;
    const personalFilled = [pi.fullName, pi.jobTitle, pi.email, pi.phone].filter(Boolean).length;
    const expFilled = data.experiences.filter(e => e.company || e.position).length;
    const eduFilled = data.educations.filter(e => e.school || e.degree).length;
    const skillCount = data.skills.length;
    return { personalFilled, expFilled, eduFilled, skillCount, total: personalFilled + expFilled + eduFilled + skillCount };
  }, [data]);

  React.useEffect(() => {
    if (activeTab !== 'analysis' || aiState.loading) return;
    if (aiState.result) return;
    setAiState(prev => ({ ...prev, loading: true, error: null }));
    apiAnalyze(data, language)
      .then(result => setAiState({ loading: false, result, error: null }))
      .catch(err => {
        setAiState({ loading: false, result: null, error: err.message });
      });
  }, [activeTab, data, language]);

  const handleRewrite = async (type: 'summary' | 'bullets', content: string, id: string | null, jobTitle?: string) => {
    setRewriteState({ id, loading: true, result: null });
    try {
      const result = type === 'summary'
        ? await rewriteSummary(content, jobTitle || '', language)
        : await rewriteBullets(content, language);
      setRewriteState({ id, loading: false, result });
    } catch (err: any) {
      setRewriteState({ id, loading: false, result: null });
    }
  };

  const handleSuggestSkills = async () => {
    setSuggestSkillsLoading(true);
    try {
      const skills = await suggestSkills(data.experiences, data.personalInfo.summary, data.skills, language);
      setSuggestedSkills(Array.isArray(skills) ? skills : []);
    } catch {
      setSuggestedSkills([]);
    } finally {
      setSuggestSkillsLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!jdText.trim()) return;
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const result = await matchJD(data, jdText, language);
      setMatchResult(result);
    } catch {
      setMatchResult(null);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${data.personalInfo.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importData(parsed);
      } catch {
        // invalid JSON file
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrint = async () => {
    if (!resumeRef.current) return;
    
    setIsDownloading(true);
    
    // Đợi UI cập nhật trạng thái hiển thị loading overlay (100ms)
    await new Promise(resolve => setTimeout(resolve, 100));

    // Fix lỗi html2canvas không hỗ trợ oklch/oklab của Tailwind v4:
    // Tạm thời thay thế các màu này bằng 'transparent' trên DOM thật trước khi render PDF.
    const styles = document.querySelectorAll('style');
    const originalStyles: string[] = [];
    styles.forEach(style => {
      originalStyles.push(style.textContent || '');
      if (style.textContent) {
        // Thay thế cả các hàm oklch(), oklab() và các từ khóa 'in oklab', 'in oklch' trong color-mix
        style.textContent = style.textContent.replace(/oklch|oklab/g, 'rgb');
      }
    });

    try {
      const element = resumeRef.current;
      const opt = {
        margin: 0,
        filename: `CV_${data.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Tạo và tải PDF
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
    } finally {
      // Khôi phục lại CSS ban đầu
      styles.forEach((style, index) => {
        style.textContent = originalStyles[index];
      });
      setIsDownloading(false);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  const formTabs = [
    { id: 'personal', label: t('sections.personal'), icon: 'person', short: 'Info' },
    { id: 'experience', label: t('sections.experience'), icon: 'work', short: 'Work' },
    { id: 'education', label: t('sections.education'), icon: 'school', short: 'Edu' },
    { id: 'skills', label: t('sections.skills') || 'Skills', icon: 'psychology', short: 'Skills' },
  ];
  const toolTabs = [
    { id: 'analysis', label: 'AI Analysis', icon: 'insights', short: 'AI' },
    { id: 'match', label: 'Job Match', icon: 'search_insights', short: 'Match' },
    { id: 'templates', label: 'Templates', icon: 'palette', short: 'Theme' },
    { id: 'settings', label: t('sections.settings'), icon: 'settings', short: 'Setup' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.personal')}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Manage your personal and contact details.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-variant/60 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.personalFilled >= 4 ? '#14B8A6' : '#F59E0B' }}></span>
                {sectionProgress.personalFilled}/4 filled
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <InputField label={t('labels.fullName')} value={data.personalInfo.fullName} onChange={(v: any) => updatePersonalInfo({ fullName: v })} />
                <InputField label={t('labels.jobTitle')} value={data.personalInfo.jobTitle} onChange={(v: any) => updatePersonalInfo({ jobTitle: v })} />
              </div>
              <div className="flex items-center gap-4">
                {data.personalInfo.photo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline-variant shrink-0">
                    <img src={data.personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline-variant cursor-pointer hover:bg-surface-variant/30 transition-colors text-sm text-primary font-medium">
                  <Icon name="add_a_photo" className="text-[18px]" />
                  {data.personalInfo.photo ? t('common.uploadPhoto') : 'Add Photo'}
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file || file.size > 2 * 1024 * 1024) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => updatePersonalInfo({ photo: ev.target?.result as string });
                      reader.readAsDataURL(file);
                      e.target.value = '';
                    }}
                  />
                </label>
                {data.personalInfo.photo && (
                  <button
                    onClick={() => updatePersonalInfo({ photo: undefined })}
                    className="text-sm text-error hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-5">
                <InputField label={t('labels.email')} value={data.personalInfo.email} onChange={(v: any) => updatePersonalInfo({ email: v })} />
                <InputField label={t('labels.phone')} value={data.personalInfo.phone} onChange={(v: any) => updatePersonalInfo({ phone: v })} />
              </div>
              <InputField label={t('labels.address')} value={data.personalInfo.address} onChange={(v: any) => updatePersonalInfo({ address: v })} />
              <div className="grid grid-cols-2 gap-5">
                <InputField label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v: any) => updatePersonalInfo({ linkedin: v })} />
                <InputField label="GitHub" value={data.personalInfo.github} onChange={(v: any) => updatePersonalInfo({ github: v })} />
                <InputField label="Portfolio" value={data.personalInfo.portfolio} onChange={(v: any) => updatePersonalInfo({ portfolio: v })} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label-small text-label-small text-primary">{t('sections.summary')}</label>
                  <button
                    onClick={() => handleRewrite('summary', data.personalInfo.summary, null, data.personalInfo.jobTitle)}
                    disabled={rewriteState.id === null && rewriteState.loading}
                    className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                  >
                    {rewriteState.id === null && rewriteState.loading ? (
                      <><div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> Rewriting...</>
                    ) : (
                      <><Icon name="auto_awesome" className="text-[14px]" /> AI Rewrite</>
                    )}
                  </button>
                </div>
                <RichTextEditor
                  label=""
                  content={data.personalInfo.summary}
                  onChange={(v) => updatePersonalInfo({ summary: v })}
                  placeholder="Write a brief professional summary..."
                />
                {rewriteState.id === null && rewriteState.result && (
                  <div className="mt-3 rounded-xl border border-primary/20 bg-primary-container/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-primary-container/20 border-b border-primary/10">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name="auto_awesome" className="text-[12px] text-primary" />
                        </div>
                        <span className="text-xs font-medium text-primary">AI Suggestions</span>
                      </div>
                      <button
                        onClick={() => setRewriteState({ id: null, loading: false, result: null })}
                        className="text-[10px] text-on-surface-variant hover:text-primary px-2 py-1 rounded hover:bg-surface/50 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {(Array.isArray(rewriteState.result) ? rewriteState.result : rewriteState.result.versions || []).map((version: any, i: number) => (
                        <button
                          key={i}
                          onClick={() => {
                            updatePersonalInfo({ summary: typeof version === 'string' ? version : Array.isArray(version) ? version.join('\n') : version });
                            setRewriteState({ id: null, loading: false, result: null });
                          }}
                          className="w-full text-left text-sm p-3 rounded-xl border border-outline-variant bg-white hover:border-primary hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex-1 leading-relaxed">
                              {typeof version === 'string' ? version : Array.isArray(version) ? version.map((b: string) => `• ${b}`).join('\n') : JSON.stringify(version)}
                            </span>
                            <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">Apply</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.experience')}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Detail your work experience.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-variant/60 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.expFilled > 0 ? '#14B8A6' : '#EF4444' }}></span>
                {sectionProgress.expFilled} entries
              </div>
            </div>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden group">
                <div className="flex items-center justify-between px-5 py-3 bg-surface-container-low/30 border-b border-outline-variant/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-container/30 flex items-center justify-center text-primary">
                      <Icon name="work" className="text-[18px]" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-on-surface">{exp.position || 'New Position'}</span>
                      {exp.company && <span className="text-xs text-on-surface-variant ml-1.5">at {exp.company}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-on-surface-variant hover:text-error transition-all p-1.5 rounded-lg hover:bg-error-container/40 opacity-0 group-hover:opacity-100"
                    title="Remove Experience"
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>
                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label={t('labels.company')} value={exp.company} onChange={(v: any) => updateExperience(exp.id, { company: v })} />
                    <InputField label={t('labels.position')} value={exp.position} onChange={(v: any) => updateExperience(exp.id, { position: v })} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label={t('labels.startDate')} value={exp.startDate} onChange={(v: any) => updateExperience(exp.id, { startDate: v })} />
                    <InputField label={t('labels.endDate')} value={exp.endDate} onChange={(v: any) => updateExperience(exp.id, { endDate: v })} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-label-small text-label-small text-primary">{t('labels.description')}</label>
                      <button
                        onClick={() => handleRewrite('bullets', exp.bulletPoints, exp.id)}
                        disabled={rewriteState.id === exp.id && rewriteState.loading}
                        className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                      >
                        {rewriteState.id === exp.id && rewriteState.loading ? (
                          <><div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> Rewriting...</>
                        ) : (
                          <><Icon name="auto_awesome" className="text-[14px]" /> AI Rewrite</>
                        )}
                      </button>
                    </div>
                    <RichTextEditor
                      label=""
                      content={exp.bulletPoints}
                      onChange={(v) => updateExperience(exp.id, { bulletPoints: v })}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                {rewriteState.id === exp.id && rewriteState.result && (
                  <div className="mt-3 rounded-xl border border-primary/20 bg-primary-container/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-primary-container/20 border-b border-primary/10">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon name="auto_awesome" className="text-[12px] text-primary" />
                        </div>
                        <span className="text-xs font-medium text-primary">AI Suggestions</span>
                      </div>
                      <button
                        onClick={() => setRewriteState({ id: null, loading: false, result: null })}
                        className="text-[10px] text-on-surface-variant hover:text-primary px-2 py-1 rounded hover:bg-surface/50 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                    <div className="p-3 space-y-2">
                      {(rewriteState.result.versions || []).map((version: string[], i: number) => (
                        <button
                          key={i}
                          onClick={() => {
                            const html = `<ul>${version.map((b: string) => `<li>${b}</li>`).join('')}</ul>`;
                            updateExperience(exp.id, { bulletPoints: html });
                            setRewriteState({ id: null, loading: false, result: null });
                          }}
                          className="w-full text-left text-sm p-3 rounded-xl border border-outline-variant bg-white hover:border-primary hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex-1 leading-relaxed whitespace-pre-line">{version.map((b: string) => `• ${b}`).join('\n')}</span>
                            <span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">Apply</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2.5 text-primary font-medium hover:bg-primary-container/10 hover:border-primary/30 transition-all duration-200 group">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center group-hover:bg-primary-container/40 transition-colors">
                <Icon name="add" className="text-[20px] text-primary" />
              </div>
              <span>{t('common.add') || 'Add Experience'}</span>
            </button>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.education')}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Detail your academic background to establish your foundation.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-variant/60 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.eduFilled > 0 ? '#14B8A6' : '#EF4444' }}></span>
                {sectionProgress.eduFilled} entries
              </div>
            </div>
            {data.educations.map((edu) => (
              <div key={edu.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden group">
                <div className="flex items-center justify-between px-5 py-3 bg-surface-container-low/30 border-b border-outline-variant/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                      <Icon name="school" className="text-[18px]" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-on-surface">{edu.degree || 'New Degree'}</span>
                      {edu.school && <span className="text-xs text-on-surface-variant ml-1.5">at {edu.school}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-on-surface-variant hover:text-error transition-all p-1.5 rounded-lg hover:bg-error-container/40 opacity-0 group-hover:opacity-100"
                    title="Remove Education"
                  >
                    <Icon name="delete" className="text-[18px]" />
                  </button>
                </div>
                <div className="p-5 space-y-5">
                  <InputField label={t('labels.school')} value={edu.school} onChange={(v: any) => updateEducation(edu.id, { school: v })} />
                  <InputField label={t('labels.degree')} value={edu.degree} onChange={(v: any) => updateEducation(edu.id, { degree: v })} />
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label={t('labels.startDate')} value={edu.startDate} onChange={(v: any) => updateEducation(edu.id, { startDate: v })} />
                    <InputField label={t('labels.endDate')} value={edu.endDate} onChange={(v: any) => updateEducation(edu.id, { endDate: v })} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2.5 text-primary font-medium hover:bg-primary-container/10 hover:border-primary/30 transition-all duration-200 group">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center group-hover:bg-primary-container/40 transition-colors">
                <Icon name="add" className="text-[20px] text-primary" />
              </div>
              <span>{t('common.add') || 'Add Education'}</span>
            </button>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.skills')}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Add skills relevant to your expertise.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant bg-surface-variant/60 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.skillCount > 0 ? '#14B8A6' : '#EF4444' }}></span>
                {sectionProgress.skillCount} skills
              </div>
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
                <button
                  type="button"
                  onClick={handleSuggestSkills}
                  disabled={suggestSkillsLoading}
                  className="px-4 rounded border border-primary text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1 text-sm"
                >
                  {suggestSkillsLoading ? (
                    <><div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div></>
                  ) : (
                    <Icon name="auto_awesome" className="text-[18px]" />
                  )}
                  Suggest AI
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
              {suggestedSkills.length > 0 && (
                <div className="border-t border-outline-variant pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="auto_awesome" className="text-[12px] text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary">AI Suggested Skills</span>
                    <span className="text-[10px] text-on-surface-variant">— click to add</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSkills.filter(s => !data.skills.includes(s)).map((skill, i) => (
                      <button
                        key={i}
                        onClick={() => { addSkill(skill); setSuggestedSkills(prev => prev.filter(s => s !== skill)); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container/30 text-primary rounded-full text-xs font-medium hover:bg-primary-container/60 transition-colors border border-primary/20 hover:border-primary/40"
                      >
                        <Icon name="add" className="text-[14px]" /> {skill}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSuggestedSkills([])}
                    className="text-[10px] text-on-surface-variant hover:text-primary mt-2.5 px-2 py-1 rounded hover:bg-surface-variant/50 transition-colors"
                  >
                    Dismiss suggestions
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'analysis':
        const aiResult = aiState.result || analysis;
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">AI Analysis</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">CV Score and optimization tips.</p>
              </div>
              {aiState.loading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              )}
            </div>

            {aiState.error && (
              <div className="flex items-start gap-3 bg-error-container/20 p-3 rounded border border-error-container text-sm text-on-surface">
                <Icon name="error" className="text-error mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">AI unavailable — showing rule-based analysis</p>
                  <p className="text-xs text-on-surface-variant mt-1">{aiState.error}</p>
                </div>
              </div>
            )}

            {!aiState.loading && (
              <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm space-y-6">
                <div className="flex items-center gap-6 mb-4">
                  <ScoreGauge value={aiResult.total} size={110} thickness={8} label="ATS Score" />
                  <div className="flex-1 space-y-1.5">
                    {[
                      { key: t('analysis.breakdown.personal'), score: aiResult.breakdown.personal, max: 15 },
                      { key: t('analysis.breakdown.summary'), score: aiResult.breakdown.summary, max: 15 },
                      { key: t('analysis.breakdown.experience'), score: aiResult.breakdown.experience, max: 40 },
                      { key: t('analysis.breakdown.education'), score: aiResult.breakdown.education, max: 15 },
                      { key: t('analysis.breakdown.skills'), score: aiResult.breakdown.skills, max: 15 },
                    ].map((item) => {
                      const pct = item.score / item.max;
                      const barColor = pct >= 0.7 ? '#14B8A6' : pct >= 0.4 ? '#F59E0B' : '#EF4444';
                      return (
                        <div key={item.key}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-on-surface font-medium">{item.key}</span>
                            <span className="text-on-surface-variant">{item.score}/{item.max}</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct * 100}%`, backgroundColor: barColor }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {aiState.result && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">AI Powered</span>
                    <span className="text-[10px] text-on-surface-variant">Real-time analysis</span>
                  </div>
                )}

                <div className="border-t border-outline-variant pt-4 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Contact', score: aiResult.details.contactCompleteness.score, max: aiResult.details.contactCompleteness.max, icon: 'contact_page' },
                    { label: 'Metrics', score: aiResult.details.quantifiableMetrics.score, max: aiResult.details.quantifiableMetrics.max, icon: 'bar_chart' },
                    { label: 'Action Verbs', score: aiResult.details.actionVerbs.score, max: aiResult.details.actionVerbs.max, icon: 'flash_on' },
                  ].map(item => {
                    const pct = item.score / item.max;
                    const color = pct >= 0.7 ? '#14B8A6' : pct >= 0.4 ? '#F59E0B' : '#EF4444';
                    const R = 14;
                    const circ = 2 * Math.PI * R;
                    const off = circ * (1 - Math.min(pct, 1));
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-1.5 bg-surface-variant/30 rounded-xl p-3">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                          <svg width="40" height="40" className="transform -rotate-90">
                            <circle cx="20" cy="20" r={R} fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-variant" />
                            <circle cx="20" cy="20" r={R} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                              strokeDasharray={circ} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
                          </svg>
                          <Icon name={item.icon} className="text-[14px] absolute" style={{ color }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color }}>{item.score}/{item.max}</span>
                        <span className="text-[9px] text-on-surface-variant uppercase tracking-wider font-medium">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider">{t('labels.topSuggestions')}</h4>
                  {aiResult.suggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-error-container/15 p-3.5 rounded-xl border border-error-container/30 text-sm text-on-surface">
                      <div className="w-6 h-6 rounded-full bg-error-container/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="priority_high" className="text-[14px] text-error" />
                      </div>
                      <span className="leading-relaxed">{suggestion}</span>
                    </div>
                  ))}
                  {aiResult.suggestions.length === 0 && (
                    <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 p-3.5 rounded-xl border border-green-200/60">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Icon name="check_circle" className="text-[16px] text-green-600" />
                      </div>
                      <span className="font-bold">{t('analysis.perfect')}!</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'match':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Job Match</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Paste a job description to see how your CV matches.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm space-y-5">
              <textarea
                value={jdText}
                onChange={e => setJdText(e.target.value)}
                placeholder="Paste job description here..."
                rows={8}
                className="w-full px-4 py-3 rounded border border-outline bg-transparent focus:border-primary focus:border-2 focus:outline-none font-body-md text-body-md text-on-surface resize-none"
              />
              <button
                onClick={handleMatch}
                disabled={matchLoading || !jdText.trim()}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {matchLoading ? (
                  <><div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div> Analyzing...</>
                ) : (
                  <><Icon name="search_insights" className="text-[20px]" /> Analyze Match</>
                )}
              </button>
            </div>

            {matchResult && (
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
                <div className="flex items-center gap-6">
                  <ScoreGauge value={matchResult.matchScore} max={100} size={100} thickness={7} label="% Match" />
                  <div className="flex-1 space-y-1.5">
                    {[
                      { key: 'Keywords', score: matchResult.breakdown.keywords },
                      { key: 'Skills', score: matchResult.breakdown.skills },
                      { key: 'Experience', score: matchResult.breakdown.experience },
                      { key: 'Education', score: matchResult.breakdown.education },
                    ].map(item => {
                      const barColor = item.score >= 70 ? '#14B8A6' : item.score >= 45 ? '#F59E0B' : '#EF4444';
                      return (
                        <div key={item.key}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-on-surface font-medium">{item.key}</span>
                            <span className="text-on-surface-variant">{item.score}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.score}%`, backgroundColor: barColor }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {matchResult.experienceGap && (
                  <div className="bg-tertiary-container/10 border border-tertiary-container/30 rounded-lg p-3.5">
                    <p className="text-sm text-on-surface">{matchResult.experienceGap}</p>
                  </div>
                )}

                {matchResult.missingKeywords.length > 0 && (
                  <div className="border-t border-outline-variant pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-label-small text-label-small text-error uppercase tracking-wider">Missing Keywords</h4>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-error-container/40 text-error">{matchResult.missingKeywords.length}</span>
                      <span className="text-[10px] text-on-surface-variant ml-auto">Click to add to your CV</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingKeywords.map((kw: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => { addSkill(kw); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-error-container/30 text-error rounded-full text-xs font-medium hover:bg-error-container/60 transition-colors border border-error/20 hover:border-error/40"
                        >
                          <Icon name="add" className="text-[14px]" /> {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.matchingKeywords.length > 0 && (
                  <div className="border-t border-outline-variant pt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-label-small text-label-small text-green-600 uppercase tracking-wider">Matching Keywords</h4>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-50 text-green-700">{matchResult.matchingKeywords.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matchingKeywords.map((kw: string, i: number) => (
                        <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200/60">
                          <Icon name="check" className="text-[14px] shrink-0" /> {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.suggestions && matchResult.suggestions.length > 0 && (
                  <div className="border-t border-outline-variant pt-4 space-y-2.5">
                    <h4 className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider">Suggestions</h4>
                    {matchResult.suggestions.map((s: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-primary-container/15 p-3.5 rounded-xl border border-primary-container/30 text-sm text-on-surface">
                        <div className="w-6 h-6 rounded-full bg-primary-container/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon name="lightbulb" className="text-[14px] text-primary" />
                        </div>
                        <span className="leading-relaxed">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'templates':
        const templates = [
          {
            id: 'standard', name: 'The International Standard',
            tags: ['ATS', 'Corporate'],
            colors: ['#0061a4', '#d1e4ff', '#ffffff'],
            layout: '2-col'
          },
          {
            id: 'executive', name: 'The Minimalist CEO',
            tags: ['Executive', 'Serif'],
            colors: ['#1e293b', '#f8f9ff', '#ffffff'],
            layout: 'centered'
          },
          {
            id: 'tech', name: 'The Pixels Code',
            tags: ['Modern', 'Dark'],
            colors: ['#0f172a', '#1e293b', '#ffffff'],
            layout: 'sidebar'
          },
          {
            id: 'creative', name: 'The Creative Portfolio',
            tags: ['Creative', 'Bold'],
            colors: ['#6b5778', '#f3daff', '#ffffff'],
            layout: 'asymmetric'
          }
        ];
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Templates</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Choose a design for your CV.</p>
              </div>
              <div className="text-xs text-on-surface-variant bg-surface-variant/50 px-3 py-1.5 rounded-full font-medium">
                {currentTemplate === 'standard' ? 'Standard' : currentTemplate === 'executive' ? 'Executive' : currentTemplate === 'tech' ? 'Tech' : 'Creative'} selected
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id as any)}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-300 text-left ${
                    currentTemplate === t.id 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface shadow-lg shadow-primary/10' 
                      : 'border border-outline-variant hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  {/* Mini preview */}
                  <div className="h-28 bg-white p-3 flex items-start gap-1.5 relative overflow-hidden">
                    {/* Layout representation */}
                    {t.layout === '2-col' && (
                      <>
                        <div className="w-1/3 h-full rounded bg-[#d1e4ff]/40 flex flex-col gap-1 p-1.5">
                          <div className="h-1.5 rounded-full bg-[#0061a4]/20 w-3/4"></div>
                          <div className="h-1 rounded-full bg-[#0061a4]/10 w-1/2"></div>
                          <div className="h-1 rounded-full bg-[#0061a4]/10 w-2/3"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-1 p-1.5">
                          <div className="h-2 rounded bg-gray-200 w-1/2"></div>
                          <div className="h-1 rounded bg-gray-100 w-full"></div>
                          <div className="h-1 rounded bg-gray-100 w-full"></div>
                          <div className="h-1 rounded bg-gray-100 w-3/4"></div>
                        </div>
                      </>
                    )}
                    {t.layout === 'centered' && (
                      <div className="w-full flex flex-col items-center gap-1.5 p-2">
                        <div className="h-2 rounded bg-gray-300 w-1/3"></div>
                        <div className="h-1 rounded bg-gray-200 w-1/4"></div>
                        <div className="w-full h-px bg-gray-200 my-1"></div>
                        <div className="h-1 rounded bg-gray-100 w-full"></div>
                        <div className="h-1 rounded bg-gray-100 w-full"></div>
                        <div className="h-1 rounded bg-gray-100 w-2/3"></div>
                      </div>
                    )}
                    {t.layout === 'sidebar' && (
                      <>
                        <div className="w-[30%] h-full rounded bg-[#0f172a] flex flex-col gap-1 p-1.5">
                          <div className="h-1.5 rounded bg-white/20 w-3/4"></div>
                          <div className="h-1 rounded bg-white/10 w-full"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-1 p-1.5">
                          <div className="h-2 rounded bg-gray-200 w-1/2"></div>
                          <div className="h-1 rounded bg-gray-100 w-full"></div>
                          <div className="h-1 rounded bg-gray-100 w-full"></div>
                        </div>
                      </>
                    )}
                    {t.layout === 'asymmetric' && (
                      <div className="w-full flex gap-1.5 p-1.5">
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="h-2 rounded bg-gray-300 w-3/4"></div>
                          <div className="h-1 rounded bg-gray-100 w-full"></div>
                          <div className="h-1 rounded bg-gray-100 w-full"></div>
                        </div>
                        <div className="w-1/4 h-full rounded bg-[#6b5778]/20 flex flex-col gap-1 p-1">
                          <div className="h-1 rounded bg-[#6b5778]/10 w-full"></div>
                          <div className="h-1 rounded bg-[#6b5778]/10 w-full"></div>
                        </div>
                      </div>
                    )}
                    {/* Selected checkmark */}
                    {currentTemplate === t.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                        <Icon name="check" className="text-[12px] text-on-primary" />
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-3 bg-surface">
                    <div className="font-title-md text-title-md text-on-surface font-bold group-hover:text-primary transition-colors">{t.name}</div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {t.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.settings')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Customize your CV appearance and manage data.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant shadow-sm space-y-8">
              <div>
                <h3 className="font-label-small text-label-small uppercase tracking-widest text-on-surface-variant mb-4">{t('labels.color')}</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border border-outline-variant cursor-pointer"
                  />
                  <span className="text-sm text-on-surface-variant font-mono">{primaryColor}</span>
                </div>
              </div>
              <div>
                <h3 className="font-label-small text-label-small uppercase tracking-widest text-on-surface-variant mb-4">{t('labels.font')}</h3>
                <div className="flex gap-2">
                  {(['sans', 'serif', 'mono'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFontFamily(f)}
                      className={`px-6 py-3 rounded-lg border text-sm font-medium transition-all ${
                        fontFamily === f
                          ? 'border-primary bg-primary-container/20 text-primary ring-2 ring-primary/20'
                          : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-label-small text-label-small uppercase tracking-widest text-on-surface-variant mb-4">{t('labels.dataManagement')}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{t('labels.tip')}</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (window.confirm(t('common.confirmReset'))) {
                        resetData();
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl border border-error text-error text-sm font-medium hover:bg-error-container/20 transition-colors flex items-center gap-2"
                  >
                    <Icon name="delete_forever" className="text-[18px]" />
                    {t('common.reset')}
                  </button>
                  <span className="text-[10px] text-on-surface-variant">This action cannot be undone</span>
                </div>
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
      <header className="h-[72px] bg-surface flex items-center justify-between px-6 border-b border-surface-variant shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-primary font-bold text-xl tracking-tight flex items-center gap-1">
            SwiftCv
          </div>
          <div className="w-px h-6 bg-surface-variant"></div>
          <span className="text-on-surface-variant font-medium">{t(`templates.${currentTemplate}.name`)}</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-10 px-4 rounded-full border border-outline text-primary font-medium hover:bg-primary/5 transition-colors text-sm"
          >
            {t('common.import')}
          </button>
          <button
            onClick={handleExportJSON}
            className="h-10 px-4 rounded-full border border-outline text-primary font-medium hover:bg-primary/5 transition-colors text-sm"
          >
            {t('common.export')}
          </button>
          <button 
            onClick={() => {
              const newLang = language === 'en' ? 'vi' : 'en';
              setLanguage(newLang);
              i18n.changeLanguage(newLang);
            }}
            className="h-10 px-6 rounded-full border border-outline text-primary font-medium hover:bg-primary/5 transition-colors uppercase"
          >
            {language}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="md:hidden h-10 w-10 rounded-full border border-outline text-primary flex items-center justify-center hover:bg-primary/5 transition-colors"
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            <Icon name="visibility" className="text-[20px]" filled={showPreview} />
          </button>
          <button 
            onClick={handlePrint}
            disabled={isDownloading}
            className={`h-10 px-6 rounded-full bg-primary text-on-primary font-medium transition-colors shadow-sm flex items-center justify-center gap-2 ${
              isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                Downloading...
              </>
            ) : (
              'Download PDF'
            )}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Full-screen Loading Overlay */}
        {isDownloading && (
          <div className="absolute inset-0 z-50 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="bg-surface-container p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-headline-md text-on-surface mb-2">Generating PDF...</h3>
              <p className="text-body-md text-on-surface-variant">Please wait a moment while we prepare your high-quality resume. This may take a few seconds.</p>
            </div>
          </div>
        )}

        {/* Left Panel: Editor (40%) */}
        <section className="w-full md:w-[40%] bg-surface flex border-r border-outline-variant h-full overflow-hidden shrink-0">
          {/* Vertical Sidebar */}
          <nav className="w-16 lg:w-20 shrink-0 bg-surface-container-low border-r border-outline-variant flex flex-col items-center py-3 gap-0.5 overflow-y-auto no-scrollbar">
            {formTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-12 lg:w-16 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-primary-container/30 text-primary font-medium' 
                    : 'text-on-surface-variant hover:bg-surface-variant/60 hover:text-on-surface'
                }`}
                title={tab.label}
              >
                <Icon name={tab.icon} className="text-[20px] lg:text-[22px]" filled={activeTab === tab.id} />
                <span className="text-[9px] lg:text-[10px] font-medium leading-tight">{tab.short}</span>
              </button>
            ))}
            <div className="w-8 h-px bg-outline-variant/50 my-1.5"></div>
            {toolTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-12 lg:w-16 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-primary-container/30 text-primary font-medium' 
                    : 'text-on-surface-variant hover:bg-surface-variant/60 hover:text-on-surface'
                }`}
                title={tab.label}
              >
                <Icon name={tab.icon} className="text-[20px] lg:text-[22px]" filled={activeTab === tab.id} />
                <span className="text-[9px] lg:text-[10px] font-medium leading-tight">{tab.short}</span>
              </button>
            ))}
          </nav>
          
          {/* Editor Content Area */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
            {renderTabContent()}
          </div>
        </section>

        {/* Right Panel: Canvas Preview (60%) */}
        <section className={`flex-col w-[60%] bg-surface-container-low p-8 overflow-y-auto items-center custom-scrollbar ${showPreview ? 'flex absolute inset-0 z-40 md:relative' : 'hidden md:flex'}`}>
          {/* Canvas Toolbar */}
          <div className="w-full max-w-[850px] flex justify-between items-center mb-6 no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="md:hidden h-10 w-10 rounded-full bg-surface border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
              <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full border border-surface-variant shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6]"></span>
                <span className="text-xs font-medium text-on-surface-variant">Auto-saved</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                className="w-10 h-10 rounded-full bg-surface border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 shadow-sm transition-colors"
              >
                <Icon name="zoom_out" className="text-[20px]" />
              </button>
              <span className="font-label-small text-label-small text-on-surface-variant w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
                className="w-10 h-10 rounded-full bg-surface border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 shadow-sm transition-colors"
              >
                <Icon name="zoom_in" className="text-[20px]" />
              </button>
            </div>
          </div>

          {/* The CV Paper */}
          <div 
            ref={resumeRef}
            className="cv-paper bg-white w-full max-w-[850px] min-h-[1100px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 flex flex-col font-cv-serif text-on-surface overflow-hidden"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          >
            {currentTemplate === 'standard' && <StandardTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'executive' && <MinimalistTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'tech' && <PixelsTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'creative' && <CreativeTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
          </div>
          <div className="h-16 w-full shrink-0 no-print"></div>
        </section>
      </main>
    </div>
  );
}

export default App;