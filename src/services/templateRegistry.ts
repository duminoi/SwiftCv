import type { TemplateType } from '../store/useCVStore';

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  description: string;
  tags: string[];
  premium: boolean;
  layout: '2-col' | 'centered' | 'sidebar' | 'asymmetric';
  category: 'corporate' | 'creative' | 'executive' | 'technical' | 'modern' | 'chronological';
  colors: { primary: string; secondary: string; background: string };
}

export const TEMPLATE_REGISTRY: TemplateMeta[] = [
  { id: 'standard', name: 'The International Standard', description: 'Clean, multi-column corporate look.', tags: ['ATS', 'Corporate'], premium: false, layout: '2-col', category: 'corporate', colors: { primary: '#0061a4', secondary: '#d1e4ff', background: '#ffffff' } },
  { id: 'executive', name: 'The Minimalist CEO', description: 'Premium serif typography for executives.', tags: ['Executive', 'Serif'], premium: false, layout: 'centered', category: 'executive', colors: { primary: '#1e293b', secondary: '#f8f9ff', background: '#ffffff' } },
  { id: 'tech', name: 'The Pixels Code', description: 'Modern monospace layout for developers.', tags: ['Modern', 'Dark'], premium: false, layout: 'sidebar', category: 'technical', colors: { primary: '#0f172a', secondary: '#1e293b', background: '#ffffff' } },
  { id: 'creative', name: 'The Creative Portfolio', description: 'Bold asymmetric design for creatives.', tags: ['Creative', 'Bold'], premium: false, layout: 'asymmetric', category: 'creative', colors: { primary: '#6b5778', secondary: '#f3daff', background: '#ffffff' } },
  { id: 'modern', name: 'The Modern Edge', description: 'Bold colored header with 2-column layout.', tags: ['Modern', '2-Column'], premium: false, layout: '2-col', category: 'modern', colors: { primary: '#2563eb', secondary: '#f8fafc', background: '#ffffff' } },
  { id: 'timeline', name: 'The Timeline Pro', description: 'Chronology-focused design with timeline visuals.', tags: ['Timeline', 'Chronological'], premium: false, layout: 'centered', category: 'chronological', colors: { primary: '#059669', secondary: '#f0fdf4', background: '#ffffff' } },
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
