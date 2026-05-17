import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { TEMPLATE_META, CATEGORY_LABELS, CATEGORY_ORDER, FREE_TEMPLATES } from '../data/templateMeta';
import type { TemplateType, UserTier } from '../store/useCVStore';
import type { TemplateCategory } from '../data/templateMeta';

interface Props {
  onSelect: (template: TemplateType) => void;
  userTier: UserTier;
}

const MiniPreview = ({ layout, colors }: { layout: string; colors: string[] }) => {
  const primary = colors[0];
  const secondary = colors[1];
  const bg = colors[2] || '#ffffff';

  if (layout === '2-col') {
    return (
      <div className="w-full h-full flex gap-1.5 p-2" style={{ background: bg }}>
        <div className="w-[35%] h-full rounded-md flex flex-col gap-1 p-1.5" style={{ background: secondary + '30' }}>
          <div className="h-2 rounded-full w-3/4" style={{ background: primary + '40' }}></div>
          <div className="h-1.5 rounded-full w-1/2" style={{ background: primary + '25' }}></div>
          <div className="h-1.5 rounded-full w-2/3" style={{ background: primary + '25' }}></div>
        </div>
        <div className="flex-1 flex flex-col gap-1 p-1">
          <div className="h-2.5 rounded w-1/2" style={{ background: '#e2e8f0' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
          <div className="h-1.5 rounded w-3/4" style={{ background: '#f1f5f9' }}></div>
        </div>
      </div>
    );
  }
  if (layout === 'sidebar') {
    return (
      <div className="w-full h-full flex gap-1.5 p-2" style={{ background: bg }}>
        <div className="w-[30%] h-full rounded-md flex flex-col gap-1 p-1.5" style={{ background: primary }}>
          <div className="h-2 rounded-full w-3/4" style={{ background: 'rgba(255,255,255,0.2)' }}></div>
          <div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.12)' }}></div>
        </div>
        <div className="flex-1 flex flex-col gap-1 p-1">
          <div className="h-2.5 rounded w-1/2" style={{ background: '#e2e8f0' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
        </div>
      </div>
    );
  }
  if (layout === 'asymmetric') {
    return (
      <div className="w-full h-full flex gap-1.5 p-2" style={{ background: bg }}>
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-2.5 rounded w-3/4" style={{ background: '#e2e8f0' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
        </div>
        <div className="w-[28%] h-full rounded-md flex flex-col gap-1 p-1" style={{ background: secondary + '35' }}>
          <div className="h-1.5 rounded w-full" style={{ background: primary + '20' }}></div>
          <div className="h-1.5 rounded w-full" style={{ background: primary + '20' }}></div>
        </div>
      </div>
    );
  }
  // centered
  return (
    <div className="w-full h-full flex flex-col items-center gap-1.5 p-2" style={{ background: bg }}>
      <div className="h-2.5 rounded w-1/3" style={{ background: '#e2e8f0' }}></div>
      <div className="h-1.5 rounded w-1/4" style={{ background: primary + '35' }}></div>
      <div className="w-full h-px my-1" style={{ background: '#e2e8f0' }}></div>
      <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
      <div className="h-1.5 rounded w-full" style={{ background: '#f1f5f9' }}></div>
      <div className="h-1.5 rounded w-2/3" style={{ background: '#f1f5f9' }}></div>
    </div>
  );
};

export const TemplateOnboarding: React.FC<Props> = ({ onSelect, userTier }) => {
  const [selected, setSelected] = useState<TemplateType | null>(null);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('all');

  const templates = useMemo(() => Object.values(TEMPLATE_META), []);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter((t) => t.category.includes(activeCategory));
  }, [activeCategory, templates]);

  const isLocked = (t: typeof templates[0]) => {
    if (userTier !== 'free') return false;
    return t.isPremium && !FREE_TEMPLATES.includes(t.id);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="h-16 sm:h-20 bg-surface border-b border-outline-variant flex items-center justify-between px-6 sm:px-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg">S</div>
          <span className="text-xl font-bold text-on-surface tracking-tight">SwiftCV</span>
        </div>
        <div className="text-sm text-on-surface-variant hidden sm:block">Choose a template to get started</div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero text */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface tracking-tight mb-3 sm:mb-4">
              Choose your style
            </h1>
            <p className="text-base sm:text-lg text-on-surface-variant max-w-xl mx-auto">
              Pick a professionally designed template. You can always change it later.
            </p>
          </div>

          {/* Filter bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant border border-outline-variant hover:border-primary/40 hover:text-on-surface'
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filtered.map((t) => {
              const locked = isLocked(t);
              const isSelected = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => !locked && setSelected(t.id)}
                  disabled={locked}
                  className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 ${
                    isSelected
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface shadow-xl shadow-primary/10 scale-[1.02]'
                      : locked
                      ? 'opacity-60 cursor-not-allowed border border-outline-variant'
                      : 'border border-outline-variant hover:border-primary/40 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1'
                  }`}
                >
                  {/* Preview */}
                  <div className="h-36 sm:h-44 bg-white relative overflow-hidden">
                    <MiniPreview layout={t.layout} colors={t.colors} />
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

                  {/* Info */}
                  <div className="p-4 bg-surface">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`font-semibold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors ${isSelected ? 'text-primary' : ''}`}>
                        {t.name}
                      </h3>
                      {t.isPremium && (
                        <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wider">
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                      {t.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {t.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-variant/60 text-on-surface-variant"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar */}
      <div className="shrink-0 bg-surface border-t border-outline-variant px-4 sm:px-6 py-4 sm:py-5 sticky bottom-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            {selected ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-outline-variant overflow-hidden">
                  <MiniPreview layout={TEMPLATE_META[selected].layout} colors={TEMPLATE_META[selected].colors} />
                </div>
                <div>
                  <div className="text-sm font-medium text-on-surface">{TEMPLATE_META[selected].name}</div>
                  <div className="text-xs text-on-surface-variant">Ready to build</div>
                </div>
              </div>
            ) : (
              <span className="text-sm text-on-surface-variant">Select a template to continue</span>
            )}
          </div>
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            className={`ml-auto px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center gap-2 ${
              selected
                ? 'bg-primary text-on-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Start Building
            <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};
