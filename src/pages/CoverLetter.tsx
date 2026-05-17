import { useState } from 'react';
import { useCVStore } from '../store/useCVStore';
import { generateCoverLetter as apiGenerateCoverLetter } from '../services/api';
import { Icon } from '../components/Icon';
import { InputField } from '../components/InputField';

export default function CoverLetter() {
  const { data, language, coverLetters, addCoverLetter, removeCoverLetter } = useCVStore();
  const [form, setForm] = useState<{ companyName: string; jobTitle: string; tone: 'professional' | 'modern' }>({ companyName: '', jobTitle: '', tone: 'professional' });
  const [clResult, setClResult] = useState<any>(null);
  const [clLoading, setClLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!form.companyName.trim()) return;
    setClLoading(true);
    setClResult(null);
    setError(null);
    try {
      const result = await apiGenerateCoverLetter(data, form.companyName, form.jobTitle, form.tone, language);
      setClResult(result);
      addCoverLetter({
        id: crypto.randomUUID(),
        companyName: form.companyName,
        jobTitle: form.jobTitle,
        content: result.body || '',
        tone: form.tone,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setClLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="font-bold text-xl text-on-surface mb-2">Cover Letter</h2>
          <p className="text-sm text-on-surface-muted">Generate AI-powered cover letters tailored to each job.</p>
        </div>

        {error && (
          <div className="flex items-start gap-3 bg-error-container/20 p-3 rounded border border-error-container text-sm text-on-surface">
            <Icon name="error" className="text-error mt-0.5 shrink-0" />
            <div><p className="font-medium">Generation failed</p><p className="text-xs text-on-surface-muted mt-1">{error}</p></div>
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-surface-border shadow-sm space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Company Name" value={form.companyName} onChange={(v) => setForm(f => ({ ...f, companyName: v }))} />
            <InputField label="Job Title (optional)" value={form.jobTitle} onChange={(v) => setForm(f => ({ ...f, jobTitle: v }))} />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <label className="font-medium text-xs text-primary">Tone</label>
            <div className="flex gap-2">
              {(['professional', 'modern'] as const).map(tone => (
                <button key={tone} onClick={() => setForm(f => ({ ...f, tone }))} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${form.tone === tone ? 'border-primary bg-primary-light/40 text-primary' : 'border-surface-border text-on-surface-muted hover:border-primary/50'}`}>
                  {tone === 'professional' ? 'Professional' : 'Modern'}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} disabled={clLoading || !form.companyName.trim()} className="w-full h-12 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {clLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Generating...</> : <><Icon name="auto_awesome" className="text-[20px]" /> Generate Cover Letter</>}
          </button>
        </div>

        {clResult && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-surface-border shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="font-medium text-base text-on-surface">Preview</h3>
              <div className="flex gap-2">
                <button onClick={() => { const blob = new Blob([clResult.body || ''], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `Cover_Letter_${form.companyName.replace(/\s+/g, '_')}.txt`; a.click(); URL.revokeObjectURL(url); }} className="px-4 py-2 rounded-lg border border-surface-border text-primary text-sm font-medium hover:bg-primary/5">
                  <Icon name="download" className="text-[14px]" /> Download
                </button>
              </div>
            </div>
            <div className="bg-white border border-surface-border rounded-xl p-4 sm:p-6 w-full max-w-[650px] mx-auto">
              {clResult.subject && <div className="font-bold text-lg mb-3">{clResult.subject}</div>}
              <div className="text-sm leading-relaxed whitespace-pre-line text-on-surface">{clResult.body}</div>
              {clResult.salutation && <div className="mt-4 text-sm text-on-surface">{clResult.salutation}</div>}
            </div>
          </div>
        )}

        {coverLetters.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-xs text-on-surface-muted uppercase tracking-wider">Saved Cover Letters</h3>
            {coverLetters.map(cl => (
              <div key={cl.id} className="bg-white p-4 rounded-xl border border-surface-border flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{cl.companyName}</div>
                  <div className="text-xs text-on-surface-muted">{cl.jobTitle || 'No title'} · {cl.tone} · {new Date(cl.createdAt).toLocaleDateString()}</div>
                </div>
                <button onClick={() => removeCoverLetter(cl.id)} className="text-on-surface-muted hover:text-error p-1"><Icon name="delete" className="text-[16px]" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
