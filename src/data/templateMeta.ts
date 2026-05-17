import type { TemplateType } from '../store/useCVStore';

export type TemplateCategory = 'all' | 'ats' | 'modern' | 'creative' | 'minimal' | 'professional';

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  category: TemplateCategory[];
  tags: string[];
  colors: string[];
  layout: '2-col' | 'centered' | 'sidebar' | 'asymmetric';
  isPremium: boolean;
  description: string;
  thumbnail?: string;
}

const t = (id: TemplateType) => `/previews/template-${id}.webp`;

export const TEMPLATE_META: Record<TemplateType, TemplateMeta> = {
  standard: {
    id: 'standard', name: 'The International Standard', category: ['ats', 'professional'],
    tags: ['ATS', 'Corporate', 'Clean'], colors: ['#0061a4', '#d1e4ff', '#ffffff'],
    layout: '2-col', isPremium: false,
    description: 'Clean, multi-column corporate look optimized for ATS scanners.',
    thumbnail: t('standard'),
  },
  executive: {
    id: 'executive', name: 'The Minimalist CEO', category: ['minimal', 'professional'],
    tags: ['Executive', 'Serif', 'Elegant'], colors: ['#1e293b', '#f8f9ff', '#ffffff'],
    layout: 'centered', isPremium: false,
    description: 'Premium serif typography for executives and senior leaders.',
    thumbnail: t('executive'),
  },
  tech: {
    id: 'tech', name: 'The Pixels Code', category: ['modern', 'creative'],
    tags: ['Modern', 'Dark', 'Developer'], colors: ['#0f172a', '#1e293b', '#ffffff'],
    layout: 'sidebar', isPremium: false,
    description: 'Modern monospace layout crafted for developers and engineers.',
    thumbnail: t('tech'),
  },
  creative: {
    id: 'creative', name: 'The Creative Portfolio', category: ['creative', 'modern'],
    tags: ['Creative', 'Bold', 'Asymmetric'], colors: ['#6b5778', '#f3daff', '#ffffff'],
    layout: 'asymmetric', isPremium: false,
    description: 'Bold asymmetric design for creatives and designers.',
    thumbnail: t('creative'),
  },
  modern: {
    id: 'modern', name: 'The Modern Edge', category: ['modern', 'ats'],
    tags: ['Modern', '2-Column', 'Professional'], colors: ['#2563eb', '#f8fafc', '#ffffff'],
    layout: '2-col', isPremium: true,
    description: 'Bold colored header with a balanced 2-column layout.',
    thumbnail: t('modern'),
  },
  timeline: {
    id: 'timeline', name: 'The Timeline Pro', category: ['modern', 'professional'],
    tags: ['Timeline', 'Chronological', 'Clean'], colors: ['#059669', '#f0fdf4', '#ffffff'],
    layout: 'centered', isPremium: true,
    description: 'Chronology-focused design with elegant timeline visuals.',
    thumbnail: t('timeline'),
  },
  elegant: {
    id: 'elegant', name: 'The Elegant Gold', category: ['professional', 'creative'],
    tags: ['Luxury', 'Gold', 'Premium'], colors: ['#1C1917', '#D4AF37', '#FAFAF9'],
    layout: 'centered', isPremium: true,
    description: 'Luxurious black & gold design for premium profiles.',
    thumbnail: t('elegant'),
  },
  professional: {
    id: 'professional', name: 'The Corporate Navy', category: ['professional', 'ats'],
    tags: ['Corporate', 'Navy', 'Trustworthy'], colors: ['#0F172A', '#1E40AF', '#F8FAFC'],
    layout: '2-col', isPremium: true,
    description: 'Trustworthy navy & blue layout for professionals.',
    thumbnail: t('professional'),
  },
  vibrant: {
    id: 'vibrant', name: 'The Vibrant Pulse', category: ['creative', 'modern'],
    tags: ['Vibrant', 'Bold', 'Energetic'], colors: ['#EC4899', '#06B6D4', '#FDF2F8'],
    layout: 'asymmetric', isPremium: true,
    description: 'Energetic pink & teal design for bold personalities.',
    thumbnail: t('vibrant'),
  },
  compact: {
    id: 'compact', name: 'The Compact Pro', category: ['ats', 'professional'],
    tags: ['Compact', 'Dense', 'Experienced'], colors: ['#334155', '#475569', '#F8FAFC'],
    layout: '2-col', isPremium: true,
    description: 'Space-efficient dense layout for experienced pros.',
    thumbnail: t('compact'),
  },
  academic: {
    id: 'academic', name: 'The Academic Scholar', category: ['minimal', 'professional'],
    tags: ['Academic', 'Clean', 'Researcher'], colors: ['#0D9488', '#2DD4BF', '#F0FDFA'],
    layout: '2-col', isPremium: true,
    description: 'Clean teal design for researchers & educators.',
    thumbnail: t('academic'),
  },
  gradient: {
    id: 'gradient', name: 'The Gradient Flow', category: ['modern', 'creative'],
    tags: ['Gradient', 'Sleek', 'Stylish'], colors: ['#2563EB', '#7C3AED', '#F8FAFC'],
    layout: 'sidebar', isPremium: true,
    description: 'Modern blue-to-purple gradient accents throughout.',
    thumbnail: t('gradient'),
  },
  nature: {
    id: 'nature', name: 'The Natural Green', category: ['minimal', 'creative'],
    tags: ['Nature', 'Eco', 'Organic'], colors: ['#2E8B57', '#87CEEB', '#F0FFF4'],
    layout: 'centered', isPremium: true,
    description: 'Organic forest green theme for sustainability roles.',
    thumbnail: t('nature'),
  },
  bold: {
    id: 'bold', name: 'The Bold Statement', category: ['creative', 'modern'],
    tags: ['Bold', 'Impact', 'High-Contrast'], colors: ['#DC2626', '#1E293B', '#FEF2F2'],
    layout: 'asymmetric', isPremium: true,
    description: 'High-contrast red & dark for commanding presence.',
    thumbnail: t('bold'),
  },
  sidebar: {
    id: 'sidebar', name: 'The Sidebar Classic', category: ['minimal', 'professional'],
    tags: ['Sidebar', 'Clean', 'Organized'], colors: ['#0891B2', '#22D3EE', '#ECFEFF'],
    layout: 'sidebar', isPremium: true,
    description: 'Clean teal sidebar with organized content flow.',
    thumbnail: t('sidebar'),
  },
  minimal: {
    id: 'minimal', name: 'The Ultra Minimal', category: ['minimal', 'ats'],
    tags: ['Minimal', 'Mono', 'Purist'], colors: ['#18181B', '#3F3F46', '#FAFAFA'],
    layout: 'centered', isPremium: true,
    description: 'Stripped-down monochrome for design purists.',
    thumbnail: t('minimal'),
  },
};

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  all: 'All Templates',
  ats: 'ATS-Friendly',
  modern: 'Modern',
  creative: 'Creative',
  minimal: 'Minimal',
  professional: 'Professional',
};

export const CATEGORY_ORDER: TemplateCategory[] = ['all', 'ats', 'modern', 'creative', 'minimal', 'professional'];

export const FREE_TEMPLATES: TemplateType[] = ['standard', 'executive', 'tech', 'creative'];
