import { useRef, useState } from 'react';
import { Icon } from './Icon';

interface Props {
  onBack: () => void;
  onDataImported: (data: any) => void;
}

export function CVUpload({ onBack, onDataImported }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const result = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: 'upload' }),
      }).then(r => r.json());
      if (result.fullName || result.experiences) {
        onDataImported(result);
      } else {
        setError('Could not extract CV data from this file. Try a different format.');
      }
    } catch {
      setError('Failed to process file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-on-surface-muted hover:text-on-surface transition-colors">
          <Icon name="arrow_back" className="text-[18px]" /> Back
        </button>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Upload Your CV</h1>
          <p className="text-sm text-on-surface-muted">Upload a PDF or DOCX file and we'll extract your information</p>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            dragOver ? 'border-primary bg-primary-light/30' : 'border-surface-border hover:border-primary/40 hover:bg-surface-muted/50'
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-on-surface-muted">Processing your file...</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                <Icon name="upload_file" className="text-[32px] text-primary" />
              </div>
              <p className="font-medium text-on-surface mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-on-surface-muted">PDF or DOCX up to 10MB</p>
            </>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-light border border-error/20 text-sm text-error">
            <Icon name="error" className="text-[18px]" /> {error}
          </div>
        )}
      </div>
    </div>
  );
}
