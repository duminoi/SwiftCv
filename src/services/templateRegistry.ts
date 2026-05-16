import type { TemplateType } from '../store/useCVStore';

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  description: string;
  tags: string[];
  premium: boolean;
  layout: '2-col' | 'centered' | 'sidebar' | 'asymmetric';
  category: 'corporate' | 'creative' | 'executive' | 'technical' | 'modern' | 'chronological' | 'luxury' | 'minimal';
  colors: { primary: string; secondary: string; background: string };
}

export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  { id: 'standard', name: 'The International Standard', description: 'Clean, multi-column corporate look.', tags: ['ATS', 'Corporate'], premium: false, layout: '2-col', category: 'corporate', colors: { primary: '#0061a4', secondary: '#d1e4ff', background: '#ffffff' } },
  { id: 'executive', name: 'The Minimalist CEO', description: 'Premium serif typography for executives.', tags: ['Executive', 'Serif'], premium: false, layout: 'centered', category: 'executive', colors: { primary: '#1e293b', secondary: '#f8f9ff', background: '#ffffff' } },
  { id: 'tech', name: 'The Pixels Code', description: 'Modern monospace layout for developers.', tags: ['Modern', 'Dark'], premium: false, layout: 'sidebar', category: 'technical', colors: { primary: '#0f172a', secondary: '#1e293b', background: '#ffffff' } },
  { id: 'creative', name: 'The Creative Portfolio', description: 'Bold asymmetric design for creatives.', tags: ['Creative', 'Bold'], premium: false, layout: 'asymmetric', category: 'creative', colors: { primary: '#6b5778', secondary: '#f3daff', background: '#ffffff' } },
  { id: 'modern', name: 'The Modern Edge', description: 'Bold colored header with 2-column layout.', tags: ['Modern', '2-Column'], premium: false, layout: '2-col', category: 'modern', colors: { primary: '#2563eb', secondary: '#f8fafc', background: '#ffffff' } },
  { id: 'timeline', name: 'The Timeline Pro', description: 'Chronology-focused design with timeline visuals.', tags: ['Timeline', 'Chronological'], premium: false, layout: 'centered', category: 'chronological', colors: { primary: '#059669', secondary: '#f0fdf4', background: '#ffffff' } },
  { id: 'elegant', name: 'The Elegant Gold', description: 'Luxurious black & gold design for premium profiles.', tags: ['Luxury', 'Gold', 'Premium'], premium: true, layout: 'centered', category: 'luxury', colors: { primary: '#1C1917', secondary: '#D4AF37', background: '#FAFAF9' } },
  { id: 'professional', name: 'The Corporate Navy', description: 'Trustworthy navy & blue layout for professionals.', tags: ['Corporate', 'Navy', 'Trust'], premium: true, layout: '2-col', category: 'corporate', colors: { primary: '#0F172A', secondary: '#1E40AF', background: '#F8FAFC' } },
  { id: 'vibrant', name: 'The Vibrant Pulse', description: 'Energetic pink & teal design for bold personalities.', tags: ['Vibrant', 'Bold', 'Modern'], premium: true, layout: 'asymmetric', category: 'creative', colors: { primary: '#EC4899', secondary: '#06B6D4', background: '#FDF2F8' } },
  { id: 'compact', name: 'The Compact Pro', description: 'Space-efficient dense layout for experienced pros.', tags: ['Compact', 'Dense', 'Pro'], premium: true, layout: '2-col', category: 'modern', colors: { primary: '#334155', secondary: '#475569', background: '#F8FAFC' } },
  { id: 'academic', name: 'The Academic Scholar', description: 'Clean teal & green design for researchers & educators.', tags: ['Academic', 'Research', 'Clean'], premium: true, layout: '2-col', category: 'modern', colors: { primary: '#0D9488', secondary: '#2DD4BF', background: '#F0FDFA' } },
  { id: 'gradient', name: 'The Gradient Flow', description: 'Modern blue-to-purple gradient accents throughout.', tags: ['Gradient', 'Modern', 'Sleek'], premium: true, layout: 'sidebar', category: 'modern', colors: { primary: '#2563EB', secondary: '#7C3AED', background: '#F8FAFC' } },
  { id: 'nature', name: 'The Natural Green', description: 'Organic forest green theme for sustainability roles.', tags: ['Nature', 'Green', 'Eco'], premium: true, layout: 'centered', category: 'modern', colors: { primary: '#2E8B57', secondary: '#87CEEB', background: '#F0FFF4' } },
  { id: 'bold', name: 'The Bold Statement', description: 'High-contrast red & dark for commanding presence.', tags: ['Bold', 'High Contrast', 'Impact'], premium: true, layout: 'asymmetric', category: 'creative', colors: { primary: '#DC2626', secondary: '#1E293B', background: '#FEF2F2' } },
  { id: 'sidebar', name: 'The Sidebar Classic', description: 'Clean teal sidebar with organized content flow.', tags: ['Sidebar', 'Clean', 'Organized'], premium: true, layout: 'sidebar', category: 'modern', colors: { primary: '#0891B2', secondary: '#22D3EE', background: '#ECFEFF' } },
  { id: 'minimal', name: 'The Ultra Minimal', description: 'Stripped-down monochrome for design purists.', tags: ['Minimal', 'Mono', 'Clean'], premium: true, layout: 'centered', category: 'minimal', colors: { primary: '#18181B', secondary: '#3F3F46', background: '#FAFAFA' } },
];

export function getTemplateMeta(id: TemplateType): TemplateMeta | undefined {
  return TEMPLATE_REGISTRY.find(t => t.id === id);
}

export function getTemplatesByCategory(category: TemplateMeta['category']): TemplateMeta[] {
  return TEMPLATE_REGISTRY.filter(t => t.category === category);
}

export function getPremiumTemplates(): TemplateMeta[] {
  return TEMPLATE_REGISTRY.filter(t => t.premium);
}

export function getFreeTemplates(): TemplateMeta[] {
  return TEMPLATE_REGISTRY.filter(t => !t.premium);
}
