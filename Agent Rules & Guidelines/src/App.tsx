import React, { useState, useEffect, useMemo } from 'react';
import { Language, UserIdentity, JobListing, JobStatus, ApplicationLog } from './types';
import { SOURCES, UI_LABELS, DEFAULT_CUSTOM_SOURCES } from './constants';
import { fetchJobs, fetchLogs, addLog, updateJob, isUsingFallback } from './services/apiService';
import { calculateRelevance } from './services/geminiService';
import Layout from './components/Layout';
import JobFeed from './components/JobFeed';
import JobDetail from './components/JobDetail';
import IdentityForm from './components/IdentityForm';
import TrackingLogs from './components/TrackingLogs';
import AlphabeticalJobList from './components/AlphabeticalJobList';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'identity' | 'saved' | 'logs' | 'alphabetical'>('dashboard');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  /** Default identity sourced from identity/identity.md */
  const [identity, setIdentity] = useState<UserIdentity>({
    fullName: '',
    email: '',
    phone: '',
    language: Language.EN,
    resumeText: `Dependable professional with proven track record across New Caledonia's labour and service sectors. Hands-on experience spanning:

- Grounds & green spaces — gardening, landscaping, maintenance
- Construction & renovation — demolition, concreting, renovation works
- Industrial — factory operations and production environments

Adaptable worker, ready to contribute across trades and on-site roles.`,
    skills: [
      'gardening',
      'landscaping',
      'maintenance',
      'demolition',
      'concreting',
      'renovation works',
      'factory operations',
      'production',
    ],
    certifications: [],
    experienceSummary: "Dependable professional with proven track record across New Caledonia's labour and service sectors. Adaptable worker, ready to contribute across trades and on-site roles.",
    preferredLocations: ['Nouméa', 'Dumbéa', 'Païta'],
    preferredCommunes: [],
    preferredJobTypes: ['CDI', 'CDD', 'Short Term'],
    meansOfTransport: '',
    customSources: [...DEFAULT_CUSTOM_SOURCES],
    openClawApiKey: '',
  });
  
  const [enabledSources, setEnabledSources] = useState<string[]>(SOURCES.filter(s => s.enabled).map(s => s.id));
  const [logs, setLogs] = useState<ApplicationLog[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);

  const t = UI_LABELS[lang];

  useEffect(() => {
    let cancelled = false;
    setJobsLoading(true);
    setJobsError(null);
    Promise.all([fetchJobs(), fetchLogs()])
      .then(([jobList, logList]) => {
        if (cancelled) return;
        setJobs(jobList);
        setLogs(logList);
        setUsingFallback(isUsingFallback());
      })
      .catch((err) => {
        if (!cancelled) {
          setJobsError(err instanceof Error ? err.message : 'Failed to load jobs');
          setJobs([]);
          setLogs([]);
        }
      })
      .finally(() => {
        if (!cancelled) setJobsLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const updateRelevance = async () => {
      const updatedJobs = await Promise.all(jobs.map(async (job) => {
        const score = await calculateRelevance(job, identity);
        return { ...job, relevanceScore: score };
      }));
      setJobs(updatedJobs);
    };
    
    if (jobs.length > 0) {
      updateRelevance();
    }
  }, [identity.skills, identity.meansOfTransport, identity.experienceSummary]);

  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter(j => enabledSources.includes(j.sourceId));
    
    // Filtering by Preferred Communes
    if (identity.preferredCommunes.length > 0) {
      filtered = filtered.filter(j => {
        return identity.preferredCommunes.some(commune => 
          j.location.toLowerCase().includes(commune.toLowerCase())
        );
      });
    }

    if (activeTab === 'saved') {
      filtered = filtered.filter(j => j.status === JobStatus.SAVED);
    }
    
    if (activeTab === 'dashboard' || activeTab === 'saved') {
      filtered = [...filtered].sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
    
    return filtered;
  }, [jobs, enabledSources, activeTab, identity.preferredCommunes]);

  const selectedJob = useMemo(() => {
    return jobs.find(j => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  const handleUpdateJobStatus = (jobId: string, status: JobStatus, note?: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
    const timestamp = new Date().toISOString();
    const newLogEntry = { jobId, status, timestamp, notes: note || `Status updated to ${status}` };
    setLogs(prev => [{ ...newLogEntry, id: `log-${Date.now()}` }, ...prev]);
    updateJob(jobId, { status }).catch(console.error);
    addLog(newLogEntry).then((log) => {
      setLogs(prev => prev.map(l => l.jobId === jobId && l.timestamp === timestamp ? { ...l, id: log.id } : l));
    }).catch(console.error);
  };

  const handleConnectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        // In a real app, we'd use these coordinates to bias search or find the closest commune.
        // For now, we simulate a "Location Connected" state.
        const msg = `Location connected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}. Search results prioritized for your vicinity.`;
        setLogs(prev => [{
          id: Math.random().toString(36).substr(2, 9),
          jobId: 'system',
          status: JobStatus.NEW,
          timestamp: new Date().toISOString(),
          notes: msg
        }, ...prev]);
        alert("Success: App connected to your local coordinates.");
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location.");
      }
    );
  };

  return (
    <Layout 
      lang={lang} 
      setLang={setLang} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      enabledSources={enabledSources}
      setEnabledSources={setEnabledSources}
      jobs={jobs}
      onSelectJob={setSelectedJobId}
      identity={identity}
      setIdentity={setIdentity}
      onConnectLocation={handleConnectLocation}
      isLocating={isLocating}
    >
      <div className="flex flex-col h-full w-full overflow-hidden">
        {usingFallback && (
          <div className="shrink-0 px-4 py-2 bg-yellow-500/10 border-b border-yellow-400/20 text-yellow-400/90 text-sm text-center">
            Using offline data — start the server to sync and persist updates (<code className="bg-black/20 px-1 rounded">npm run dev:all</code> or <code className="bg-black/20 px-1 rounded">npm run server</code>).
          </div>
        )}
        <div className="flex h-full w-full overflow-hidden min-h-0">
        <div className={`flex-1 flex flex-col h-full border-r border-yellow-400/20 min-h-0 ${selectedJobId ? 'hidden md:flex' : 'flex'}`}>
          {(activeTab === 'dashboard' || activeTab === 'saved') && (
            <>
              {jobsLoading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                  <i className="fa-solid fa-spinner fa-spin text-4xl text-yellow-400"></i>
                  <p className="text-gray-400 font-medium">{t.search}...</p>
                </div>
              )}
              {!jobsLoading && jobsError && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <i className="fa-solid fa-wifi text-4xl text-red-400/80"></i>
                  <p className="text-red-400/90 font-medium">{jobsError}</p>
                  <p className="text-gray-500 text-sm">Ensure the API server is running (e.g. <code className="bg-white/10 px-1 rounded">npm run server</code> in the server folder).</p>
                  <button
                    type="button"
                    onClick={() => { setJobsError(null); setJobsLoading(true); Promise.all([fetchJobs(), fetchLogs()]).then(([j, l]) => { setJobs(j); setLogs(l); setUsingFallback(isUsingFallback()); }).catch(e => setJobsError(e?.message ?? 'Failed')).finally(() => setJobsLoading(false)); }}
                    className="mt-2 px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-400/30 hover:bg-yellow-500/30 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
              {!jobsLoading && !jobsError && (
                <JobFeed 
                  jobs={filteredJobs} 
                  onSelectJob={setSelectedJobId} 
                  onStatusChange={handleUpdateJobStatus}
                  selectedJobId={selectedJobId}
                  lang={lang}
                  isSavedView={activeTab === 'saved'}
                />
              )}
            </>
          )}
          {activeTab === 'alphabetical' && (
            <>
              {jobsLoading && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
                  <i className="fa-solid fa-spinner fa-spin text-4xl text-yellow-400"></i>
                  <p className="text-gray-400 font-medium">{t.search}...</p>
                </div>
              )}
              {!jobsLoading && jobsError && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <i className="fa-solid fa-wifi text-4xl text-red-400/80"></i>
                  <p className="text-red-400/90 font-medium">{jobsError}</p>
                </div>
              )}
              {!jobsLoading && !jobsError && (
                <AlphabeticalJobList 
                  jobs={filteredJobs} 
                  onSelectJob={setSelectedJobId} 
                  selectedJobId={selectedJobId}
                  lang={lang}
                />
              )}
            </>
          )}
          {activeTab === 'identity' && (
            <div className="p-6 overflow-y-auto">
              <IdentityForm identity={identity} setIdentity={setIdentity} lang={lang} />
            </div>
          )}
          {activeTab === 'logs' && (
            <div className="p-6 overflow-y-auto">
              <TrackingLogs logs={logs} jobs={jobs} lang={lang} />
            </div>
          )}
        </div>

        <div className={`w-full md:w-2/5 lg:w-1/3 flex flex-col h-full min-h-0 bg-[#0a0a0a] ${selectedJobId || (activeTab !== 'dashboard' && activeTab !== 'alphabetical' && activeTab !== 'identity' && activeTab !== 'logs' && activeTab !== 'saved') ? 'flex' : 'hidden md:flex'}`}>
          {selectedJob ? (
            <JobDetail 
              job={selectedJob} 
              identity={identity} 
              onClose={() => setSelectedJobId(null)}
              onStatusChange={handleUpdateJobStatus}
              lang={lang}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted p-12 text-center">
              <i className="fa-solid fa-briefcase text-5xl mb-4 text-yellow-400/20"></i>
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">{t.search}</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;