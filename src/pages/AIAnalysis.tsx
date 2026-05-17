import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from '../store/useCVStore';
import { analyzeCV as apiAnalyze } from '../services/api';
import { Icon } from '../components/Icon';
import { ScoreGauge } from '../components/ScoreGauge';

// Cache analysis results by data hash to avoid re-fetching on remount
const analysisCache = new Map<string, any>();
let cacheKey = '';

function getDataHash(data: any): string {
  return JSON.stringify({
    name: data.personalInfo.fullName,
    title: data.personalInfo.jobTitle,
    expCount: data.experiences.length,
    eduCount: data.educations.length,
    skillCount: data.skills.length,
  });
}

export default function AIAnalysis() {
  const { t } = useTranslation();
  const { data, language } = useCVStore();
  const [aiState, setAiState] = useState<{ loading: boolean; result: any; error: string | null }>({ loading: false, result: null, error: null });
  const [aiErrorToast, setAiErrorToast] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const runAnalysis = useCallback(async (cvData: any, lang: string) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setAiState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await apiAnalyze(cvData, lang);
      cacheKey = getDataHash(cvData);
      analysisCache.set(cacheKey, result);
      setAiState({ loading: false, result, error: null });
    } catch (err: any) {
      setAiState({ loading: false, result: null, error: err.message });
      setAiErrorToast(err.message.includes('401') ? 'AI API key không hợp lệ. Kiểm tra OPENCODE_API_KEY trong .env' : `AI unavailable — ${err.message}`);
      setTimeout(() => setAiErrorToast(null), 8000);
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const hash = getDataHash(data);
    // If data hasn't changed and we have cached result, use it
    if (hash === cacheKey && analysisCache.has(hash)) {
      setAiState({ loading: false, result: analysisCache.get(hash), error: null });
      return;
    }
    // If already fetching this data, skip
    if (fetchingRef.current) return;
    runAnalysis(data, language);
  }, [data, language, runAnalysis]);

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl text-on-surface mb-2">AI Analysis</h2>
            <p className="text-sm text-on-surface-muted">CV Score and optimization tips.</p>
          </div>
          {aiState.loading && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              Analyzing...
            </div>
          )}
        </div>

        {aiErrorToast && (
          <div className="flex items-start gap-3 bg-error-container/20 p-3 rounded border border-error-container text-sm text-on-surface">
            <Icon name="error" className="text-error mt-0.5 shrink-0" />
            <div><p className="font-medium">AI unavailable</p><p className="text-xs text-on-surface-muted mt-1">{aiErrorToast}</p></div>
          </div>
        )}

        {aiState.loading && (
          <div className="bg-white p-8 sm:p-12 rounded-xl border border-surface-border shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-sm text-on-surface-muted">Analyzing your CV...</p>
          </div>
        )}

        {!aiState.loading && aiState.result && (
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-surface-border shadow-sm space-y-6">
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
                        <span className="text-on-surface-muted">{item.score}/{item.max}</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct * 100}%`, backgroundColor: barColor }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">AI Powered</span>
              <span className="text-[10px] text-on-surface-muted">Real-time analysis</span>
            </div>

            <div className="border-t border-surface-border pt-4 grid grid-cols-3 gap-2 sm:gap-4">
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
                  <div key={item.label} className="flex flex-col items-center gap-1.5 bg-surface-border/30 rounded-xl p-3">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg width="40" height="40" className="transform -rotate-90">
                        <circle cx="20" cy="20" r={R} fill="none" stroke="currentColor" strokeWidth="4" className="text-surface-variant" />
                        <circle cx="20" cy="20" r={R} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
                      </svg>
                      <Icon name={item.icon} className="text-[14px] absolute" style={{ color }} />
                    </div>
                    <span className="text-[10px] font-bold" style={{ color }}>{item.score}/{item.max}</span>
                    <span className="text-[9px] text-on-surface-muted uppercase tracking-wider font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2.5">
              <h4 className="font-medium text-xs text-on-surface-muted uppercase tracking-wider">{t('labels.topSuggestions')}</h4>
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
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Icon name="check_circle" className="text-[16px] text-green-600" /></div>
                  <span className="font-bold">{t('analysis.perfect')}!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
