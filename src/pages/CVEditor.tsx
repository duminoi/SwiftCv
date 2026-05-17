import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from '../store/useCVStore';
import { useAuth } from '@clerk/clerk-react';
import html2pdf from 'html2pdf.js';
import { StandardTemplate } from '../components/templates/StandardTemplate';
import { MinimalistTemplate } from '../components/templates/MinimalistTemplate';
import { PixelsTemplate } from '../components/templates/PixelsTemplate';
import { CreativeTemplate } from '../components/templates/CreativeTemplate';
import { ModernTemplate } from '../components/templates/ModernTemplate';
import { TimelineTemplate } from '../components/templates/TimelineTemplate';
import { ElegantTemplate } from '../components/templates/ElegantTemplate';
import { ProfessionalTemplate } from '../components/templates/ProfessionalTemplate';
import { VibrantTemplate } from '../components/templates/VibrantTemplate';
import { CompactTemplate } from '../components/templates/CompactTemplate';
import { AcademicTemplate } from '../components/templates/AcademicTemplate';
import { GradientTemplate } from '../components/templates/GradientTemplate';
import { NatureTemplate } from '../components/templates/NatureTemplate';
import { BoldTemplate } from '../components/templates/BoldTemplate';
import { SidebarTemplate } from '../components/templates/SidebarTemplate';
import { MinimalTemplate } from '../components/templates/MinimalTemplate';
import { RichTextEditor } from '../components/RichTextEditor';
import { TemplateOnboarding } from '../components/TemplateOnboarding';
import { OnboardingGateway } from '../components/OnboardingGateway';
import { CVUpload } from '../components/CVUpload';
import { TEMPLATE_META, CATEGORY_LABELS, CATEGORY_ORDER } from '../data/templateMeta';
import type { TemplateCategory } from '../data/templateMeta';
import { Icon } from '../components/Icon';
import { InputField } from '../components/InputField';
import { ScoreGauge } from '../components/ScoreGauge';
import { TailorReview } from '../components/TailorReview';
import { analyzeCV as apiAnalyze, rewriteSummary, rewriteBullets, suggestSkills, generateSummary, tailorCV } from '../services/api';

export default function CVEditor() {
  const { t, i18n } = useTranslation();
  const { getToken } = useAuth();
  const {
    data, updatePersonalInfo, addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation, addSkill, removeSkill,
    language, setLanguage, currentTemplate, setTemplate, primaryColor, setPrimaryColor,
    fontFamily, setFontFamily, resetData, importData,
    cvs, currentCvId, createCV, switchCV, deleteCV, renameCV,
    userTier,
  } = useCVStore();

  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills' | 'design'>('design');
  const [onboardingStep, setOnboardingStep] = useState<'gateway' | 'template' | 'upload' | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [templateFilter, setTemplateFilter] = useState<TemplateCategory>('all');
  const [showTemplateSwitcher, setShowTemplateSwitcher] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const templateSwitcherRef = useRef<HTMLDivElement>(null);

  const [rewriteState, setRewriteState] = useState<{ id: string | null; loading: boolean; result: any }>({ id: null, loading: false, result: null });
  const [tailorState, setTailorState] = useState<{ step: 'idle' | 'input' | 'loading' | 'review'; jdText: string; result: any }>({ step: 'idle', jdText: '', result: null });
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [suggestSkillsLoading, setSuggestSkillsLoading] = useState(false);
  const [generateSummaryLoading, setGenerateSummaryLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'offline'>('synced');
  const [aiErrorToast, setAiErrorToast] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (cvs.length === 0 && !onboardingStep) {
      setOnboardingStep('gateway');
    }
  }, [cvs.length, onboardingStep]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setSyncStatus('syncing');
      try {
        const token = await getToken();
        const project = { id: currentCvId, name: cvs.find(c => c.id === currentCvId)?.name || 'My CV', data, template: currentTemplate, primaryColor, fontFamily, updatedAt: new Date().toISOString() };
        const { saveCVToCloud } = await import('../services/api');
        await saveCVToCloud(project as any, token || undefined);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('error');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [data, currentTemplate, primaryColor, fontFamily]);

  const sectionProgress = useMemo(() => {
    const pi = data.personalInfo;
    const personalFilled = [pi.fullName, pi.jobTitle, pi.email, pi.phone].filter(Boolean).length;
    const expFilled = data.experiences.filter(e => e.company || e.position).length;
    const eduFilled = data.educations.filter(e => e.school || e.degree).length;
    const skillCount = data.skills.length;
    return { personalFilled, expFilled, eduFilled, skillCount, total: personalFilled + expFilled + eduFilled + skillCount };
  }, [data]);

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

  const handlePrint = async () => {
    if (!resumeRef.current) return;
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 100));
    const styles = document.querySelectorAll('style');
    const originalStyles: string[] = [];
    styles.forEach(style => {
      originalStyles.push(style.textContent || '');
      if (style.textContent) {
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
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Lỗi khi tạo PDF:", error);
    } finally {
      styles.forEach((style, index) => { style.textContent = originalStyles[index]; });
      setIsDownloading(false);
    }
  };

  const handleTailor = async () => {
    if (!tailorState.jdText.trim()) return;
    setTailorState(prev => ({ ...prev, step: 'loading' }));
    try {
      const result = await tailorCV(data, tailorState.jdText, language);
      setTailorState(prev => ({ ...prev, step: 'review', result }));
    } catch (err: any) {
      setAiErrorToast(`Tailor thất bại: ${err.message}`);
      setTimeout(() => setAiErrorToast(null), 6000);
      setTailorState(prev => ({ ...prev, step: 'input' }));
    }
  };

  const handleAcceptAll = () => {
    if (!tailorState.result) return;
    const { tailoredCV } = tailorState.result;
    if (tailoredCV.personalInfo?.summary) {
      updatePersonalInfo({ summary: tailoredCV.personalInfo.summary });
    }
    if (tailoredCV.experiences) {
      tailoredCV.experiences.forEach((exp: any) => {
        const existing = data.experiences.find(e => e.id === exp.id);
        if (existing) {
          updateExperience(exp.id, { bulletPoints: exp.bulletPoints || existing.bulletPoints });
        }
      });
    }
    if (tailoredCV.skills) {
      tailoredCV.skills.forEach((skill: string) => {
        if (!data.skills.includes(skill)) addSkill(skill);
      });
    }
    setTailorState({ step: 'idle', jdText: '', result: null });
  };

  const handleAcceptSection = (section: string) => {
    if (!tailorState.result) return;
    const { tailoredCV } = tailorState.result;
    switch (section) {
      case 'Summary':
        if (tailoredCV.personalInfo?.summary) updatePersonalInfo({ summary: tailoredCV.personalInfo.summary });
        break;
      case 'Skills':
        if (tailoredCV.skills) tailoredCV.skills.forEach((skill: string) => { if (!data.skills.includes(skill)) addSkill(skill); });
        break;
      default:
        if (tailoredCV.experiences) {
          const exp = tailoredCV.experiences.find((e: any) => e.company === section || e.position === section);
          if (exp) updateExperience(exp.id, { bulletPoints: exp.bulletPoints });
        }
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

  if (onboardingStep === 'gateway') {
    return (
      <OnboardingGateway
        onCreateNew={() => setOnboardingStep('template')}
        onUpload={() => setOnboardingStep('upload')}
        onImportLinkedIn={() => { setOnboardingStep(null); }}
      />
    );
  }

  if (onboardingStep === 'template') {
    return (
      <TemplateOnboarding
        userTier={userTier}
        onSelect={(template) => {
          createCV('My CV');
          setTemplate(template);
          setOnboardingStep(null);
        }}
      />
    );
  }

  if (onboardingStep === 'upload') {
    return (
      <CVUpload
        onBack={() => setOnboardingStep('gateway')}
        onDataImported={(result) => {
          importData(result);
          createCV('Imported CV');
          setOnboardingStep(null);
        }}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-xl text-on-surface mb-2">{t('sections.personal')}</h2>
                <p className="text-sm text-on-surface-muted">Manage your personal and contact details.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-muted bg-surface-muted px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.personalFilled >= 4 ? '#14B8A6' : '#F59E0B' }}></span>
                {sectionProgress.personalFilled}/4 filled
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-surface-border shadow-sm space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <InputField label={t('labels.fullName')} value={data.personalInfo.fullName} onChange={(v) => updatePersonalInfo({ fullName: v })} />
                <InputField label={t('labels.jobTitle')} value={data.personalInfo.jobTitle} onChange={(v) => updatePersonalInfo({ jobTitle: v })} />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                {data.personalInfo.photo && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-surface-border shrink-0">
                    <img src={data.personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-border cursor-pointer hover:bg-surface-hover/50 transition-colors text-sm text-primary font-medium">
                  <Icon name="add_a_photo" className="text-[18px]" />
                  {data.personalInfo.photo ? t('common.uploadPhoto') : 'Add Photo'}
                  <input type="file" accept="image/jpeg,image/png" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || file.size > 2 * 1024 * 1024) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => updatePersonalInfo({ photo: ev.target?.result as string });
                    reader.readAsDataURL(file);
                    e.target.value = '';
                  }} />
                </label>
                {data.personalInfo.photo && (
                  <button onClick={() => updatePersonalInfo({ photo: undefined })} className="text-sm text-error hover:underline">Remove</button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <InputField label={t('labels.email')} value={data.personalInfo.email} onChange={(v) => updatePersonalInfo({ email: v })} />
                <InputField label={t('labels.phone')} value={data.personalInfo.phone} onChange={(v) => updatePersonalInfo({ phone: v })} />
              </div>
              <InputField label={t('labels.address')} value={data.personalInfo.address} onChange={(v) => updatePersonalInfo({ address: v })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <InputField label="LinkedIn" value={data.personalInfo.linkedin || ''} onChange={(v) => updatePersonalInfo({ linkedin: v })} />
                <InputField label="GitHub" value={data.personalInfo.github || ''} onChange={(v) => updatePersonalInfo({ github: v })} />
                <InputField label="Portfolio" value={data.personalInfo.portfolio || ''} onChange={(v) => updatePersonalInfo({ portfolio: v })} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-medium text-xs text-primary">{t('sections.summary')}</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleRewrite('summary', data.personalInfo.summary, null, data.personalInfo.jobTitle)} disabled={rewriteState.id === null && rewriteState.loading} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                      {rewriteState.id === null && rewriteState.loading ? <><div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> Rewriting...</> : <><Icon name="auto_awesome" className="text-[14px]" /> AI Rewrite</>}
                    </button>
                    <button onClick={handleGenerateSummary} disabled={generateSummaryLoading} className="flex items-center gap-1 text-xs text-on-surface-muted font-medium hover:underline">
                      {generateSummaryLoading ? <><div className="w-3 h-3 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"></div> Generating...</> : <><Icon name="auto_fix" className="text-[14px]" /> Generate</>}
                    </button>
                  </div>
                </div>
                <RichTextEditor label="" content={data.personalInfo.summary} onChange={(v) => updatePersonalInfo({ summary: v })} placeholder="Write a brief professional summary..." />
                {rewriteState.id === null && rewriteState.result && (
                  <div className="mt-3 rounded-xl border border-primary/20 bg-primary-light/30 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-primary-light/40 border-b border-primary/10">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"><Icon name="auto_awesome" className="text-[12px] text-primary" /></div>
                        <span className="text-xs font-medium text-primary">AI Suggestions</span>
                      </div>
                      <button onClick={() => setRewriteState({ id: null, loading: false, result: null })} className="text-[10px] text-on-surface-muted hover:text-primary px-2 py-1 rounded hover:bg-white/50 transition-colors">Dismiss</button>
                    </div>
                    <div className="p-3 space-y-2">
                      {(Array.isArray(rewriteState.result) ? rewriteState.result : rewriteState.result.versions || []).map((version: any, i: number) => (
                        <button key={i} onClick={() => { updatePersonalInfo({ summary: typeof version === 'string' ? version : Array.isArray(version) ? version.join('\n') : version }); setRewriteState({ id: null, loading: false, result: null }); }} className="w-full text-left text-sm p-3 rounded-xl border border-surface-border bg-white hover:border-primary hover:shadow-sm transition-all group">
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex-1 leading-relaxed">{typeof version === 'string' ? version : Array.isArray(version) ? version.map((b: string) => `• ${b}`).join('\n') : JSON.stringify(version)}</span>
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
                <h2 className="font-bold text-xl text-on-surface mb-2">{t('sections.experience')}</h2>
                <p className="text-sm text-on-surface-muted">Detail your work experience.</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-muted bg-surface-muted px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.expFilled > 0 ? '#14B8A6' : '#EF4444' }}></span>
                {sectionProgress.expFilled} entries
              </div>
            </div>
            {data.experiences.map((exp) => (
              <div key={exp.id} className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden group">
                <div className="flex items-center justify-between px-5 py-3 bg-surface-muted/50 border-b border-surface-border/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary"><Icon name="work" className="text-[18px]" /></div>
                    <div><span className="text-sm font-medium text-on-surface">{exp.position || 'New Position'}</span>{exp.company && <span className="text-xs text-on-surface-muted ml-1.5">at {exp.company}</span>}</div>
                  </div>
                  <button onClick={() => removeExperience(exp.id)} className="text-on-surface-muted hover:text-error transition-all p-1.5 rounded-lg hover:bg-error-container/40 opacity-0 group-hover:opacity-100" title="Remove Experience"><Icon name="delete" className="text-[18px]" /></button>
                </div>
                <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <InputField label={t('labels.company')} value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} />
                    <InputField label={t('labels.position')} value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <InputField label={t('labels.startDate')} value={exp.startDate} onChange={(v) => updateExperience(exp.id, { startDate: v })} />
                    <InputField label={t('labels.endDate')} value={exp.endDate} onChange={(v) => updateExperience(exp.id, { endDate: v })} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-medium text-xs text-primary">{t('labels.description')}</label>
                      <button onClick={() => handleRewrite('bullets', exp.bulletPoints, exp.id)} disabled={rewriteState.id === exp.id && rewriteState.loading} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                        {rewriteState.id === exp.id && rewriteState.loading ? <><div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> Rewriting...</> : <><Icon name="auto_awesome" className="text-[14px]" /> AI Rewrite</>}
                      </button>
                    </div>
                    <RichTextEditor label="" content={exp.bulletPoints} onChange={(v) => updateExperience(exp.id, { bulletPoints: v })} placeholder="Describe your responsibilities and achievements..." />
                    {rewriteState.id === exp.id && rewriteState.result && (
                      <div className="mt-3 rounded-xl border border-primary/20 bg-primary-light/30 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-primary-light/40 border-b border-primary/10">
                          <div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"><Icon name="auto_awesome" className="text-[12px] text-primary" /></div><span className="text-xs font-medium text-primary">AI Suggestions</span></div>
                          <button onClick={() => setRewriteState({ id: null, loading: false, result: null })} className="text-[10px] text-on-surface-muted hover:text-primary px-2 py-1 rounded hover:bg-white/50 transition-colors">Dismiss</button>
                        </div>
                        <div className="p-3 space-y-2">
                          {(rewriteState.result.versions || []).map((version: string[], i: number) => (
                            <button key={i} onClick={() => { const html = `<ul>${version.map((b: string) => `<li>${b}</li>`).join('')}</ul>`; updateExperience(exp.id, { bulletPoints: html }); setRewriteState({ id: null, loading: false, result: null }); }} className="w-full text-left text-sm p-3 rounded-xl border border-surface-border bg-white hover:border-primary hover:shadow-sm transition-all group">
                              <div className="flex items-start justify-between gap-2"><span className="flex-1 leading-relaxed whitespace-pre-line">{version.map((b: string) => `• ${b}`).join('\n')}</span><span className="text-[10px] font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1">Apply</span></div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center gap-2.5 text-primary font-medium hover:bg-primary-light/30 hover:border-primary/30 transition-all duration-200 group">
              <div className="w-8 h-8 rounded-full bg-primary-light/40 flex items-center justify-center group-hover:bg-primary-light/60 transition-colors"><Icon name="add" className="text-[20px] text-primary" /></div>
              <span>{t('common.add') || 'Add Experience'}</span>
            </button>
          </div>
        );
      case 'education':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div><h2 className="font-bold text-xl text-on-surface mb-2">{t('sections.education')}</h2><p className="text-sm text-on-surface-muted">Detail your academic background to establish your foundation.</p></div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-muted bg-surface-muted px-3 py-1.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.eduFilled > 0 ? '#14B8A6' : '#EF4444' }}></span>{sectionProgress.eduFilled} entries</div>
            </div>
            {data.educations.map((edu) => (
              <div key={edu.id} className="bg-white rounded-xl border border-surface-border shadow-sm overflow-hidden group">
                <div className="flex items-center justify-between px-5 py-3 bg-surface-muted/50 border-b border-surface-border/50">
                  <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-lg bg-surface-muted/50 flex items-center justify-center text-on-surface-muted"><Icon name="school" className="text-[18px]" /></div><div><span className="text-sm font-medium text-on-surface">{edu.degree || 'New Degree'}</span>{edu.school && <span className="text-xs text-on-surface-muted ml-1.5">at {edu.school}</span>}</div></div>
                  <button onClick={() => removeEducation(edu.id)} className="text-on-surface-muted hover:text-error transition-all p-1.5 rounded-lg hover:bg-error-container/40 opacity-0 group-hover:opacity-100"><Icon name="delete" className="text-[18px]" /></button>
                </div>
                <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
                  <InputField label={t('labels.school')} value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} />
                  <InputField label={t('labels.degree')} value={edu.degree} onChange={(v) => updateEducation(edu.id, { degree: v })} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <InputField label={t('labels.startDate')} value={edu.startDate} onChange={(v) => updateEducation(edu.id, { startDate: v })} />
                    <InputField label={t('labels.endDate')} value={edu.endDate} onChange={(v) => updateEducation(edu.id, { endDate: v })} />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-surface-border rounded-xl flex items-center justify-center gap-2.5 text-primary font-medium hover:bg-primary-light/30 hover:border-primary/30 transition-all duration-200 group">
              <div className="w-8 h-8 rounded-full bg-primary-light/40 flex items-center justify-center group-hover:bg-primary-light/60 transition-colors"><Icon name="add" className="text-[20px] text-primary" /></div>
              <span>{t('common.add') || 'Add Education'}</span>
            </button>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div><h2 className="font-bold text-xl text-on-surface mb-2">{t('sections.skills')}</h2><p className="text-sm text-on-surface-muted">Add skills relevant to your expertise.</p></div>
              <div className="flex items-center gap-1.5 text-xs text-on-surface-muted bg-surface-muted px-3 py-1.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sectionProgress.skillCount > 0 ? '#14B8A6' : '#EF4444' }}></span>{sectionProgress.skillCount} skills</div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-surface-border shadow-sm space-y-4 sm:space-y-5">
              <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="E.g., React, UI Design..." className="w-full px-4 py-3 rounded border border-surface-border bg-transparent focus:border-primary focus:border-2 focus:outline-none text-sm text-on-surface" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-6 rounded bg-primary text-white font-medium text-base hover:opacity-90 transition-opacity"><Icon name="add" /></button>
                  <button type="button" onClick={handleSuggestSkills} disabled={suggestSkillsLoading} className="px-4 rounded border border-primary text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1 text-sm">
                    {suggestSkillsLoading ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div> : <Icon name="auto_awesome" className="text-[18px]" />}
                    <span className="hidden sm:inline">Suggest AI</span>
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-surface-muted text-on-surface rounded-full text-sm font-medium">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-error transition-colors flex items-center justify-center"><Icon name="close" className="text-[16px]" /></button>
                  </div>
                ))}
              </div>
              {suggestedSkills.length > 0 && (
                <div className="border-t border-surface-border pt-4">
                  <div className="flex items-center gap-2 mb-3"><div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center"><Icon name="auto_awesome" className="text-[12px] text-primary" /></div><span className="text-xs font-medium text-primary">AI Suggested Skills</span><span className="text-[10px] text-on-surface-muted">— click to add</span></div>
                  <div className="flex flex-wrap gap-2">{suggestedSkills.filter(s => !data.skills.includes(s)).map((skill, i) => (<button key={i} onClick={() => { addSkill(skill); setSuggestedSkills(prev => prev.filter(s => s !== skill)); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-light text-primary rounded-full text-xs font-medium hover:bg-primary-light/60 transition-colors border border-primary/20 hover:border-primary/40"><Icon name="add" className="text-[14px]" /> {skill}</button>))}</div>
                  <button onClick={() => setSuggestedSkills([])} className="text-[10px] text-on-surface-muted hover:text-primary mt-2.5 px-2 py-1 rounded hover:bg-surface-hover transition-colors">Dismiss suggestions</button>
                </div>
              )}
            </div>
          </div>
        );
      case 'design':
        const allTemplates = Object.values(TEMPLATE_META);
        const filteredDesign = templateFilter === 'all' ? allTemplates : allTemplates.filter((t) => t.category.includes(templateFilter));
        const isLockedTemplate = (t: typeof allTemplates[0]) => userTier !== 'free' ? false : t.isPremium;
        return (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
            <div><h2 className="font-bold text-xl text-on-surface mb-2">{t('sections.design')}</h2><p className="text-sm text-on-surface-muted">Choose a design for your CV.</p></div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {CATEGORY_ORDER.map((cat) => (
                <button key={cat} onClick={() => setTemplateFilter(cat)} className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${templateFilter === cat ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-surface-muted text-on-surface-muted border border-surface-border hover:border-primary/40 hover:text-on-surface'}`}>{CATEGORY_LABELS[cat]}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredDesign.map((t) => {
                const locked = isLockedTemplate(t);
                const isSelected = currentTemplate === t.id;
                return (
                  <button key={t.id} onClick={() => !locked && setTemplate(t.id as any)} disabled={locked} className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface shadow-xl shadow-primary/10 scale-[1.02]' : locked ? 'opacity-60 cursor-not-allowed border border-surface-border' : 'border border-surface-border hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1'}`}>
                    <div className="h-36 sm:h-44 bg-white relative overflow-hidden">
                      {t.layout === '2-col' && <div className="w-full h-full flex gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}><div className="w-[35%] h-full rounded-md flex flex-col gap-1 p-1.5" style={{ background: t.colors[1] + '30' }}><div className="h-2 rounded-full w-3/4" style={{ background: t.colors[0] + '40' }}></div><div className="h-1.5 rounded-full w-1/2" style={{ background: t.colors[0] + '25' }}></div><div className="h-1.5 rounded-full w-2/3" style={{ background: t.colors[0] + '25' }}></div></div><div className="flex-1 flex flex-col gap-1 p-1"><div className="h-2.5 rounded w-1/2" style={{ background: '#e2e8f0' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div><div className="h-1.5 rounded w-3/4" style={{ background: '#f1f5f9' }}></div></div></div>}
                      {t.layout === 'sidebar' && <div className="w-full h-full flex gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}><div className="w-[30%] h-full rounded-md flex flex-col gap-1 p-1.5" style={{ background: t.colors[0] }}><div className="h-2 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.2)' }}></div><div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.12)' }}></div></div><div className="flex-1 flex flex-col gap-1 p-1"><div className="h-2.5 rounded w-1/2" style={{ background: '#e2e8f0' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div></div></div>}
                      {t.layout === 'asymmetric' && <div className="w-full h-full flex gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}><div className="flex-1 flex flex-col gap-1"><div className="h-2.5 rounded w-3/4" style={{ background: '#e2e8f0' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div></div><div className="w-[28%] h-full rounded-md flex flex-col gap-1 p-1" style={{ background: t.colors[1] + '35' }}><div className="h-1.5 rounded w-full" style={{ background: t.colors[0] + '20' }}></div><div className="h-1.5 rounded w-full" style={{ background: t.colors[0] + '20' }}></div></div></div>}
                      {t.layout === 'centered' && <div className="w-full h-full flex flex-col items-center gap-1.5 p-2" style={{ background: t.colors[2] || '#fff' }}><div className="h-2.5 rounded w-1/3" style={{ background: '#e2e8f0' }}></div><div className="h-1.5 rounded w-1/4" style={{ background: t.colors[0] + '35' }}></div><div className="w-full h-px my-1" style={{ background: '#e2e8f0' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div><div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div><div className="h-1.5 rounded w-2/3" style={{ background: '#f1f5f9' }}></div></div>}
                      {isSelected && <div className="absolute inset-0 bg-primary/5 flex items-center justify-center"><div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg"><Icon name="check" className="text-[20px] text-white" /></div></div>}
                      {locked && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center"><div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-surface-border shadow-sm"><Icon name="workspace_premium" className="text-[14px] text-premium" /><span className="text-xs font-medium text-on-surface">Pro</span></div></div>}
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-start justify-between gap-2"><h3 className={`font-semibold text-sm sm:text-base group-hover:text-primary transition-colors ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{t.name}</h3>{t.isPremium && <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-premium-bg text-premium border border-premium/20 uppercase tracking-wider">Pro</span>}</div>
                      <p className="text-xs text-on-surface-muted mt-1.5 leading-relaxed line-clamp-2">{t.description}</p>
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">{t.tags.slice(0, 3).map((tag) => (<span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-muted text-on-surface-muted">{tag}</span>))}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative bg-white">
      {isDownloading && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm mx-4 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4 sm:mb-6"></div>
            <h3 className="text-lg sm:text-xl font-bold text-on-surface mb-2">Generating PDF...</h3>
            <p className="text-sm sm:text-sm text-on-surface-muted">Please wait a moment while we prepare your high-quality resume.</p>
          </div>
        </div>
      )}
      {aiErrorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-error-container border border-error-container rounded-xl shadow-lg p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center shrink-0 mt-0.5"><Icon name="error" className="text-[18px] text-error" /></div>
            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-on-error-container">{aiErrorToast}</p><p className="text-xs text-on-error-container/70 mt-1">Kiểm tra API key trong .env hoặc thử lại sau.</p></div>
            <button onClick={() => setAiErrorToast(null)} className="text-on-error-container/60 hover:text-on-error-container shrink-0"><Icon name="close" className="text-[18px]" /></button>
          </div>
        </div>
      )}

      {/* Left Panel: Editor */}
      <section className="bg-white flex border-r border-surface-border h-full overflow-hidden shrink-0 w-full md:w-[40%] lg:w-[45%]">
        {/* Sub-navigation sidebar */}
        <nav className="hidden sm:flex w-14 lg:w-16 shrink-0 bg-surface-muted border-r border-surface-border flex-col items-center py-3 gap-0.5 overflow-y-auto scrollbar-none">
          <div className="mb-0.5 px-1 w-full"><span className="text-[7px] font-semibold text-on-surface-subtle uppercase tracking-[0.15em] block text-center">Edit</span></div>
          <button onClick={() => setActiveTab('design')} className={`w-11 lg:w-14 py-[6px] rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${activeTab === 'design' ? 'bg-primary-light text-primary font-semibold' : 'text-on-surface-muted hover:bg-surface-hover hover:text-on-surface'}`} title="Design">
            <Icon name="palette" className="text-[18px] lg:text-[20px]" filled={activeTab === 'design'} />
            <span className="text-[9px] lg:text-[10px] font-medium leading-tight">Design</span>
          </button>
          <div className="w-8 h-px bg-surface-border/50 my-1.5"></div>
          {contentTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-11 lg:w-14 py-[6px] rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${activeTab === tab.id ? 'bg-primary-light text-primary font-semibold' : 'text-on-surface-muted hover:bg-surface-hover hover:text-on-surface'}`} title={tab.label}>
              <Icon name={tab.icon} className="text-[18px] lg:text-[20px]" filled={activeTab === tab.id} />
              <span className="text-[9px] lg:text-[10px] font-medium leading-tight">{tab.short}</span>
            </button>
          ))}
        </nav>

        {/* Mobile bottom nav */}
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-border flex items-center justify-around py-1 px-1 safe-area-bottom">
          <button onClick={() => setActiveTab('design')} className={`flex-1 py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${activeTab === 'design' ? 'bg-primary-light text-primary font-semibold' : 'text-on-surface-muted'}`}>
            <Icon name="palette" className="text-[18px]" filled={activeTab === 'design'} />
            <span className="text-[8px] font-medium leading-tight">Design</span>
          </button>
          {contentTabs.slice(0, 3).map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 py-2 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-150 ${activeTab === tab.id ? 'bg-primary-light text-primary font-semibold' : 'text-on-surface-muted'}`}>
              <Icon name={tab.icon} className="text-[18px]" filled={activeTab === tab.id} />
              <span className="text-[8px] font-medium leading-tight">{tab.short}</span>
            </button>
          ))}
        </nav>

        {/* Editor Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin pb-20 sm:pb-6">
          {renderTabContent()}
        </div>
      </section>

      {/* Right Panel: Canvas Preview */}
      <section className={`flex-col bg-surface-muted p-4 sm:p-6 md:p-8 overflow-y-auto items-center scrollbar-thin ${showPreview ? 'flex absolute inset-0 z-40 md:relative md:inset-auto' : 'hidden md:flex'} w-full md:w-[60%] lg:w-[55%]`}>
        <div className="w-full max-w-[850px] flex justify-between items-center mb-4 sm:mb-6 no-print">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(false)} className="md:hidden h-9 w-9 rounded-full bg-white border border-surface-border flex items-center justify-center text-on-surface-muted hover:bg-surface-hover transition-colors"><Icon name="close" className="text-[18px]" /></button>
            <div className="flex items-center gap-2 bg-white px-2 sm:px-3 py-1.5 rounded-full border border-surface-border shadow-sm">
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-[#14B8A6]' : syncStatus === 'syncing' ? 'bg-[#F59E0B] animate-pulse' : syncStatus === 'error' ? 'bg-[#EF4444]' : 'bg-[#94A3B8]'}`}></span>
              <span className="text-[10px] sm:text-xs font-medium text-on-surface-muted">{syncStatus === 'synced' ? 'Cloud saved' : syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'error' ? 'Sync error' : 'Offline'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative" ref={templateSwitcherRef}>
              <button onClick={() => setShowTemplateSwitcher(!showTemplateSwitcher)} className="hidden md:flex items-center gap-1.5 h-9 sm:h-10 px-3 rounded-full bg-white border border-surface-border text-on-surface-muted hover:bg-surface-hover shadow-sm transition-colors text-xs sm:text-sm">
                <Icon name="palette" className="text-[16px] text-primary" />
                <span className="max-w-[100px] truncate">{TEMPLATE_META[currentTemplate]?.name || 'Template'}</span>
                <Icon name="expand_more" className={`text-[16px] transition-transform ${showTemplateSwitcher ? 'rotate-180' : ''}`} />
              </button>
              {showTemplateSwitcher && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-surface-border rounded-xl shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-medium text-on-surface-muted uppercase tracking-wider">{t('sections.design')}</div>
                  {Object.values(TEMPLATE_META).map((tmpl) => (
                    <button key={tmpl.id} onClick={() => { setTemplate(tmpl.id as any); setShowTemplateSwitcher(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-border/40 transition-colors ${currentTemplate === tmpl.id ? 'bg-primary-light/30' : ''}`}>
                      <div className="w-8 h-10 rounded border border-surface-border overflow-hidden shrink-0" style={{ background: tmpl.colors[2] || '#fff' }}><div className="w-full h-full opacity-50" style={{ background: tmpl.colors[0] }}></div></div>
                      <div className="flex-1 min-w-0"><div className={`text-xs font-medium truncate ${currentTemplate === tmpl.id ? 'text-primary' : 'text-on-surface'}`}>{tmpl.name}</div><div className="text-[10px] text-on-surface-muted truncate">{tmpl.tags.slice(0, 2).join(' · ')}</div></div>
                      {currentTemplate === tmpl.id && <Icon name="check" className="text-[16px] text-primary shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-surface-border flex items-center justify-center text-on-surface-muted hover:bg-surface-hover shadow-sm transition-colors"><Icon name="zoom_out" className="text-[16px] sm:text-[20px]" /></button>
            <span className="font-medium text-xs text-on-surface-muted w-10 sm:w-12 text-center text-xs sm:text-sm">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(Math.min(1.5, zoomLevel + 0.1))} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-surface-border flex items-center justify-center text-on-surface-muted hover:bg-surface-hover shadow-sm transition-colors"><Icon name="zoom_in" className="text-[16px] sm:text-[20px]" /></button>
            <button onClick={() => setTailorState(prev => ({ ...prev, step: 'input', jdText: '' }))} className="hidden md:flex items-center gap-1.5 h-9 sm:h-10 px-3 rounded-full bg-white border border-primary text-primary font-medium hover:bg-primary/5 shadow-sm transition-colors text-xs sm:text-sm">
              <Icon name="auto_fix_high" className="text-[16px]" />
              <span>Tailor to JD</span>
            </button>
            <button onClick={handlePrint} disabled={isDownloading} className="h-9 sm:h-10 px-3 sm:px-6 rounded-full bg-primary text-white font-medium transition-colors shadow-sm flex items-center justify-center gap-2 text-xs sm:text-sm hover:bg-primary-hover disabled:opacity-70">
              {isDownloading ? <><div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div><span className="hidden sm:inline">Downloading...</span><span className="sm:hidden">PDF</span></> : <><span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">PDF</span></>}
            </button>
          </div>
        </div>

        {/* Tailor JD Input Modal */}
        {tailorState.step === 'input' && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center"><Icon name="auto_fix_high" className="text-[22px] text-primary" /></div>
                  <div><h2 className="font-bold text-lg text-on-surface">Tailor CV to Job</h2><p className="text-xs text-on-surface-muted">Paste the job description to optimize your CV.</p></div>
                </div>
                <button onClick={() => setTailorState({ step: 'idle', jdText: '', result: null })} className="text-on-surface-muted hover:text-on-surface p-1"><Icon name="close" className="text-[20px]" /></button>
              </div>
              <textarea
                value={tailorState.jdText}
                onChange={e => setTailorState(prev => ({ ...prev, jdText: e.target.value }))}
                placeholder="Paste job description here..."
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-surface-border bg-transparent focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none text-sm text-on-surface resize-none"
              />
              <button
                onClick={handleTailor}
                disabled={!tailorState.jdText.trim()}
                className="w-full h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon name="auto_fix_high" className="text-[20px]" /> Tailor My CV
              </button>
            </div>
          </div>
        )}

        {/* Tailor Loading */}
        {tailorState.step === 'loading' && (
          <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm text-on-surface-muted">AI is tailoring your CV to the job description...</p>
            </div>
          </div>
        )}

        {/* Tailor Review Modal */}
        {tailorState.step === 'review' && tailorState.result && (
          <TailorReview
            originalData={data}
            tailoredData={tailorState.result.tailoredCV}
            changes={tailorState.result.changes}
            onAcceptAll={handleAcceptAll}
            onAcceptSection={handleAcceptSection}
            onReject={() => setTailorState({ step: 'idle', jdText: '', result: null })}
          />
        )}

        <div ref={resumeRef} className="cv-paper bg-white w-full max-w-[850px] min-h-[1100px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-black/5 flex flex-col font-cv-serif text-on-surface overflow-hidden" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
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
    </div>
  );
}
