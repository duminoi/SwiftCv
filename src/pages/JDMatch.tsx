import { useState } from 'react';
import { useCVStore } from '../store/useCVStore';
import { matchJD } from '../services/api';
import { Icon } from '../components/Icon';
import { ScoreGauge } from '../components/ScoreGauge';

export default function JDMatch() {
  const { data, language, addSkill } = useCVStore();
  const [jdText, setJdText] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatch = async () => {
    if (!jdText.trim()) return;
    setMatchLoading(true);
    setMatchResult(null);
    setError(null);
    try {
      const result = await matchJD(data, jdText, language);
      setMatchResult(result);
    } catch (err: any) {
      setError(err.message);
      setMatchResult(null);
    } finally {
      setMatchLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="font-bold text-xl text-on-surface mb-2">Job Match</h2>
          <p className="text-sm text-on-surface-muted">Paste a job description to see how your CV matches.</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-error-container/20 p-3 rounded border border-error-container text-sm text-on-surface">
            <Icon name="error" className="text-error mt-0.5 shrink-0" />
            <div><p className="font-medium">Match failed</p><p className="text-xs text-on-surface-muted mt-1">{error}</p></div>
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-surface-border shadow-sm space-y-4 sm:space-y-5">
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste job description here..."
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-surface-border bg-transparent focus:border-primary focus:ring-2 focus:ring-primary-light/40 focus:outline-none text-sm text-on-surface resize-none"
          />
          <button
            onClick={handleMatch}
            disabled={matchLoading || !jdText.trim()}
            className="w-full h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {matchLoading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Analyzing...</>
            ) : (
              <><Icon name="search_insights" className="text-[20px]" /> Analyze Match</>
            )}
          </button>
        </div>

        {matchResult && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-surface-border shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <ScoreGauge value={matchResult.matchScore} max={100} size={100} thickness={7} label="% Match" />
              <div className="flex-1 w-full space-y-1.5">
                {[
                  { key: 'Keywords', score: matchResult.breakdown.keywords },
                  { key: 'Skills', score: matchResult.breakdown.skills },
                  { key: 'Experience', score: matchResult.breakdown.experience },
                  { key: 'Education', score: matchResult.breakdown.education },
                ].map(item => {
                  const barColor = item.score >= 70 ? '#14B8A6' : item.score >= 45 ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={item.key}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-on-surface font-medium">{item.key}</span>
                        <span className="text-on-surface-muted">{item.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.score}%`, backgroundColor: barColor }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {matchResult.experienceGap && (
              <div className="bg-surface-muted/10 border border-surface-border/30 rounded-lg p-3.5">
                <p className="text-sm text-on-surface">{matchResult.experienceGap}</p>
              </div>
            )}

            {matchResult.missingKeywords.length > 0 && (
              <div className="border-t border-surface-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-medium text-xs text-error uppercase tracking-wider">Missing Keywords</h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-error-container/40 text-error">{matchResult.missingKeywords.length}</span>
                  <span className="text-[10px] text-on-surface-muted ml-auto">Click to add to your CV</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.missingKeywords.map((kw: string, i: number) => (
                    <button key={i} onClick={() => addSkill(kw)} className="flex items-center gap-1.5 px-3 py-1.5 bg-error-container/30 text-error rounded-full text-xs font-medium hover:bg-error-container/60 transition-colors border border-error/20 hover:border-error/40">
                      <Icon name="add" className="text-[14px]" /> {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {matchResult.matchingKeywords.length > 0 && (
              <div className="border-t border-surface-border pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="font-medium text-xs text-green-600 uppercase tracking-wider">Matching Keywords</h4>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-50 text-green-700">{matchResult.matchingKeywords.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchResult.matchingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200/60">
                      <Icon name="check" className="text-[14px] shrink-0" /> {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {matchResult.suggestions && matchResult.suggestions.length > 0 && (
              <div className="border-t border-surface-border pt-4 space-y-2.5">
                <h4 className="font-medium text-xs text-on-surface-muted uppercase tracking-wider">Suggestions</h4>
                {matchResult.suggestions.map((s: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 bg-primary-light p-3.5 rounded-xl border border-primary-light/30 text-sm text-on-surface">
                    <div className="w-6 h-6 rounded-full bg-primary-light/60 flex items-center justify-center shrink-0 mt-0.5"><Icon name="lightbulb" className="text-[14px] text-primary" /></div>
                    <span className="leading-relaxed">{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
