import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  bulletPoints: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

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

export type TemplateType = 'executive' | 'tech' | 'creative' | 'standard';
export type FontType = 'sans' | 'serif' | 'mono';

interface CVStore {
  data: CVData;
  language: 'en' | 'vi';
  currentTemplate: TemplateType;
  primaryColor: string;
  fontFamily: FontType;
  setLanguage: (lang: 'en' | 'vi') => void;
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
}

const initialData: CVData = {
  personalInfo: {
    fullName: 'ALEXANDER STERLING',
    jobTitle: 'Chief Executive Officer',
    email: 'alexander.s@sterling.co',
    phone: '+1 (555) 019-2834',
    address: 'San Francisco, CA',
    summary: 'Visionary executive leader with over 15 years of experience scaling global technology operations. Proven track record in strategic restructuring, accelerating revenue growth by 300% across EMEA and APAC regions. Adept at navigating complex market dynamics and forging high-level strategic partnerships.',
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
      bulletPoints: '<ul><li>Spearheaded global restructuring initiative, resulting in a 40% reduction in operational redundancies.</li><li>Directed successful acquisition and integration of three international competitors.</li><li>Expanded market share by 25% in the first fiscal year through strategic product alignment.</li></ul>',
    },
    {
      id: uuidv4(),
      company: 'Innovate Solutions Group',
      position: 'Chief Operating Officer',
      startDate: '2012-06',
      endDate: '2017-12',
      bulletPoints: '<ul><li>Architected scalable operational frameworks that supported 500% employee growth.</li><li>Maintained core profitability margins while doubling R&D investment.</li></ul>',
    }
  ],
  educations: [
    {
      id: uuidv4(),
      school: 'Harvard Business School',
      degree: 'Master of Business Administration',
      startDate: '2008-09',
      endDate: '2010-06',
    },
    {
      id: uuidv4(),
      school: 'Stanford University',
      degree: 'B.S. in Economics',
      startDate: '2002-09',
      endDate: '2006-06',
    }
  ],
  skills: ['Strategic Planning', 'Global Operations', 'Mergers & Acquisitions', 'Innovation Management', 'Fiscal Responsibility'],
};

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      data: initialData,
      language: 'en',
      currentTemplate: 'executive',
      primaryColor: '#0061a4',

      fontFamily: 'sans',
      setLanguage: (lang) => set({ language: lang }),
      setTemplate: (template) => set({ currentTemplate: template }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      setFontFamily: (font) => set({ fontFamily: font }),
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } },
        })),
      addExperience: () =>
        set((state) => ({
          data: {
            ...state.data,
            experiences: [
              ...state.data.experiences,
              { id: uuidv4(), company: '', position: '', startDate: '', endDate: '', bulletPoints: '' },
            ],
          },
        })),
      updateExperience: (id, updatedExp) =>
        set((state) => ({
          data: {
            ...state.data,
            experiences: state.data.experiences.map((exp) =>
              exp.id === id ? { ...exp, ...updatedExp } : exp
            ),
          },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experiences: state.data.experiences.filter((exp) => exp.id !== id),
          },
        })),
      addEducation: () =>
        set((state) => ({
          data: {
            ...state.data,
            educations: [
              ...state.data.educations,
              { id: uuidv4(), school: '', degree: '', startDate: '', endDate: '' },
            ],
          },
        })),
      updateEducation: (id, updatedEdu) =>
        set((state) => ({
          data: {
            ...state.data,
            educations: state.data.educations.map((edu) =>
              edu.id === id ? { ...edu, ...updatedEdu } : edu
            ),
          },
        })),
      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            educations: state.data.educations.filter((edu) => edu.id !== id),
          },
        })),
      updateSkills: (skills) =>
        set((state) => ({
          data: { ...state.data, skills },
        })),
      addSkill: (skill) =>
        set((state) => ({
          data: { ...state.data, skills: [...state.data.skills, skill] },
        })),
      removeSkill: (skill) =>
        set((state) => ({
          data: { ...state.data, skills: state.data.skills.filter(s => s !== skill) },
        })),
      resetData: () => set({ data: initialData }),
      importData: (data) => set({ data }),
    }),
    {
      name: 'swiftcv-premium-v1',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          if (persistedState.data && Array.isArray(persistedState.data.experiences)) {
            persistedState.data.experiences = persistedState.data.experiences.map((exp: any) => {
              if (Array.isArray(exp.bulletPoints)) {
                return {
                  ...exp,
                  bulletPoints: `<ul>${exp.bulletPoints.map((p: string) => `<li>${p}</li>`).join('')}</ul>`
                };
              }
              return exp;
            });
          }
        }
        return persistedState;
      },
    }
  )
);
