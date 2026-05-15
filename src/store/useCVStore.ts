import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// ═══════════════════════════════════════
//  KIỂU DỮ LIỆU (Types)
// ═══════════════════════════════════════

// ── Kinh nghiệm làm việc ──
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  bulletPoints: string;  // HTML format: <ul><li>...</li></ul>
}

// ── Học vấn ──
export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

// ── Dữ liệu CV chính ──
export interface CVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    photo?: string;
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
  experiences: Experience[];
  educations: Education[];
  skills: string[];
}

export type TemplateType = 'executive' | 'tech' | 'creative' | 'standard' | 'modern' | 'timeline';
export type FontType = 'sans' | 'serif' | 'mono';
export type UserTier = 'free' | 'pro' | 'business' | 'lifetime';

// ── Dự án CV (mỗi project = 1 tab CV) ──
export interface CVProject {
  id: string;
  name: string;
  data: CVData;
  template: TemplateType;
  primaryColor: string;
  fontFamily: FontType;
  updatedAt: string;
}

// ── Cover Letter ──
export interface CoverLetter {
  id: string;
  companyName: string;
  jobTitle: string;
  content: string;
  tone: 'professional' | 'modern';
  createdAt: string;
}

// ── Job Tracker (Kanban) ──
export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobEntry {
  id: string;
  company: string;
  position: string;
  url: string;
  status: JobStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════
//  STORE INTERFACE — toàn bộ state & actions
// ═══════════════════════════════════════

interface CVStore {
  // State
  data: CVData;
  language: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'es' | 'fr' | 'de';
  currentTemplate: TemplateType;
  primaryColor: string;
  fontFamily: FontType;
  cvs: CVProject[];
  currentCvId: string;
  coverLetters: CoverLetter[];
  jobs: JobEntry[];
  userTier: UserTier;
  usageCount: number;

  // Actions
  setLanguage: (lang: 'en' | 'vi' | 'ja' | 'ko' | 'zh' | 'es' | 'fr' | 'de') => void;
  setTemplate: (template: TemplateType) => void;
  setPrimaryColor: (color: string) => void;
  setFontFamily: (font: FontType) => void;
  updatePersonalInfo: (info: Partial<CVData['personalInfo']>) => void;
  addExperience: () => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  resetData: () => void;
  importData: (data: CVData) => void;
  createCV: (name: string) => void;
  switchCV: (id: string) => void;
  deleteCV: (id: string) => void;
  renameCV: (id: string, name: string) => void;
  addCoverLetter: (cl: CoverLetter) => void;
  updateCoverLetter: (id: string, data: Partial<CoverLetter>) => void;
  removeCoverLetter: (id: string) => void;
  addJob: (job: Omit<JobEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, data: Partial<JobEntry>) => void;
  removeJob: (id: string) => void;
  moveJob: (id: string, status: JobStatus) => void;
  incrementUsage: () => void;
  setUserTier: (tier: UserTier) => void;
  syncCVToCloud: () => Promise<void>;
  loadCVFromCloud: () => Promise<CVProject | null>;
}

// ── Dữ liệu mẫu ban đầu ──
const initialData: CVData = {
  personalInfo: {
    fullName: 'ALEXANDER STERLING',
    jobTitle: 'Chief Executive Officer',
    email: 'alexander.s@sterling.co',
    phone: '+1 (555) 019-2834',
    address: 'San Francisco, CA',
    summary: 'Visionary executive leader with over 15 years of experience scaling global technology operations...',
    linkedin: 'linkedin.com/in/alexsterling',
    portfolio: 'sterling.co',
    github: 'github.com/alexsterling',
  },
  experiences: [
    {
      id: uuidv4(),
      company: 'Global Tech Holdings',
      position: 'Chief Executive Officer',
      startDate: '2018-01',
      endDate: 'Present',
      bulletPoints: '<ul><li>Spearheaded global restructuring initiative...</li></ul>',
    },
    {
      id: uuidv4(),
      company: 'Innovate Solutions Group',
      position: 'Chief Operating Officer',
      startDate: '2012-06',
      endDate: '2017-12',
      bulletPoints: '<ul><li>Architected scalable operational frameworks...</li></ul>',
    }
  ],
  educations: [
    { id: uuidv4(), school: 'Harvard Business School', degree: 'MBA', startDate: '2008-09', endDate: '2010-06' },
    { id: uuidv4(), school: 'Stanford University', degree: 'B.S. in Economics', startDate: '2002-09', endDate: '2006-06' }
  ],
  skills: ['Strategic Planning', 'Global Operations', 'Mergers & Acquisitions', 'Innovation Management', 'Fiscal Responsibility'],
};

const now = () => new Date().toISOString();

// ═══════════════════════════════════════
//  ZUSTAND STORE (persisted to localStorage)
// ═══════════════════════════════════════

export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      // ── Khởi tạo state ──
      data: initialData,
      language: 'en',
      currentTemplate: 'executive',
      primaryColor: '#0061a4',
      fontFamily: 'sans',
      cvs: [],
      currentCvId: '',
      coverLetters: [],
      jobs: [],
      userTier: 'free',
      usageCount: 0,

      // ── Settings ──
      setLanguage: (lang) => set({ language: lang }),
      setTemplate: (template) => set((s) => { const upd = { currentTemplate: template }; syncCvEntry(s, upd); return upd; }),
      setPrimaryColor: (color) => set((s) => { const upd = { primaryColor: color }; syncCvEntry(s, upd); return upd; }),
      setFontFamily: (font) => set((s) => { const upd = { fontFamily: font }; syncCvEntry(s, upd); return upd; }),

      // ── Personal Info ──
      updatePersonalInfo: (info) => set((s) => {
        const data = { ...s.data, personalInfo: { ...s.data.personalInfo, ...info } };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),

      // ── CRUD Experience ──
      addExperience: () => set((s) => {
        const data = { ...s.data, experiences: [...s.data.experiences, { id: uuidv4(), company: '', position: '', startDate: '', endDate: '', bulletPoints: '' }] };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),
      updateExperience: (id, updatedExp) => set((s) => {
        const data = { ...s.data, experiences: s.data.experiences.map((exp) => exp.id === id ? { ...exp, ...updatedExp } : exp) };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),
      removeExperience: (id) => set((s) => {
        const data = { ...s.data, experiences: s.data.experiences.filter((exp) => exp.id !== id) };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),

      // ── CRUD Education ──
      addEducation: () => set((s) => {
        const data = { ...s.data, educations: [...s.data.educations, { id: uuidv4(), school: '', degree: '', startDate: '', endDate: '' }] };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),
      updateEducation: (id, updatedEdu) => set((s) => {
        const data = { ...s.data, educations: s.data.educations.map((edu) => edu.id === id ? { ...edu, ...updatedEdu } : edu) };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),
      removeEducation: (id) => set((s) => {
        const data = { ...s.data, educations: s.data.educations.filter((edu) => edu.id !== id) };
        const upd = { data };
        syncCvEntry(s, upd);
        return upd;
      }),

      // ── Skills ──
      updateSkills: (skills) => set((s) => { const data = { ...s.data, skills }; const upd = { data }; syncCvEntry(s, upd); return upd; }),
      addSkill: (skill) => set((s) => { const data = { ...s.data, skills: [...s.data.skills, skill] }; const upd = { data }; syncCvEntry(s, upd); return upd; }),
      removeSkill: (skill) => set((s) => { const data = { ...s.data, skills: s.data.skills.filter(sk => sk !== skill) }; const upd = { data }; syncCvEntry(s, upd); return upd; }),

      // ── Reset / Import ──
      resetData: () => set((s) => { const data = initialData; const upd = { data }; syncCvEntry(s, upd); return upd; }),
      importData: (data) => set((s) => { const upd = { data }; syncCvEntry(s, upd); return upd; }),

      // ── Multi-CV management ──
      createCV: (name) => {
        const id = uuidv4();
        const nowStr = now();
        const project: CVProject = { id, name, data: initialData, template: 'executive', primaryColor: '#0061a4', fontFamily: 'sans', updatedAt: nowStr };
        set((s) => ({ cvs: [...s.cvs, project], currentCvId: id, data: initialData, currentTemplate: 'executive', primaryColor: '#0061a4', fontFamily: 'sans' }));
      },
      switchCV: (id) => {
        const project = get().cvs.find(c => c.id === id);
        if (project) set({ currentCvId: id, data: project.data, currentTemplate: project.template, primaryColor: project.primaryColor, fontFamily: project.fontFamily });
      },
      deleteCV: (id) => {
        const state = get();
        if (state.cvs.length <= 1) return;
        const remaining = state.cvs.filter(c => c.id !== id);
        if (remaining.length === 0) return;
        const first = remaining[0];
        set({ cvs: remaining, currentCvId: first.id, data: first.data, currentTemplate: first.template, primaryColor: first.primaryColor, fontFamily: first.fontFamily });
      },
      renameCV: (id, name) => set((s) => ({ cvs: s.cvs.map(c => c.id === id ? { ...c, name } : c) })),

      // ── Cover Letters ──
      addCoverLetter: (cl) => set((s) => ({ coverLetters: [...s.coverLetters, cl] })),
      updateCoverLetter: (id, data) => set((s) => ({ coverLetters: s.coverLetters.map(cl => cl.id === id ? { ...cl, ...data } : cl) })),
      removeCoverLetter: (id) => set((s) => ({ coverLetters: s.coverLetters.filter(cl => cl.id !== id) })),

      // ── Job Tracker ──
      addJob: (job) => set((s) => ({ jobs: [...s.jobs, { ...job, id: uuidv4(), createdAt: now(), updatedAt: now() }] })),
      updateJob: (id, data) => set((s) => ({ jobs: s.jobs.map(j => j.id === id ? { ...j, ...data, updatedAt: now() } : j) })),
      removeJob: (id) => set((s) => ({ jobs: s.jobs.filter(j => j.id !== id) })),
      moveJob: (id, status) => set((s) => ({ jobs: s.jobs.map(j => j.id === id ? { ...j, status, updatedAt: now() } : j) })),

      // ── Usage & Tier ──
      incrementUsage: () => set((s) => ({ usageCount: s.usageCount + 1 })),
      setUserTier: (tier) => set({ userTier: tier }),

      // ── Cloud sync (gọi API backend) ──
      syncCVToCloud: async () => {
        const state = get();
        const project = state.cvs.find(c => c.id === state.currentCvId);
        if (!project) return;
        const updated = { ...project, data: state.data, template: state.currentTemplate, primaryColor: state.primaryColor, fontFamily: state.fontFamily, updatedAt: now() };
        try {
          await fetch('/api/cv/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cv: updated }),
          });
          set((s) => ({ cvs: s.cvs.map(c => c.id === updated.id ? updated : c) }));
        } catch { }
      },
      loadCVFromCloud: async () => {
        try {
          const res = await fetch('/api/cv/load');
          if (res.ok) { const data = await res.json(); return data.cv || null; }
        } catch { }
        return null;
      },
    }),
    {
      name: 'swiftcv-premium-v1',
      version: 2,
      // ── Migration từ version cũ ──
      // version 0→1: chuyển bulletPoints từ array → HTML string
      // version 1→2: thêm multi-CV support (cvs[], currentCvId)
      migrate: (persistedState: any, version: number) => {
        let state = persistedState;
        if (version === 0) {
          if (state.data && Array.isArray(state.data.experiences)) {
            state.data.experiences = state.data.experiences.map((exp: any) => {
              if (Array.isArray(exp.bulletPoints)) {
                return { ...exp, bulletPoints: `<ul>${exp.bulletPoints.map((p: string) => `<li>${p}</li>`).join('')}</ul>` };
              }
              return exp;
            });
          }
          version = 1;
        }
        if (version === 1) {
          if (state.data && !state.cvs) {
            const firstCvId = uuidv4();
            const nowStr = now();
            state.cvs = [{ id: firstCvId, name: 'My CV', data: state.data, template: state.currentTemplate || 'executive', primaryColor: state.primaryColor || '#0061a4', fontFamily: state.fontFamily || 'sans', updatedAt: nowStr }];
            state.currentCvId = firstCvId;
            state.coverLetters = state.coverLetters || [];
            state.userTier = state.userTier || 'free';
            state.usageCount = state.usageCount || 0;
          }
        }
        return state;
      },
    }
  )
);

// ── Helper: đồng bộ thay đổi vào CV project hiện tại ──
// Khi user sửa data/template/color/font, tự động cập nhật vào project tương ứng
function syncCvEntry(state: any, updates: Record<string, any>) {
  if (!state.currentCvId || !state.cvs) return;
  const nowStr = now();
  const synced = {
    ...updates,
    cvs: state.cvs.map((c: CVProject) =>
      c.id === state.currentCvId
        ? { ...c, data: updates.data !== undefined ? updates.data : c.data, template: updates.currentTemplate !== undefined ? updates.currentTemplate : c.template, primaryColor: updates.primaryColor !== undefined ? updates.primaryColor : c.primaryColor, fontFamily: updates.fontFamily !== undefined ? updates.fontFamily : c.fontFamily, updatedAt: nowStr }
        : c
    ),
  };
  Object.assign(state, synced);
}
