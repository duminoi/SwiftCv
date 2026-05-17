import { useTranslation } from 'react-i18next';
import { useCVStore } from '../store/useCVStore';
import { Icon } from '../components/Icon';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, primaryColor, setPrimaryColor, fontFamily, setFontFamily, resetData, data, importData } = useCVStore();
  const fileInputRef = { current: null as HTMLInputElement | null };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${data.personalInfo.fullName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div>
          <h2 className="font-bold text-xl text-on-surface mb-2">{t('sections.settings')}</h2>
          <p className="text-sm text-on-surface-muted">Customize your CV appearance and manage data.</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg border border-surface-border shadow-sm space-y-6 sm:space-y-8">
          <div>
            <h3 className="font-medium text-xs uppercase tracking-widest text-on-surface-muted mb-4">{t('labels.color')}</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded-lg border border-surface-border cursor-pointer" />
              <span className="text-sm text-on-surface-muted font-mono">{primaryColor}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-xs uppercase tracking-widest text-on-surface-muted mb-4">{t('labels.font')}</h3>
            <div className="flex flex-wrap gap-2">
              {(['sans', 'serif', 'mono'] as const).map((f) => (
                <button key={f} onClick={() => setFontFamily(f)} className={`px-4 sm:px-6 py-3 rounded-lg border text-sm font-medium transition-all ${fontFamily === f ? 'border-primary bg-primary-light/40 text-primary ring-2 ring-primary/20' : 'border-surface-border text-on-surface-muted hover:border-primary/50'}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-xs uppercase tracking-widest text-on-surface-muted mb-4">{t('labels.dataManagement')}</h3>
            <p className="text-sm text-on-surface-muted mb-4">{t('labels.tip')}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex gap-3 flex-wrap">
                <input type="file" accept=".json" className="hidden" id="import-json-settings" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => { try { importData(JSON.parse(event.target?.result as string)); } catch {} };
                  reader.readAsText(file);
                  e.target.value = '';
                }} />
                <label htmlFor="import-json-settings" className="px-5 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center gap-2 cursor-pointer">
                  <Icon name="upload_file" className="text-[18px]" /> Import JSON
                </label>
                <button onClick={handleExportJSON} className="px-5 py-2.5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center gap-2">
                  <Icon name="download" className="text-[18px]" /> Export JSON
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-surface-border pt-6">
            <h3 className="font-medium text-xs uppercase tracking-widest text-on-surface-muted mb-4">Language</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'en', name: 'English' }, { code: 'vi', name: 'Tiếng Việt' }, { code: 'ja', name: '日本語' },
                { code: 'ko', name: '한국어' }, { code: 'zh', name: '中文' }, { code: 'es', name: 'Español' },
                { code: 'fr', name: 'Français' }, { code: 'de', name: 'Deutsch' },
              ].map(lang => (
                <button key={lang.code} onClick={() => { setLanguage(lang.code as any); i18n.changeLanguage(lang.code as any); }} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${language === lang.code ? 'border-primary bg-primary-light/40 text-primary' : 'border-surface-border text-on-surface-muted hover:border-primary/50'}`}>
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-surface-border pt-6">
            <h3 className="font-medium text-xs uppercase tracking-widest text-on-surface-muted mb-4">Reset</h3>
            <button onClick={() => { if (window.confirm(t('common.confirmReset'))) resetData(); }} className="px-5 py-2.5 rounded-xl border border-error text-error text-sm font-medium hover:bg-error-container/20 transition-colors flex items-center gap-2">
              <Icon name="delete_forever" className="text-[18px]" />
              {t('common.reset')}
            </button>
            <span className="text-[10px] text-on-surface-muted ml-3">This action cannot be undone</span>
          </div>
        </div>
      </div>
    </div>
  );
}
