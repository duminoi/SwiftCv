import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  bulletPoints: string[];
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
  };
  experiences: Experience[];
  educations: Education[];
  skills: string[];
}

export type TemplateType = 'modern' | 'minimal' | 'professional';

interface CVStore {
  data: CVData;
  language: 'en' | 'vi';
  currentTemplate: TemplateType;
  setLanguage: (lang: 'en' | 'vi') => void;
  setTemplate: (template: TemplateType) => void;
  updatePersonalInfo: (info: Partial<CVData['personalInfo']>) => void;
  addExperience: () => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  updateSkills: (skills: string[]) => void;
}

const initialData: CVData = {
  personalInfo: {
    fullName: 'NGUYỄN VĂN A',
    jobTitle: 'Senior Software Engineer',
    email: 'nguyenvana@email.com',
    phone: '090 123 4567',
    address: 'Hà Nội, Việt Nam',
    summary: 'Lập trình viên dày dặn kinh nghiệm với hơn 5 năm làm việc trong lĩnh vực phát triển web...',
  },
  experiences: [
    {
      id: uuidv4(),
      company: 'Tech Solutions Inc.',
      position: 'Lead Developer',
      startDate: '2021-01',
      endDate: 'Present',
      bulletPoints: [
        'Dẫn dắt đội ngũ 5 thành viên phát triển hệ thống quản lý tài chính.',
        'Tối ưu hóa hiệu suất cơ sở dữ liệu giúp giảm thời gian truy vấn 40%.',
      ],
    }
  ],
  educations: [
    {
      id: uuidv4(),
      school: 'Đại học Bách Khoa',
      degree: 'Kỹ sư Công nghệ thông tin',
      startDate: '2015-09',
      endDate: '2019-06',
    }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
};

export const useCVStore = create<CVStore>((set) => ({
  data: initialData,
  language: 'vi',
  currentTemplate: 'modern',
  setLanguage: (lang) => set({ language: lang }),
  setTemplate: (template) => set({ currentTemplate: template }),
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
          { id: uuidv4(), company: '', position: '', startDate: '', endDate: '', bulletPoints: [''] },
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
}));
