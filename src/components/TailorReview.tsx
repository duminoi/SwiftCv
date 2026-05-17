import { useState } from 'react';
import { Icon } from './Icon';
import type { CVData } from '../store/useCVStore';

interface TailorReviewProps {
  originalData: CVData;
  tailoredData: CVData;
  changes: { section: string; original: string; tailored: string; reason: string }[];
  onAcceptAll: () => void;
  onAcceptSection: (section: string) => void;
  onReject: () => void;
}

export function TailorReview({ changes, onAcceptAll, onAcceptSection, onReject }: TailorReviewProps) {
  const [acceptedSections, setAcceptedSections] = useState<Set<string>>(new Set());

  const handleAcceptSection = (section: string) => {
    setAcceptedSections(prev => new Set(prev).add(section));
    onAcceptSection(section);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
              <Icon name="auto_fix_high" className="text-[22px] text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-on-surface">Review AI Changes</h2>
              <p className="text-xs text-on-surface-muted">{changes.length} section{changes.length > 1 ? 's' : ''} modified</p>
            </div>
          </div>
          <button onClick={onReject} className="text-on-surface-muted hover:text-on-surface p-1">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {changes.map((change, idx) => (
            <div key={idx} className="border border-surface-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-surface-muted border-b border-surface-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-light text-primary uppercase tracking-wider">{change.section}</span>
                  {acceptedSections.has(change.section) && (
                    <span className="text-[10px] font-medium text-green-600 flex items-center gap-1"><Icon name="check_circle" className="text-[12px]" /> Accepted</span>
                  )}
                </div>
                {!acceptedSections.has(change.section) && (
                  <button onClick={() => handleAcceptSection(change.section)} className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                    <Icon name="check" className="text-[14px]" /> Accept
                  </button>
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-error"></div>
                    <span className="text-[10px] font-medium text-on-surface-muted uppercase tracking-wider">Original</span>
                  </div>
                  <div className="text-sm text-on-surface bg-error-container/10 rounded-lg p-3 border border-error/10 line-through decoration-error/50">
                    {change.original}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                    <span className="text-[10px] font-medium text-on-surface-muted uppercase tracking-wider">Tailored</span>
                  </div>
                  <div className="text-sm text-on-surface bg-[#14B8A6]/10 rounded-lg p-3 border border-[#14B8A6]/20">
                    {change.tailored}
                  </div>
                </div>
                {change.reason && (
                  <div className="text-xs text-on-surface-muted bg-surface-muted/50 rounded-lg px-3 py-2 flex items-start gap-2">
                    <Icon name="lightbulb" className="text-[14px] text-primary shrink-0 mt-0.5" />
                    <span>{change.reason}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-surface-border shrink-0 bg-surface-muted/30">
          <button onClick={onReject} className="px-6 py-2.5 rounded-xl border border-surface-border text-on-surface-muted font-medium hover:bg-surface-hover transition-colors text-sm">
            Reject All
          </button>
          <div className="flex gap-3">
            <button onClick={onReject} className="px-6 py-2.5 rounded-xl border border-surface-border text-on-surface font-medium hover:bg-surface-hover transition-colors text-sm">
              Review Later
            </button>
            <button onClick={onAcceptAll} className="px-8 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
              <Icon name="check_circle" className="text-[16px]" /> Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
