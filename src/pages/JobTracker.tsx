import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCVStore } from '../store/useCVStore';
import type { JobStatus } from '../store/useCVStore';
import { Icon } from '../components/Icon';

export default function JobTracker() {
  const navigate = useNavigate();
  const { jobs, addJob, removeJob, moveJob } = useCVStore();
  const [newJob, setNewJob] = useState<{ company: string; position: string; url: string }>({ company: '', position: '', url: '' });

  const handleAddJob = () => {
    if (!newJob.company.trim() || !newJob.position.trim()) return;
    addJob({ company: newJob.company, position: newJob.position, url: newJob.url, status: 'saved', notes: '' });
    setNewJob({ company: '', position: '', url: '' });
  };

  const statusColumns: { key: JobStatus; label: string; color: string; bg: string }[] = [
    { key: 'saved', label: 'Saved', color: '#6366F1', bg: '#EEF2FF' },
    { key: 'applied', label: 'Applied', color: '#F59E0B', bg: '#FFFBEB' },
    { key: 'interview', label: 'Interview', color: '#10B981', bg: '#ECFDF5' },
    { key: 'offer', label: 'Offer', color: '#8B5CF6', bg: '#F5F3FF' },
    { key: 'rejected', label: 'Rejected', color: '#EF4444', bg: '#FEF2F2' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
        <div>
          <h2 className="font-bold text-xl text-on-surface mb-2">Job Tracker</h2>
          <p className="text-sm text-on-surface-muted">Track your job applications in a Kanban board.</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl border border-surface-border shadow-sm">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
            <input value={newJob.company} onChange={e => setNewJob(j => ({ ...j, company: e.target.value }))} placeholder="Company" className="flex-1 px-3 py-2 rounded border border-surface-border bg-transparent text-sm focus:border-primary focus:outline-none" />
            <input value={newJob.position} onChange={e => setNewJob(j => ({ ...j, position: e.target.value }))} placeholder="Position" className="flex-1 px-3 py-2 rounded border border-surface-border bg-transparent text-sm focus:border-primary focus:outline-none" />
            <input value={newJob.url} onChange={e => setNewJob(j => ({ ...j, url: e.target.value }))} placeholder="URL (optional)" className="flex-1 px-3 py-2 rounded border border-surface-border bg-transparent text-sm focus:border-primary focus:outline-none" />
            <button onClick={handleAddJob} className="px-4 py-2 rounded bg-primary text-white text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-1">
              <Icon name="add" className="text-[18px]" /><span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
          {statusColumns.map(col => {
            const colJobs = jobs.filter(j => j.status === col.key);
            return (
              <div key={col.key} className="flex-1 min-w-[260px] sm:min-w-[200px] bg-white rounded-xl border border-surface-border p-3 snap-start">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: col.color }}></div>
                  <span className="text-sm font-semibold text-on-surface">{col.label}</span>
                  <span className="text-xs text-on-surface-muted ml-auto">{colJobs.length}</span>
                </div>
                <div className="space-y-2">
                  {colJobs.map(job => (
                    <div key={job.id} className="bg-white rounded-lg border border-surface-border p-3 group hover:shadow-sm transition-shadow">
                      <div className="font-medium text-sm text-on-surface">{job.position}</div>
                      <div className="text-xs text-on-surface-muted mt-0.5">{job.company}</div>
                      {job.url && <a href={job.url} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline mt-1 block truncate">{job.url}</a>}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-border/30">
                        <span className="text-[9px] text-on-surface-muted">{new Date(job.updatedAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/?tailor=${encodeURIComponent(job.position + ' at ' + job.company)}`)} className="text-[9px] text-primary font-medium hover:underline flex items-center gap-0.5" title="Tailor CV for this job">
                            <Icon name="auto_fix_high" className="text-[10px]" /> Tailor
                          </button>
                          {statusColumns.filter(c => c.key !== col.key).map(c => (
                            <button key={c.key} onClick={() => moveJob(job.id, c.key)} title={`Move to ${c.label}`} className="w-4 h-4 rounded-full hover:scale-110 transition-transform" style={{ backgroundColor: c.color }}></button>
                          ))}
                          <button onClick={() => removeJob(job.id)} className="text-[10px] text-error hover:underline">✕</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {colJobs.length === 0 && <div className="text-xs text-on-surface-muted/50 text-center py-6">No jobs</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
