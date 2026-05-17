import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from './store/useCVStore';
import type { JobStatus } from './store/useCVStore';
import html2pdf from 'html2pdf.js';
import { StandardTemplate } from './components/templates/StandardTemplate';
import { MinimalistTemplate } from './components/templates/MinimalistTemplate';
import { PixelsTemplate } from './components/templates/PixelsTemplate';
import { CreativeTemplate } from './components/templates/CreativeTemplate';
import { ModernTemplate } from './components/templates/ModernTemplate';
import { TimelineTemplate } from './components/templates/TimelineTemplate';
import { ElegantTemplate } from './components/templates/ElegantTemplate';
import { ProfessionalTemplate } from './components/templates/ProfessionalTemplate';
import { VibrantTemplate } from './components/templates/VibrantTemplate';
import { CompactTemplate } from './components/templates/CompactTemplate';
import { AcademicTemplate } from './components/templates/AcademicTemplate';
import { GradientTemplate } from './components/templates/GradientTemplate';
import { NatureTemplate } from './components/templates/NatureTemplate';
import { BoldTemplate } from './components/templates/BoldTemplate';
import { SidebarTemplate } from './components/templates/SidebarTemplate';
import { MinimalTemplate } from './components/templates/MinimalTemplate';
import { RichTextEditor } from './components/RichTextEditor';
import { TemplateOnboarding } from './components/TemplateOnboarding';
import { TEMPLATE_META, CATEGORY_LABELS, CATEGORY_ORDER } from './data/templateMeta';
import type { TemplateCategory } from './data/templateMeta';
import { analyzeCV as apiAnalyze, rewriteSummary, rewriteBullets, suggestSkills, generateSummary, matchJD, saveCVToCloud, generateCoverLetter, createCheckoutSession, importLinkedIn } from './services/api';
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
    cvs,
    currentCvId,
    createCV,
    switchCV,
    deleteCV,
    renameCV,
    coverLetters,
    addCoverLetter,
    removeCoverLetter,
    jobs,
    addJob,
    removeJob,
    moveJob,
    userTier,
    usageCount,
  } = useCVStore();
  
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'analysis' | 'design' | 'settings' | 'match' | 'coverletter' | 'jobtracker' | 'pricing'>('design');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [templateFilter, setTemplateFilter] = useState<TemplateCategory>('all');
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [aiState, setAiState] = useState<{ loading: boolean; result: any; error: string | null }>({ loading: false, result: null, error: null });
  const [aiErrorToast, setAiErrorToast] = useState<string | null>(null);
  const [rewriteState, setRewriteState] = useState<{ id: string | null; loading: boolean; result: any }>({ id: null, loading: false, result: null });
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);
  const [generateSummaryLoading, setGenerateSummaryLoading] = useState(false);
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [showCvMenu, setShowCvMenu] = useState(false);
  const [renamingCv, setRenamingCv] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const cvMenuRef = useRef<HTMLDivElement>(null);
  const templateSwitcherRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (templateSwitcherRef.current && !templateSwitcherRef.current.contains(e.target as Node)) {
        setShowTemplateSwitcher(false);
      }
    };
    if (showTemplateSwitcher) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showTemplateSwitcher]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cvMenuRef.current && !cvMenuRef.current.contains(e.target as Node)) {
        setShowCvMenu(false);
      }
    };
    if (showCvMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCvMenu]);


  const [coverLetterForm, setCoverLetterForm] = useState<{ companyName: string; jobTitle: string; tone: 'professional' | 'modern' }>({ companyName: '', jobTitle: '', tone: 'professional' });
  const [linkedinImportText, setLinkedinImportText] = useState('');
  const [linkedinImportLoading, setLinkedinImportLoading] = useState(false);
  const [clResult, setClResult] = useState<any>(null);
  const [clLoading, setClLoading] = useState(false);

  const [newJob, setNewJob] = useState<{ company: string; position: string; url: string }>({ company: '', position: '', url: '' });

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
        setAiErrorToast(err.message.includes('401') ? 'AI API key không hợp lệ. Kiểm tra OPENCODE_API_KEY trong .env' : `AI unavailable — ${err.message}`);
        setTimeout(() => setAiErrorToast(null), 8000);
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
      setAiErrorToast(`AI Rewrite thất bại: ${err.message}`);
      setTimeout(() => setAiErrorToast(null), 6000);
    }
  };

  const handleSuggestSkills = async () => {
    setSuggestSkillsLoading(true);
    try {
      const skills = await suggestSkills(data.experiences, data.personalInfo.summary, data.skills, language);
      setSuggestedSkills(Array.isArray(skills) ? skills : []);
    } catch (err: any) {
      setSuggestedSkills([]);
      setAiErrorToast(`AI Suggest thất bại: ${err.message}`);
      setTimeout(() => setAiErrorToast(null), 6000);
    } finally {
      setSuggestSkillsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setGenerateSummaryLoading(true);
    try {
      const result = await generateSummary(data.experiences, data.educations, data.personalInfo.jobTitle, language);
      setRewriteState({ id: null, loading: false, result: Array.isArray(result) ? result : [] });
    } catch (err: any) {
      setAiErrorToast(`AI Generate thất bại: ${err.message}`);
      setTimeout(() => setAiErrorToast(null), 6000);
    } finally {
      setGenerateSummaryLoading(false);
    }
  };

  const handleMatch = async () => {
    if (!jdText.trim()) return;
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const result = await matchJD(data, jdText, language);
      setMatchResult(result);
    } catch (err: any) {
      setMatchResult(null);
      setAiErrorToast(`Job Match thất bại: ${err.message}`);
      setTimeout(() => setAiErrorToast(null), 6000);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleCloudSync = async () => {
    setSyncStatus('syncing');
    try {
      const project = { id: currentCvId, name: cvs.find(c => c.id === currentCvId)?.name || 'My CV', data, template: currentTemplate, primaryColor, fontFamily, updatedAt: new Date().toISOString() };
      await saveCVToCloud(project as any);
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => { });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(handleCloudSync, 5000);
    return () => clearTimeout(timer);
  }, [data, currentTemplate, primaryColor, fontFamily]);

  const handleCreateCV = () => {
    setShowOnboarding(true);
    setShowCvMenu(false);
  };

  const handleDeleteCV = (id: string) => {
    deleteCV(id);
    setShowCvMenu(false);
  };

  const handleStartRename = (id: string, currentName: string) => {
    setRenamingCv(id);
    setRenameValue(currentName);
  };

  const handleFinishRename = (id: string) => {
    if (renameValue.trim()) renameCV(id, renameValue.trim());
    setRenamingCv(null);
    setRenameValue('');
  };

  const handleGenerateCoverLetter = async () => {
    if (!coverLetterForm.companyName.trim()) return;
    setClLoading(true);
    setClResult(null);
    try {
      const result = await generateCoverLetter(data, coverLetterForm.companyName, coverLetterForm.jobTitle, coverLetterForm.tone, language);
      setClResult(result);
      addCoverLetter({
        id: crypto.randomUUID(),
        companyName: coverLetterForm.companyName,
        jobTitle: coverLetterForm.jobTitle,
        content: result.body || '',
        tone: coverLetterForm.tone,
        createdAt: new Date().toISOString(),
      });
    } catch {
      setClResult(null);
    } finally {
      setClLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    const priceIds: Record<string, string> = { pro: 'price_pro', business: 'price_business', lifetime: 'price_lifetime' };
    const priceId = priceIds[tier];
    if (!priceId) return;
    try {
      const result = await createCheckoutSession(priceId);
      if (result.url) window.location.href = result.url;
    } catch { }
  };

  const handleLinkedInImport = async () => {
    if (!linkedinImportText.trim()) return;
    setLinkedinImportLoading(true);
    try {
      const result = await importLinkedIn(linkedinImportText);
      if (result.fullName || result.experiences) {
        importData({
          personalInfo: {
            fullName: result.fullName || data.personalInfo.fullName,
            jobTitle: result.jobTitle || data.personalInfo.jobTitle,
            email: result.email || data.personalInfo.email,
            phone: result.phone || data.personalInfo.phone,
            address: result.address || data.personalInfo.address,
            summary: result.summary || data.personalInfo.summary,
            linkedin: result.linkedin || data.personalInfo.linkedin,
          },
          experiences: result.experiences || data.experiences,
          educations: result.educations || data.educations,
          skills: result.skills || data.skills,
        });
      }
    } catch { }
    setLinkedinImportLoading(false);
  };

  const handleAddJob = () => {
    if (!newJob.company.trim() || !newJob.position.trim()) return;
    addJob({ company: newJob.company, position: newJob.position, url: newJob.url, status: 'saved', notes: '' });
    setNewJob({ company: '', position: '', url: '' });
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

  const contentTabs = [
    { id: 'personal', label: t('sections.personal'), icon: 'person', short: 'Info' },
    { id: 'experience', label: t('sections.experience'), icon: 'work', short: 'Work' },
    { id: 'education', label: t('sections.education'), icon: 'school', short: 'Edu' },
    { id: 'skills', label: t('sections.skills') || 'Skills', icon: 'psychology', short: 'Skills' },
  ];
  const toolTabs = [
    { id: 'analysis', label: 'AI Analysis', icon: 'insights', short: 'AI' },
    { id: 'match', label: 'Job Match', icon: 'search_insights', short: 'Match' },
    { id: 'jobtracker', label: 'Job Tracker', icon: 'track_changes', short: 'Jobs' },
    { id: 'coverletter', label: 'Cover Letter', icon: 'article', short: 'Cover' },
  ];
  const designTabs = [
    { id: 'design', label: t('sections.design') || 'Design', icon: 'palette', short: 'Design' },
    { id: 'settings', label: t('sections.settings'), icon: 'settings', short: 'Setup' },
    { id: 'pricing', label: 'Upgrade', icon: 'workspace_premium', short: 'Pro' },
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
             <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm space-y-4 sm:space-y-5">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                 <InputField label={t('labels.fullName')} value={data.personalInfo.fullName} onChange={(v: any) => updatePersonalInfo({ fullName: v })} />
                 <InputField label={t('labels.jobTitle')} value={data.personalInfo.jobTitle} onChange={(v: any) => updatePersonalInfo({ jobTitle: v })} />
               </div>
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                 <InputField label={t('labels.email')} value={data.personalInfo.email} onChange={(v: any) => updatePersonalInfo({ email: v })} />
                 <InputField label={t('labels.phone')} value={data.personalInfo.phone} onChange={(v: any) => updatePersonalInfo({ phone: v })} />
               </div>
               <InputField label={t('labels.address')} value={data.personalInfo.address} onChange={(v: any) => updatePersonalInfo({ address: v })} />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                 <InputField label="LinkedIn" value={data.personalInfo.linkedin} onChange={(v: any) => updatePersonalInfo({ linkedin: v })} />
                 <InputField label="GitHub" value={data.personalInfo.github} onChange={(v: any) => updatePersonalInfo({ github: v })} />
                 <InputField label="Portfolio" value={data.personalInfo.portfolio} onChange={(v: any) => updatePersonalInfo({ portfolio: v })} />
               </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-label-small text-label-small text-primary">{t('sections.summary')}</label>
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={handleGenerateSummary}
                      disabled={generateSummaryLoading}
                      className="flex items-center gap-1 text-xs text-secondary font-medium hover:underline"
                    >
                      {generateSummaryLoading ? (
                        <><div className="w-3 h-3 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div> Generating...</>
                      ) : (
                        <><Icon name="auto_fix" className="text-[14px]" /> Generate</>
                      )}
                    </button>
                  </div>
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
               <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                     <InputField label={t('labels.company')} value={exp.company} onChange={(v: any) => updateExperience(exp.id, { company: v })} />
                     <InputField label={t('labels.position')} value={exp.position} onChange={(v: any) => updateExperience(exp.id, { position: v })} />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
               <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                   <InputField label={t('labels.school')} value={edu.school} onChange={(v: any) => updateEducation(edu.id, { school: v })} />
                   <InputField label={t('labels.degree')} value={edu.degree} onChange={(v: any) => updateEducation(edu.id, { degree: v })} />
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
             <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-lg border border-outline-variant shadow-sm space-y-4 sm:space-y-5">
               <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-2">
                 <div className="flex-1 relative">
                   <input
                     type="text"
                     value={newSkill}
                     onChange={(e) => setNewSkill(e.target.value)}
                     placeholder="E.g., React, UI Design..."
                     className="w-full px-4 py-3 rounded border border-outline bg-transparent focus:border-primary focus:border-2 focus:outline-none font-body-md text-body-md text-on-surface"
                   />
                 </div>
                 <div className="flex gap-2">
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
                     <span className="hidden sm:inline">Suggest AI</span>
                   </button>
                 </div>
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
                  <p className="font-medium">AI unavailable</p>
                  <p className="text-xs text-on-surface-variant mt-1">{aiState.error}</p>
                </div>
              </div>
            )}

             {!aiState.loading && aiState.result && (
               <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-lg border border-outline-variant shadow-sm space-y-6">
                 <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-4">
                   <ScoreGauge value={aiState.result.total} size={110} thickness={8} label="ATS Score" />
                   <div className="flex-1 w-full space-y-1.5">
                    {[
                      { key: t('analysis.breakdown.personal'), score: aiState.result.breakdown.personal, max: 15 },
                      { key: t('analysis.breakdown.summary'), score: aiState.result.breakdown.summary, max: 15 },
                      { key: t('analysis.breakdown.experience'), score: aiState.result.breakdown.experience, max: 40 },
                      { key: t('analysis.breakdown.education'), score: aiState.result.breakdown.education, max: 15 },
                      { key: t('analysis.breakdown.skills'), score: aiState.result.breakdown.skills, max: 15 },
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

                <div className="border-t border-outline-variant pt-4 grid grid-cols-3 gap-2 sm:gap-4">
                  {[
                    { label: 'Contact', score: aiState.result.details.contactCompleteness.score, max: aiState.result.details.contactCompleteness.max, icon: 'contact_page' },
                    { label: 'Metrics', score: aiState.result.details.quantifiableMetrics.score, max: aiState.result.details.quantifiableMetrics.max, icon: 'bar_chart' },
                    { label: 'Action Verbs', score: aiState.result.details.actionVerbs.score, max: aiState.result.details.actionVerbs.max, icon: 'flash_on' },
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
                  {aiState.result.suggestions.map((suggestion: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 bg-error-container/15 p-3.5 rounded-xl border border-error-container/30 text-sm text-on-surface">
                      <div className="w-6 h-6 rounded-full bg-error-container/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon name="priority_high" className="text-[14px] text-error" />
                      </div>
                      <span className="leading-relaxed">{suggestion}</span>
                    </div>
                  ))}
                  {aiState.result.suggestions.length === 0 && (
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
             <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-lg border border-outline-variant shadow-sm space-y-4 sm:space-y-5">
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
               <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm space-y-6">
                 <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                   <ScoreGauge value={matchResult.matchScore} max={100} size={100} thickness={7} label="% Match" />
                   <div className="flex-1 w-full space-y-1.5">
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

      case 'design':
        const allTemplates = Object.values(TEMPLATE_META);
        const filteredDesign = templateFilter === 'all'
          ? allTemplates
          : allTemplates.filter((t) => t.category.includes(templateFilter));
        const isLockedTemplate = (t: typeof allTemplates[0]) => {
          if (userTier !== 'free') return false;
          return t.isPremium;
        };
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{t('sections.design')}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Choose a design for your CV.</p>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTemplateFilter(cat)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    templateFilter === cat
                      ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                      : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:border-primary/40 hover:text-on-surface'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredDesign.map((t) => {
                const locked = isLockedTemplate(t);
                const isSelected = currentTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => !locked && setTemplate(t.id as any)}
                    disabled={locked}
                    className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface shadow-xl shadow-primary/10 scale-[1.02]'
                        : locked
                        ? 'opacity-60 cursor-not-allowed border border-outline-variant'
                        : 'border border-outline-variant hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1'
                    }`}
                  >
                    <div className="h-36 sm:h-44 bg-white relative overflow-hidden">
                      {/* Mini preview using layout */}
                      {t.layout === '2-col' && (
                        <div className="w-full h-full flex gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}>
                          <div className="w-[35%] h-full rounded-md flex flex-col gap-1 p-1.5" style={{ background: t.colors[1] + '30' }}>
                            <div className="h-2 rounded-full w-3/4" style={{ background: t.colors[0] + '40' }}></div>
                            <div className="h-1.5 rounded-full w-1/2" style={{ background: t.colors[0] + '25' }}></div>
                            <div className="h-1.5 rounded-full w-2/3" style={{ background: t.colors[0] + '25' }}></div>
                          </div>
                          <div className="flex-1 flex flex-col gap-1 p-1">
                            <div className="h-2.5 rounded w-1/2" style={{ background: '#e2e8f0' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                            <div className="h-1.5 rounded w-3/4" style={{ background: '#f1f5f9' }}></div>
                          </div>
                        </div>
                      )}
                      {t.layout === 'sidebar' && (
                        <div className="w-full h-full flex gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}>
                          <div className="w-[30%] h-full rounded-md flex flex-col gap-1 p-1.5" style={{ background: t.colors[0] }}>
                            <div className="h-2 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
                            <div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.12)' }}></div>
                          </div>
                          <div className="flex-1 flex flex-col gap-1 p-1">
                            <div className="h-2.5 rounded w-1/2" style={{ background: '#e2e8f0' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                          </div>
                        </div>
                      )}
                      {t.layout === 'asymmetric' && (
                        <div className="w-full h-full flex gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}>
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="h-2.5 rounded w-3/4" style={{ background: '#e2e8f0' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                          </div>
                          <div className="w-[28%] h-full rounded-md flex flex-col gap-1 p-1" style={{ background: t.colors[1] + '35' }}>
                            <div className="h-1.5 rounded w-full" style={{ background: t.colors[0] + '20' }}></div>
                            <div className="h-1.5 rounded w-full" style={{ background: t.colors[0] + '20' }}></div>
                          </div>
                        </div>
                      )}
                      {t.layout === 'centered' && (
                        <div className="w-full h-full flex flex-col items-center gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}>
                          <div className="h-2.5 rounded w-1/3" style={{ background: '#e2e8f0' }}></div>
                          <div className="h-1.5 rounded w-1/4" style={{ background: t.colors[0] + '35' }}></div>
                          <div className="w-full h-px my-1" style={{ background: '#e2e8f0' }}></div>
                          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
                          <div className="h-1.5 rounded w-2/3" style={{ background: '#f1f5f9' }}></div>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Icon name="check" className="text-[20px] text-on-primary" />
                          </div>
                        </div>
                      )}
                      {locked && (
                        <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-outline-variant shadow-sm">
                            <Icon name="workspace_premium" className="text-[14px] text-amber-500" />
                            <span className="text-xs font-medium text-on-surface">Pro</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-surface">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`font-semibold text-sm sm:text-base group-hover:text-primary transition-colors ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {t.name}
                        </h3>
                        {t.isPremium && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wider">Pro</span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">{t.description}</p>
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-variant/60 text-on-surface-variant">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'coverletter':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Cover Letter</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Generate AI-powered cover letters tailored to each job.</p>
            </div>
             <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-lg border border-outline-variant shadow-sm space-y-4 sm:space-y-5">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <InputField label="Company Name" value={coverLetterForm.companyName} onChange={(v: any) => setCoverLetterForm(f => ({ ...f, companyName: v }))} />
                 <InputField label="Job Title (optional)" value={coverLetterForm.jobTitle} onChange={(v: any) => setCoverLetterForm(f => ({ ...f, jobTitle: v }))} />
               </div>
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                 <label className="font-label-small text-label-small text-primary">Tone</label>
                 <div className="flex gap-2">
                   {(['professional', 'modern'] as const).map(tone => (
                     <button
                       key={tone}
                       onClick={() => setCoverLetterForm(f => ({ ...f, tone }))}
                       className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${coverLetterForm.tone === tone ? 'border-primary bg-primary-container/20 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary/50'}`}
                     >
                       {tone === 'professional' ? 'Professional' : 'Modern'}
                     </button>
                   ))}
                 </div>
               </div>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={clLoading || !coverLetterForm.companyName.trim()}
                className="w-full h-12 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {clLoading ? (
                  <><div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div> Generating...</>
                ) : (
                  <><Icon name="auto_awesome" className="text-[20px]" /> Generate Cover Letter</>
                )}
              </button>
            </div>
             {clResult && (
               <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-xl border border-outline-variant shadow-sm">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                   <h3 className="font-title-md text-title-md text-on-surface">Preview</h3>
                   <div className="flex gap-2">
                     <button
                       onClick={() => {
                         const blob = new Blob([clResult.body || ''], { type: 'text/plain' });
                         const url = URL.createObjectURL(blob);
                         const a = document.createElement('a');
                         a.href = url;
                         a.download = `Cover_Letter_${coverLetterForm.companyName.replace(/\s+/g, '_')}.txt`;
                         a.click();
                         URL.revokeObjectURL(url);
                       }}
                       className="px-4 py-2 rounded-lg border border-outline text-primary text-sm font-medium hover:bg-primary/5"
                     >
                       <Icon name="download" className="text-[14px]" /> Download
                     </button>
                   </div>
                 </div>
                 <div className="bg-white border border-outline-variant rounded-xl p-4 sm:p-6 w-full max-w-[650px] mx-auto">
                   {clResult.subject && <div className="font-bold text-lg mb-3">{clResult.subject}</div>}
                   <div className="text-sm leading-relaxed whitespace-pre-line text-on-surface">{clResult.body}</div>
                   {clResult.salutation && <div className="mt-4 text-sm text-on-surface">{clResult.salutation}</div>}
                 </div>
               </div>
             )}
            {coverLetters.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-label-small text-label-small text-on-surface-variant uppercase tracking-wider">Saved Cover Letters</h3>
                {coverLetters.map(cl => (
                  <div key={cl.id} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{cl.companyName}</div>
                      <div className="text-xs text-on-surface-variant">{cl.jobTitle || 'No title'} · {cl.tone} · {new Date(cl.createdAt).toLocaleDateString()}</div>
                    </div>
                    <button onClick={() => removeCoverLetter(cl.id)} className="text-on-surface-variant hover:text-error p-1">
                      <Icon name="delete" className="text-[16px]" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'jobtracker':
        const statusColumns: { key: JobStatus; label: string; color: string; bg: string }[] = [
          { key: 'saved', label: 'Saved', color: '#6366F1', bg: '#EEF2FF' },
          { key: 'applied', label: 'Applied', color: '#F59E0B', bg: '#FFFBEB' },
          { key: 'interview', label: 'Interview', color: '#10B981', bg: '#ECFDF5' },
          { key: 'offer', label: 'Offer', color: '#8B5CF6', bg: '#F5F3FF' },
          { key: 'rejected', label: 'Rejected', color: '#EF4444', bg: '#FEF2F2' },
        ];
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Job Tracker</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Track your job applications in a Kanban board.</p>
            </div>
             <div className="bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-outline-variant shadow-sm">
               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                 <input value={newJob.company} onChange={e => setNewJob(j => ({ ...j, company: e.target.value }))} placeholder="Company" className="flex-1 px-3 py-2 rounded border border-outline bg-transparent text-sm focus:border-primary focus:outline-none" />
                 <input value={newJob.position} onChange={e => setNewJob(j => ({ ...j, position: e.target.value }))} placeholder="Position" className="flex-1 px-3 py-2 rounded border border-outline bg-transparent text-sm focus:border-primary focus:outline-none" />
                 <input value={newJob.url} onChange={e => setNewJob(j => ({ ...j, url: e.target.value }))} placeholder="URL (optional)" className="flex-1 px-3 py-2 rounded border border-outline bg-transparent text-sm focus:border-primary focus:outline-none" />
                 <button onClick={handleAddJob} className="px-4 py-2 rounded bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-1">
                   <Icon name="add" className="text-[18px]" />
                   <span className="sm:hidden">Add</span>
                 </button>
               </div>
             </div>
             <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
               {statusColumns.map(col => {
                 const colJobs = jobs.filter(j => j.status === col.key);
                 return (
                   <div key={col.key} className="flex-1 min-w-[260px] sm:min-w-[200px] bg-surface-container-lowest rounded-xl border border-outline-variant p-3 snap-start">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }}></div>
                      <span className="text-sm font-semibold text-on-surface">{col.label}</span>
                      <span className="text-xs text-on-surface-variant ml-auto">{colJobs.length}</span>
                    </div>
                    <div className="space-y-2">
                      {colJobs.map(job => (
                        <div key={job.id} className="bg-white rounded-lg border border-outline-variant p-3 group hover:shadow-sm transition-shadow">
                          <div className="font-medium text-sm text-on-surface">{job.position}</div>
                          <div className="text-xs text-on-surface-variant mt-0.5">{job.company}</div>
                          {job.url && <a href={job.url} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline mt-1 block truncate">{job.url}</a>}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                            <span className="text-[9px] text-on-surface-variant">{new Date(job.updatedAt).toLocaleDateString()}</span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {statusColumns.filter(c => c.key !== col.key).map(c => (
                                <button key={c.key} onClick={() => moveJob(job.id, c.key)} title={`Move to ${c.label}`} className="w-4 h-4 rounded-full hover:scale-110 transition-transform" style={{ backgroundColor: c.color }}></button>
                              ))}
                              <button onClick={() => removeJob(job.id)} className="text-[10px] text-error hover:underline">✕</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {colJobs.length === 0 && (
                        <div className="text-xs text-on-surface-variant/50 text-center py-6">No jobs</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'pricing':
        const tiers = [
          { id: 'free', name: 'Free', price: '$0', description: 'Get started with basic features', features: ['1 CV', '5 AI analyses/month', '2 templates', 'PDF with watermark'] },
          { id: 'pro', name: 'Pro', price: '$7.99', period: '/month', description: 'For serious job seekers', features: ['Unlimited CVs', 'Unlimited AI analyses', 'All 6 templates', 'Clean PDF export', 'JD Matching', 'JSON export', 'Priority support'], popular: true },
          { id: 'business', name: 'Business', price: '$14.99', period: '/month', description: 'For professionals & teams', features: ['Everything in Pro', '16 templates total', 'Premium AI models', 'Cover letter builder', 'Team sharing'], popular: false },
          { id: 'lifetime', name: 'Lifetime', price: '$129', period: ' once', description: 'Pay once, own forever', features: ['Everything in Pro', 'All future updates', 'Lifetime access', 'All 16 templates'], popular: false },
        ];
        return (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-6xl mx-auto">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Upgrade Your Plan</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Choose the plan that fits your needs.</p>
            </div>
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
               <div className="flex items-center gap-2 text-sm">
                 <Icon name="bar_chart" className="text-[18px] text-primary" />
                 <span className="text-on-surface-variant">AI Usage:</span>
                 <span className="font-bold text-on-surface">{usageCount} calls</span>
                 <span className="text-on-surface-variant">/ month</span>
               </div>
               <div className="flex-1 h-2 bg-surface-variant rounded-full w-full sm:max-w-[200px]">
                 <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min((usageCount / 5) * 100, 100)}%` }}></div>
               </div>
               {userTier === 'free' && usageCount >= 5 && (
                 <button onClick={() => setActiveTab('pricing')} className="text-xs text-primary font-medium hover:underline">
                   Upgrade to continue
                 </button>
               )}
             </div>
             <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {tiers.map(tier => {
                const isCurrent = userTier === tier.id;
                return (
                  <div key={tier.id} className={`relative rounded-2xl overflow-hidden ${tier.popular ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface bg-gradient-to-b from-primary/5 to-transparent' : 'bg-surface-container-lowest border border-outline-variant'}`}>
                    {tier.popular && <div className="bg-primary text-on-primary text-[10px] font-bold text-center py-1.5 uppercase tracking-widest">Most Popular</div>}
                    <div className="p-6 space-y-5">
                      <div>
                        <h3 className="font-title-md text-title-md text-on-surface">{tier.name}</h3>
                        <div className="mt-3 flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-on-surface">{tier.price}</span>
                          {tier.period && <span className="text-sm text-on-surface-variant">{tier.period}</span>}
                        </div>
                        <p className="text-xs text-on-surface-variant mt-2">{tier.description}</p>
                      </div>
                      <ul className="space-y-3">
                        {tier.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface">
                            <Icon name="check_circle" className="text-[16px] text-[#14B8A6] shrink-0 mt-0.5" /> {f}
                          </li>
                        ))}
                      </ul>
                      {isCurrent ? (
                        <div className="w-full py-3 rounded-xl bg-surface-variant text-on-surface-variant text-sm font-semibold text-center">
                          Current Plan
                        </div>
                      ) : tier.id === 'free' ? (
                        <div className="text-xs text-on-surface-variant text-center py-3 font-medium">Always free</div>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(tier.id)}
                          className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${tier.popular ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-lg shadow-primary/20' : 'border-2 border-primary text-primary hover:bg-primary/5'}`}
                        >
                          {userTier === 'free' ? 'Upgrade' : 'Switch Plan'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
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
             <div className="bg-surface-container-lowest p-4 sm:p-6 rounded-lg border border-outline-variant shadow-sm space-y-6 sm:space-y-8">
               <div>
                 <h3 className="font-label-small text-label-small uppercase tracking-widest text-on-surface-variant mb-4">{t('labels.color')}</h3>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
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
                 <div className="flex flex-wrap gap-2">
                   {(['sans', 'serif', 'mono'] as const).map((f) => (
                     <button
                       key={f}
                       onClick={() => setFontFamily(f)}
                       className={`px-4 sm:px-6 py-3 rounded-lg border text-sm font-medium transition-all ${
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
                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                   <button
                     onClick={() => {
                       if (window.confirm(t('common.confirmReset'))) {
                         resetData();
                       }
                     }}
                     className="px-5 py-2.5 rounded-xl border border-error text-error text-sm font-medium hover:bg-error-container/20 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                   >
                     <Icon name="delete_forever" className="text-[18px]" />
                     {t('common.reset')}
                   </button>
                   <span className="text-[10px] text-on-surface-variant">This action cannot be undone</span>
                 </div>
               </div>
               <div className="border-t border-outline-variant pt-6">
                 <h3 className="font-label-small text-label-small uppercase tracking-widest text-on-surface-variant mb-4">LinkedIn Import</h3>
                 <p className="text-sm text-on-surface-variant mb-3">Paste text from a LinkedIn profile or PDF export to auto-fill your CV.</p>
                 <textarea
                   value={linkedinImportText}
                   onChange={e => setLinkedinImportText(e.target.value)}
                   placeholder="Paste LinkedIn profile text here..."
                   rows={5}
                   className="w-full px-4 py-3 rounded border border-outline bg-transparent focus:border-primary focus:border-2 focus:outline-none font-body-md text-body-md text-on-surface resize-none text-sm"
                 />
                 <button
                   onClick={handleLinkedInImport}
                   disabled={linkedinImportLoading || !linkedinImportText.trim()}
                   className="mt-3 px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 w-full sm:w-auto justify-center"
                 >
                   {linkedinImportLoading ? (
                     <><div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div> Importing...</>
                   ) : (
                     <><Icon name="download" className="text-[18px]" /> Import from Text</>
                   )}
                 </button>
               </div>
              <div className="border-t border-outline-variant pt-6">
                <h3 className="font-label-small text-label-small uppercase tracking-widest text-on-surface-variant mb-4">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { code: 'en', name: 'English' },
                    { code: 'vi', name: 'Tiếng Việt' },
                    { code: 'ja', name: '日本語' },
                    { code: 'ko', name: '한국어' },
                    { code: 'zh', name: '中文' },
                    { code: 'es', name: 'Español' },
                    { code: 'fr', name: 'Français' },
                    { code: 'de', name: 'Deutsch' },
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (language !== lang.code) {
                          setLanguage(lang.code as any);
                          i18n.changeLanguage(lang.code as any);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        language === lang.code
                          ? 'border-primary bg-primary-container/20 text-primary'
                          : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

   const isOnboarding = showOnboarding || cvs.length === 0;

   if (isOnboarding) {
     return (
       <TemplateOnboarding
         userTier={userTier}
         onSelect={(template) => {
           createCV('My CV');
           setTemplate(template);
           setShowOnboarding(false);
         }}
       />
     );
   }

   return (
     <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-hidden">
       {/* AI Error Toast */}
       {aiErrorToast && (
         <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4 animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="bg-error-container border border-error-container rounded-xl shadow-lg p-4 flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center shrink-0 mt-0.5">
               <Icon name="error" className="text-[18px] text-error" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-on-error-container">{aiErrorToast}</p>
               <p className="text-xs text-on-error-container/70 mt-1">Kiểm tra API key trong .env hoặc thử lại sau.</p>
             </div>
             <button onClick={() => setAiErrorToast(null)} className="text-on-error-container/60 hover:text-on-error-container shrink-0">
               <Icon name="close" className="text-[18px]" />
             </button>
           </div>
         </div>
       )}
       {/* TopAppBar */}
      <header className="h-[64px] sm:h-[72px] bg-surface flex items-center justify-between px-3 sm:px-4 border-b border-surface-variant shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="text-primary font-bold text-lg sm:text-xl tracking-tight shrink-0">SwiftCv</div>
          <div className="w-px h-5 sm:h-6 bg-surface-variant hidden sm:block"></div>
           <div className="relative hidden sm:block" ref={cvMenuRef}>
             <button
               onClick={() => setShowCvMenu(!showCvMenu)}
               className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-variant/50 transition-colors text-sm font-medium text-on-surface"
             >
               <Icon name="description" className="text-[18px] text-primary" />
               <span className="max-w-[120px] truncate">{cvs.find(c => c.id === currentCvId)?.name || 'My CV'}</span>
               <Icon name="expand_more" className={`text-[16px] text-on-surface-variant transition-transform ${showCvMenu ? 'rotate-180' : ''}`} />
             </button>
             {showCvMenu && (
               <div className="absolute top-full left-0 mt-1 w-56 bg-surface border border-outline-variant rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                 {cvs.map(cv => (
                   <div key={cv.id} className="flex items-center gap-1 px-3 py-2 hover:bg-surface-variant/50 group cursor-pointer">
                     {renamingCv === cv.id ? (
                       <input
                         value={renameValue}
                         onChange={e => setRenameValue(e.target.value)}
                         onBlur={() => handleFinishRename(cv.id)}
                         onKeyDown={e => e.key === 'Enter' && handleFinishRename(cv.id)}
                         className="flex-1 text-sm px-2 py-0.5 rounded border border-outline bg-transparent focus:border-primary focus:outline-none"
                         autoFocus
                       />
                     ) : (
                       <button
                         onClick={() => { switchCV(cv.id); setShowCvMenu(false); }}
                         className={`flex-1 text-left text-sm ${currentCvId === cv.id ? 'font-bold text-primary' : 'text-on-surface'}`}
                       >
                         {cv.name}
                       </button>
                     )}
                     {currentCvId === cv.id && <Icon name="check" className="text-[14px] text-primary shrink-0" />}
                     <button onClick={() => handleStartRename(cv.id, cv.name)} className="opacity-0 group-hover:opacity-100 text-[12px] text-on-surface-variant hover:text-primary p-0.5">
                       <Icon name="edit" className="text-[14px]" />
                     </button>
                     {cvs.length > 1 && (
                       <button onClick={() => handleDeleteCV(cv.id)} className="opacity-0 group-hover:opacity-100 text-[12px] text-on-surface-variant hover:text-error p-0.5">
                         <Icon name="delete" className="text-[14px]" />
                       </button>
                     )}
                   </div>
                 ))}
                 <div className="border-t border-outline-variant my-1"></div>
                  <button onMouseDown={(e) => { e.stopPropagation(); handleCreateCV(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium hover:bg-surface-variant/50">
                    <Icon name="add" className="text-[16px]" /> New CV
                  </button>
                </div>
              )}
            </div>
            {/* Mobile CV selector */}
           <div className="sm:hidden relative" ref={cvMenuRef}>
             <button
               onClick={() => setShowCvMenu(!showCvMenu)}
               className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-variant/50 transition-colors text-xs font-medium text-on-surface"
             >
               <Icon name="description" className="text-[16px] text-primary" />
               <span className="max-w-[80px] truncate">{cvs.find(c => c.id === currentCvId)?.name || 'My CV'}</span>
               <Icon name="expand_more" className={`text-[14px] text-on-surface-variant transition-transform ${showCvMenu ? 'rotate-180' : ''}`} />
             </button>
             {showCvMenu && (
               <div className="absolute top-full left-0 mt-1 w-48 bg-surface border border-outline-variant rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                 {cvs.map(cv => (
                   <div key={cv.id} className="flex items-center gap-1 px-3 py-2 hover:bg-surface-variant/50 cursor-pointer">
                     <button
                       onClick={() => { switchCV(cv.id); setShowCvMenu(false); }}
                       className={`flex-1 text-left text-sm ${currentCvId === cv.id ? 'font-bold text-primary' : 'text-on-surface'}`}
                     >
                       {cv.name}
                     </button>
                     {currentCvId === cv.id && <Icon name="check" className="text-[14px] text-primary shrink-0" />}
                   </div>
                 ))}
                 <div className="border-t border-outline-variant my-1"></div>
                  <button onMouseDown={(e) => { e.stopPropagation(); handleCreateCV(); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium hover:bg-surface-variant/50">
                    <Icon name="add" className="text-[16px]" /> New CV
                  </button>
                </div>
              )}
            </div>
         </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="sm:hidden h-9 w-9 rounded-full border border-outline flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
          >
            <Icon name={showMobileMenu ? "close" : "more_vert"} className="text-[20px]" />
          </button>
          {/* Mobile dropdown menu */}
          {showMobileMenu && (
            <div className="sm:hidden absolute top-[64px] right-3 w-48 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 py-2">
              <button
                onClick={() => { fileInputRef.current?.click(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/50"
              >
                <Icon name="upload_file" className="text-[18px] text-primary" /> Import JSON
              </button>
              <button
                onClick={() => { handleExportJSON(); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/50"
              >
                <Icon name="download" className="text-[18px] text-primary" /> Export JSON
              </button>
              <button 
                onClick={() => {
                  const newLang = language === 'en' ? 'vi' : 'en';
                  setLanguage(newLang);
                  i18n.changeLanguage(newLang);
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant/50 uppercase"
              >
                <Icon name="language" className="text-[18px] text-primary" /> {language}
              </button>
              <button
                onClick={() => { setActiveTab('pricing'); setShowMobileMenu(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700 hover:bg-surface-variant/50"
              >
                <Icon name="workspace_premium" className="text-[18px]" /> {userTier === 'free' ? 'Upgrade' : 'Plan'}
              </button>
            </div>
          )}
          {/* Desktop buttons */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:flex items-center h-10 px-4 rounded-full border border-outline text-primary font-medium hover:bg-primary/5 transition-colors text-sm"
          >
            {t('common.import')}
          </button>
          <button
            onClick={handleExportJSON}
            className="hidden sm:flex items-center h-10 px-4 rounded-full border border-outline text-primary font-medium hover:bg-primary/5 transition-colors text-sm"
          >
            {t('common.export')}
          </button>
          <button 
            onClick={() => {
              const newLang = language === 'en' ? 'vi' : 'en';
              setLanguage(newLang);
              i18n.changeLanguage(newLang);
            }}
            className="hidden sm:flex items-center h-10 px-4 sm:px-6 rounded-full border border-outline text-primary font-medium hover:bg-primary/5 transition-colors uppercase text-sm"
          >
            {language}
          </button>
          {userTier !== 'free' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
              <Icon name="workspace_premium" className="text-[14px]" />
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
            </div>
          )}
          <button
            onClick={() => setActiveTab('pricing')}
            className="hidden sm:flex h-10 px-4 rounded-full border border-amber-300 bg-amber-50 text-amber-700 font-medium hover:bg-amber-100 transition-colors text-sm items-center gap-1"
          >
            <Icon name="workspace_premium" className="text-[16px]" />
            {userTier === 'free' ? 'Upgrade' : 'Plan'}
          </button>
          <button className="hidden sm:flex h-10 w-10 rounded-full border border-outline items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 transition-colors" title="Sign in">
            <Icon name="account_circle" className="text-[20px]" />
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="sm:hidden h-9 w-9 rounded-full border border-outline text-primary flex items-center justify-center hover:bg-primary/5 transition-colors"
            title={showPreview ? 'Hide preview' : 'Show preview'}
          >
            <Icon name="visibility" className="text-[20px]" filled={showPreview} />
          </button>
          <button 
            onClick={handlePrint}
            disabled={isDownloading}
            className={`h-9 sm:h-10 px-3 sm:px-6 rounded-full bg-primary text-on-primary font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm ${
              isDownloading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'
            }`}
          >
            {isDownloading ? (
              <>
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Downloading...</span>
                <span className="sm:hidden">PDF</span>
              </>
            ) : (
              <><span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">PDF</span></>
            )}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Full-screen Loading Overlay */}
        {isDownloading && (
          <div className="absolute inset-0 z-50 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="bg-surface-container p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-4 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4 sm:mb-6"></div>
              <h3 className="text-lg sm:text-xl font-headline-md text-on-surface mb-2">Generating PDF...</h3>
              <p className="text-sm sm:text-body-md text-on-surface-variant">Please wait a moment while we prepare your high-quality resume.</p>
            </div>
          </div>
        )}

        {/* Left Panel: Editor */}
        <section className={`bg-surface flex border-r border-outline-variant h-full overflow-hidden shrink-0 ${activeTab === 'pricing' ? 'w-full' : 'w-full md:w-[40%] lg:w-[45%]'}`}>
           {/* Vertical Sidebar - Desktop */}
          <nav className="hidden sm:flex w-16 lg:w-20 shrink-0 bg-surface-container-low border-r border-outline-variant flex-col items-center py-3 gap-0.5 overflow-y-auto no-scrollbar">
            {/* Design Group — FIRST for template-first UX */}
            <div className="mb-0.5 px-2 lg:px-3 w-full">
              <span className="text-[8px] lg:text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-[0.15em] block text-center">{t('sidebar.design')}</span>
            </div>
            {designTabs.map((tab) => (
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
            {/* Content Group */}
            {contentTabs.map((tab) => (
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
            {/* Tools Group */}
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

          {/* Mobile Bottom Navigation */}
          <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-low border-t border-outline-variant flex items-center justify-around py-1 px-1 safe-area-bottom">
            {[designTabs[0], ...contentTabs.slice(0, 3)].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-container/30 text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon name={tab.icon} className="text-[20px]" filled={activeTab === tab.id} />
                <span className="text-[9px] font-medium leading-tight">{tab.short}</span>
              </button>
            ))}
            <div className="w-px h-6 bg-outline-variant/50 mx-1"></div>
            {[...toolTabs.slice(0, 2)].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary-container/30 text-primary'
                    : 'text-on-surface-variant'
                }`}
              >
                <Icon name={tab.icon} className="text-[20px]" filled={activeTab === tab.id} />
                <span className="text-[9px] font-medium leading-tight">{tab.short}</span>
              </button>
            ))}
          </nav>
          
          {/* Editor Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar pb-20 sm:pb-6">
            {renderTabContent()}
          </div>
        </section>

        {/* Right Panel: Canvas Preview */}
        <section className={`flex-col bg-surface-container-low p-4 sm:p-6 md:p-8 overflow-y-auto items-center custom-scrollbar ${activeTab === 'pricing' ? 'hidden' : ''} ${showPreview ? 'flex absolute inset-0 z-40 md:relative md:inset-auto' : 'hidden md:flex'} ${activeTab !== 'pricing' ? 'w-full md:w-[60%] lg:w-[55%]' : ''}`}>
          {/* Canvas Toolbar */}
          <div className="w-full max-w-[850px] flex justify-between items-center mb-4 sm:mb-6 no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="md:hidden h-9 w-9 rounded-full bg-surface border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 transition-colors"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
              <div className="flex items-center gap-2 bg-surface px-2 sm:px-3 py-1.5 rounded-full border border-surface-variant shadow-sm">
                <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-[#14B8A6]' : syncStatus === 'syncing' ? 'bg-[#F59E0B] animate-pulse' : syncStatus === 'error' ? 'bg-[#EF4444]' : 'bg-[#94A3B8]'}`}></span>
                <span className="text-[10px] sm:text-xs font-medium text-on-surface-variant">
                  {syncStatus === 'synced' ? 'Cloud saved' : syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'error' ? 'Sync error' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Quick Template Switcher */}
              <div className="relative" ref={templateSwitcherRef}>
                <button
                  onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)}
                  className="hidden md:flex items-center gap-1.5 h-9 sm:h-10 px-3 rounded-full bg-surface border border-surface-variant text-on-surface-variant hover:bg-surface-variant/50 shadow-sm transition-colors text-xs sm:text-sm"
                >
                  <Icon name="palette" className="text-[16px] text-primary" />
                  <span className="max-w-[100px] truncate">{TEMPLATE_META[currentTemplate]?.name || 'Template'}</span>
                  <Icon name="expand_more" className={`text-[16px] transition-transform ${showTemplateSwitcher ? 'rotate-180' : ''}`} />
                </button>
                {showTemplateSwitcher && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-surface border border-outline-variant rounded-xl shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
                    <div className="px-3 py-1.5 text-[10px] font-medium text-on-surface-variant uppercase tracking-wider">{t('sections.design')}</div>
                    {Object.values(TEMPLATE_META).map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => { setTemplate(tmpl.id as any); setShowTemplateSwitcher(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-variant/40 transition-colors ${currentTemplate === tmpl.id ? 'bg-primary-container/10' : ''}`}
                      >
                        <div className="w-8 h-10 rounded border border-outline-variant overflow-hidden shrink-0" style={{ background: tmpl.colors[2] || '#fff' }}>
                          <div className="w-full h-full opacity-50" style={{ background: tmpl.colors[0] }}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-medium truncate ${currentTemplate === tmpl.id ? 'text-primary' : 'text-on-surface'}`}>{tmpl.name}</div>
                          <div className="text-[10px] text-on-surface-variant truncate">{tmpl.tags.slice(0, 2).join(' · ')}</div>
                        </div>
                        {currentTemplate === tmpl.id && <Icon name="check" className="text-[16px] text-primary shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 shadow-sm transition-colors"
              >
                <Icon name="zoom_out" className="text-[16px] sm:text-[20px]" />
              </button>
              <span className="font-label-small text-label-small text-on-surface-variant w-10 sm:w-12 text-center text-xs sm:text-sm">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-surface border border-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-variant/50 shadow-sm transition-colors"
              >
                <Icon name="zoom_in" className="text-[16px] sm:text-[20px]" />
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
            {currentTemplate === 'modern' && <ModernTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'timeline' && <TimelineTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'elegant' && <ElegantTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'professional' && <ProfessionalTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'vibrant' && <VibrantTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'compact' && <CompactTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'academic' && <AcademicTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'gradient' && <GradientTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'nature' && <NatureTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'bold' && <BoldTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'sidebar' && <SidebarTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
            {currentTemplate === 'minimal' && <MinimalTemplate data={data} primaryColor={primaryColor} fontFamily={fontFamily} />}
          </div>
          <div className="h-12 sm:h-16 w-full shrink-0 no-print"></div>
        </section>
      </main>
    </div>
  );
}

export default App;