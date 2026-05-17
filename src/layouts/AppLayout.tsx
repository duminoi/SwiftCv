import { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, UserButton, SignIn } from '@clerk/clerk-react';
import { useTranslation } from 'react-i18next';
import { useCVStore } from '../store/useCVStore';
import { Icon } from '../components/Icon';

export function AppLayout() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { cvs, currentCvId, switchCV, deleteCV, renameCV, createCV, language, setLanguage, userTier, data } = useCVStore();
  const [showCvMenu, setShowCvMenu] = useState(false);
  const [renamingCv, setRenamingCv] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const cvMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cvMenuRef.current && !cvMenuRef.current.contains(e.target as Node)) {
        setShowCvMenu(false);
      }
    };
    if (showCvMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCvMenu]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-on-surface tracking-tight">SwiftCv</h1>
            <p className="text-sm text-on-surface-muted mt-2">Build professional CVs in minutes</p>
          </div>
          <SignIn routing="hash" signUpUrl="#/sign-up" />
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/', icon: 'description', label: 'CV Editor', short: 'CV' },
    { path: '/analysis', icon: 'insights', label: 'AI Analysis', short: 'AI' },
    { path: '/match', icon: 'search_insights', label: 'Job Match', short: 'Match' },
    { path: '/jobs', icon: 'track_changes', label: 'Job Tracker', short: 'Jobs' },
    { path: '/cover-letter', icon: 'article', label: 'Cover Letter', short: 'Cover' },
    { path: '/pricing', icon: 'workspace_premium', label: 'Upgrade', short: 'Pro' },
    { path: '/settings', icon: 'settings', label: 'Settings', short: 'Setup' },
  ];

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

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        useCVStore.getState().importData(parsed);
      } catch { }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col text-sm overflow-hidden">
      <header className="h-14 sm:h-[56px] bg-white/80 backdrop-blur-sm flex items-center justify-between px-3 sm:px-4 border-b border-surface-border shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 cursor-default">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-base shrink-0">S</div>
            <span className="font-bold text-base sm:text-lg text-on-surface tracking-tight hidden xs:inline">SwiftCv</span>
          </div>
          <div className="w-px h-5 bg-surface-border hidden sm:block"></div>
          <div className="relative hidden sm:block" ref={cvMenuRef}>
            <button
              onClick={() => setShowCvMenu(!showCvMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-surface-hover transition-colors text-sm font-medium text-on-surface"
            >
              <Icon name="description" className="text-[18px] text-primary" />
              <span className="max-w-[120px] truncate">{cvs.find(c => c.id === currentCvId)?.name || 'My CV'}</span>
              <Icon name="expand_more" className={`text-[16px] text-on-surface-muted transition-transform ${showCvMenu ? 'rotate-180' : ''}`} />
            </button>
            {showCvMenu && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-surface-border rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                {cvs.map(cv => (
                  <div key={cv.id} className="flex items-center gap-1 px-3 py-2 hover:bg-surface-hover group cursor-pointer">
                    {renamingCv === cv.id ? (
                      <input
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onBlur={() => { if (renameValue.trim()) renameCV(cv.id, renameValue.trim()); setRenamingCv(null); }}
                        onKeyDown={e => e.key === 'Enter' && (() => { if (renameValue.trim()) renameCV(cv.id, renameValue.trim()); setRenamingCv(null); })()}
                        className="flex-1 text-sm px-2 py-0.5 rounded border border-surface-border bg-transparent focus:border-primary focus:outline-none"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => { switchCV(cv.id); setShowCvMenu(false); }}
                        className={`flex-1 text-left text-sm ${currentCvId === cv.id ? 'font-bold text-primary' : 'text-on-surface'}`}
                      >
                        {cv.name}
                      </button>
                    )}
                    {currentCvId === cv.id && <Icon name="check" className="text-[14px] text-primary shrink-0" />}
                    <button onClick={() => { setRenamingCv(cv.id); setRenameValue(cv.name); }} className="opacity-0 group-hover:opacity-100 text-[12px] text-on-surface-muted hover:text-primary p-0.5">
                      <Icon name="edit" className="text-[14px]" />
                    </button>
                    {cvs.length > 1 && (
                      <button onClick={() => deleteCV(cv.id)} className="opacity-0 group-hover:opacity-100 text-[12px] text-on-surface-muted hover:text-error p-0.5">
                        <Icon name="delete" className="text-[14px]" />
                      </button>
                    )}
                  </div>
                ))}
                <div className="border-t border-surface-border my-1"></div>
                <button onMouseDown={(e) => { e.stopPropagation(); createCV('My CV'); setShowCvMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium hover:bg-surface-hover">
                  <Icon name="add" className="text-[16px]" /> New CV
                </button>
              </div>
            )}
          </div>
          {/* Mobile CV selector */}
          <div className="sm:hidden relative" ref={cvMenuRef}>
            <button
              onClick={() => setShowCvMenu(!showCvMenu)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-hover transition-colors text-xs font-medium text-on-surface"
            >
              <Icon name="description" className="text-[16px] text-primary" />
              <span className="max-w-[80px] truncate">{cvs.find(c => c.id === currentCvId)?.name || 'My CV'}</span>
              <Icon name="expand_more" className={`text-[14px] text-on-surface-muted transition-transform ${showCvMenu ? 'rotate-180' : ''}`} />
            </button>
            {showCvMenu && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-surface-border rounded-lg shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                {cvs.map(cv => (
                  <div key={cv.id} className="flex items-center gap-1 px-3 py-2 hover:bg-surface-hover cursor-pointer">
                    <button onClick={() => { switchCV(cv.id); setShowCvMenu(false); }} className={`flex-1 text-left text-sm ${currentCvId === cv.id ? 'font-bold text-primary' : 'text-on-surface'}`}>{cv.name}</button>
                    {currentCvId === cv.id && <Icon name="check" className="text-[14px] text-primary shrink-0" />}
                  </div>
                ))}
                <div className="border-t border-surface-border my-1"></div>
                <button onMouseDown={(e) => { e.stopPropagation(); createCV('My CV'); setShowCvMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary font-medium hover:bg-surface-hover">
                  <Icon name="add" className="text-[16px]" /> New CV
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="hidden sm:flex items-center h-10 px-4 rounded-full border border-surface-border text-primary font-medium hover:bg-primary/5 transition-colors text-sm">
            {t('common.import')}
          </button>
          <button onClick={handleExportJSON} className="hidden sm:flex items-center h-10 px-4 rounded-full border border-surface-border text-primary font-medium hover:bg-primary/5 transition-colors text-sm">
            {t('common.export')}
          </button>
          <button onClick={() => { const l = language === 'en' ? 'vi' : 'en'; setLanguage(l); i18n.changeLanguage(l); }} className="hidden sm:flex items-center h-10 px-4 sm:px-6 rounded-full border border-surface-border text-primary font-medium hover:bg-primary/5 transition-colors uppercase text-sm">
            {language}
          </button>
          {userTier !== 'free' && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-premium-bg border border-premium/20 text-xs font-medium text-premium">
              <Icon name="workspace_premium" className="text-[14px]" />
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
            </div>
          )}
          <button onClick={() => navigate('/pricing')} className="hidden sm:flex h-10 px-4 rounded-full border border-premium/20 bg-premium-bg text-premium font-medium hover:bg-premium-bg/80 transition-colors text-sm items-center gap-1">
            <Icon name="workspace_premium" className="text-[16px]" />
            {userTier === 'free' ? 'Upgrade' : 'Plan'}
          </button>
          <div className="hidden sm:flex items-center">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <nav className="w-14 lg:w-16 shrink-0 bg-surface-muted flex flex-col items-center py-2 sm:py-3 gap-1 border-r border-surface-border">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-11 lg:w-14 py-[6px] rounded-lg flex flex-col items-center gap-0.5 transition-colors text-[10px] ${
                  isActive ? 'bg-primary-light text-primary font-semibold' : 'text-on-surface-muted hover:text-on-surface hover:bg-surface-hover/50'
                }`}
                title={item.label}
              >
                <Icon name={item.icon} className="text-[20px] lg:text-[22px]" />
                <span className="hidden lg:inline truncate max-w-[56px]">{item.short}</span>
              </button>
            );
          })}
        </nav>

        <main className="flex-1 flex overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
