import { Icon } from './Icon';

interface Props {
  onCreateNew: () => void;
  onUpload: () => void;
  onImportLinkedIn: () => void;
}

export function OnboardingGateway({ onCreateNew, onUpload, onImportLinkedIn }: Props) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Welcome to SwiftCv</h1>
          <p className="text-sm text-on-surface-muted">How would you like to get started?</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={onCreateNew}
            className="w-full flex items-center gap-4 p-5 rounded-xl bg-white border border-surface-border hover:border-primary/40 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="note_add" className="text-[24px] text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-on-surface text-sm">Create New CV</div>
              <div className="text-xs text-on-surface-muted mt-0.5">Start from scratch with a professional template</div>
            </div>
            <Icon name="chevron_right" className="text-[20px] text-on-surface-muted group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={onUpload}
            className="w-full flex items-center gap-4 p-5 rounded-xl bg-white border border-surface-border hover:border-primary/40 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-success-light flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="upload_file" className="text-[24px] text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-on-surface text-sm">Upload Existing CV</div>
              <div className="text-xs text-on-surface-muted mt-0.5">Import from a PDF or DOCX file</div>
            </div>
            <Icon name="chevron_right" className="text-[20px] text-on-surface-muted group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={onImportLinkedIn}
            className="w-full flex items-center gap-4 p-5 rounded-xl bg-white border border-surface-border hover:border-primary/40 hover:shadow-md transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8F0FE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Icon name="linkedin" className="text-[24px]" style={{ color: '#0A66C2' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-on-surface text-sm">Import from LinkedIn</div>
              <div className="text-xs text-on-surface-muted mt-0.5">Paste your LinkedIn profile to auto-fill your CV</div>
            </div>
            <Icon name="chevron_right" className="text-[20px] text-on-surface-muted group-hover:text-primary transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
