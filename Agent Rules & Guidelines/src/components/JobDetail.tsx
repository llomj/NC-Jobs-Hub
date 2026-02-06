import React, { useState } from 'react';
import { JobListing, UserIdentity, Language, JobStatus } from '../types';
import { UI_LABELS } from '../constants';
import EmailComposer from './EmailComposer';

interface JobDetailProps {
  job: JobListing;
  identity: UserIdentity;
  onClose: () => void;
  onStatusChange: (id: string, s: JobStatus, note?: string) => void;
  lang: Language;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, identity, onClose, onStatusChange, lang }) => {
  const [view, setView] = useState<'details' | 'email'>('details');
  const [showUnsaveWarning, setShowUnsaveWarning] = useState(false);
  const t = UI_LABELS[lang];

  const handleOpenSource = (e: React.MouseEvent) => {
    e.preventDefault();
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSaveToggle = () => {
    const isSaved = job.status === JobStatus.SAVED;
    if (isSaved) {
      // If already saved, show warning before removing
      setShowUnsaveWarning(true);
    } else {
      onStatusChange(job.id, JobStatus.SAVED, 'Job saved for later review');
    }
  };

  const confirmUnsave = () => {
    onStatusChange(job.id, JobStatus.NEW, 'Job removed from saved list');
    setShowUnsaveWarning(false);
  };

  const openInMaps = () => {
    const query = job.address || `${job.company}, ${job.location}, New Caledonia`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const isRequirementMatched = (req: string) => {
    const lowerReq = req.toLowerCase();
    const userPool = identity.skills.map(s => s.toLowerCase());
    return userPool.some(userSkill => lowerReq.includes(userSkill) || userSkill.includes(lowerReq));
  };

  const isJobSaved = job.status === JobStatus.SAVED;
  const isHighMatch = (job.relevanceScore || 0) >= 75;

  // Format date to DD.MM.YYYY
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] relative">
      {/* Unsave Confirmation Overlay */}
      {showUnsaveWarning && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-red-500/20 p-8 rounded-3xl w-full max-w-xs shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <i className="fa-solid fa-trash-can text-2xl"></i>
            </div>
            <h4 className="text-lg font-black text-center mb-2 tracking-tighter">Remove Bookmark?</h4>
            <p className="text-gray-500 text-center text-sm mb-6 leading-relaxed">This job will be removed from your saved list and tracking logs.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmUnsave}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition"
              >
                Yes, Remove
              </button>
              <button 
                onClick={() => setShowUnsaveWarning(false)}
                className="w-full py-3 bg-white/5 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-b border-yellow-400/20 flex items-center justify-between sticky top-0 bg-black/60 backdrop-blur-xl z-10">
        <button onClick={onClose} className="text-gray-400 hover:text-white md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 transition">
          <i className="fa-solid fa-chevron-left text-lg"></i>
        </button>
        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setView('details')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'details' ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Info
          </button>
          <button 
            onClick={() => setView('email')}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'email' ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {t.apply}
          </button>
        </div>
        <button 
          onClick={handleSaveToggle}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 border ${isJobSaved ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/50 shadow-[0_0_200px_rgba(251,191,36,0.3)]' : 'text-gray-500 border-transparent hover:text-yellow-400 hover:bg-yellow-400/5'}`}
          title={isJobSaved ? "Unsave job" : "Save job"}
        >
          <i className={`${isJobSaved ? 'fa-solid' : 'fa-regular'} fa-bookmark text-lg`}></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {view === 'details' ? (
          <div className="space-y-8">
            {/* Identity Match Banner */}
            {isHighMatch && (
              <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-4 duration-500">
                <div className="relative">
                   <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute opacity-50"></div>
                   <div className="w-4 h-4 bg-green-500 rounded-full relative shadow-[0_0_15px_#22c55e]"></div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Ideal Identity Match</p>
                  <p className="text-xs text-green-400/80 font-bold">This role perfectly fits your skills and transport: <span className="text-white">({identity.meansOfTransport})</span></p>
                </div>
              </div>
            )}

            <header>
              <div className="flex items-center space-x-2 mb-3">
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[9px] text-yellow-400/60 font-black uppercase tracking-[0.3em] border-l-2 border-yellow-400 pl-2 hover:text-yellow-400 transition-colors cursor-pointer"
                    title="Open announcement on source website"
                  >
                    {job.sourceId}
                    <i className="fa-solid fa-external-link ml-1.5 opacity-70 text-[8px]" aria-hidden />
                  </a>
                ) : (
                  <span className="text-[9px] text-yellow-400/60 font-black uppercase tracking-[0.3em] border-l-2 border-yellow-400 pl-2">{job.sourceId}</span>
                )}
              </div>
              <h2 className="text-3xl font-black mb-2 leading-tight tracking-tighter">{job.title}</h2>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-yellow-400 font-bold text-sm">
                <span className="flex items-center"><i className="fa-solid fa-building mr-2 opacity-50"></i>{job.company}</span>
                <span className="text-gray-600">•</span>
                <span className="flex items-center"><i className="fa-solid fa-location-arrow mr-2 opacity-50"></i>{job.location}</span>
              </div>
            </header>
            
            <div className="space-y-3">
              <button 
                onClick={openInMaps}
                className="flex items-center space-x-4 w-full bg-white/5 p-4 rounded-2xl border border-white/10 hover:border-yellow-400/40 transition group backdrop-blur-xl shadow-lg ring-1 ring-white/5"
              >
                <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center text-yellow-400 group-hover:bg-yellow-400 group-hover:text-black transition-all">
                  <i className="fa-solid fa-map-marked-alt text-xl"></i>
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] text-gray-500 font-black uppercase trackingidest mb-0.5">Workplace Coordinates</p>
                  <p className="text-sm text-white font-bold leading-tight">{job.address || job.location}</p>
                </div>
                <i className="fa-solid fa-external-link text-gray-700 group-hover:text-yellow-400 transition text-sm"></i>
              </button>

              {/* CONTACT PHONE SECTION UNDERNEATH COORDINATES */}
              {job.contactPhone && (
                <div className="flex items-center space-x-4 w-full bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                    <i className="fa-solid fa-phone-flip text-xl"></i>
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Contact Enterprise</p>
                    <a href={`tel:${job.contactPhone}`} className="text-sm text-white font-black hover:text-green-400 transition-colors">
                      {job.contactPhone}
                    </a>
                  </div>
                </div>
              )}

              {/* EMPLOYER EMAIL (ENTERPRISE OR PERSONAL) - always shown */}
              <div className="flex items-center space-x-4 w-full bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-green-500">
                  <i className="fa-solid fa-envelope text-xl"></i>
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Employer Email</p>
                  {job.contactEmail ? (
                    <a href={`mailto:${job.contactEmail}`} className="text-sm text-white font-black hover:text-green-400 transition-colors break-all">
                      {job.contactEmail}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 font-medium">No email provided — apply via official portal below</p>
                  )}
                </div>
              </div>

              {/* DATE OF ANNOUNCEMENT SECTION */}
              <div className="flex items-center space-x-4 w-full bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl shadow-lg ring-1 ring-white/5">
                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400">
                  <i className="fa-solid fa-calendar-day text-xl"></i>
                </div>
                <div className="text-left flex-1">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Date of Announcement</p>
                  <p className="text-sm text-white font-black">
                    {formatDate(job.postedDate)}
                  </p>
                </div>
              </div>
            </div>

            {job.relevanceScore !== undefined && (
              <div className={`bg-[#0f0f0f] border rounded-2xl p-5 shadow-inner transition-colors ${isHighMatch ? 'border-green-500/20 bg-green-500/5' : 'border-white/5'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isHighMatch ? 'text-green-400' : 'text-yellow-400'}`}>{t.matchingLabel}</span>
                  <span className={`text-2xl font-black tracking-tighter ${isHighMatch ? 'text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'text-yellow-400'}`}>{job.relevanceScore}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className={`h-full rounded-full transition-all duration-1000 ${isHighMatch ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]'}`} style={{ width: `${job.relevanceScore}%` }}></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Process Stat</div>
                <select 
                  value={job.status} 
                  onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
                  className="bg-transparent text-sm font-black text-white w-full focus:outline-none accent-yellow-400 cursor-pointer"
                >
                  {Object.values(JobStatus).map(s => (
                    <option key={s} value={s} className="bg-black">{s.toUpperCase()}</option>
                  ))}
                </select>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Engagement</div>
                <div className="text-sm font-black text-yellow-400">{job.contractType}</div>
              </div>
            </div>

            <section>
              <h4 className="text-[10px] uppercase font-black text-gray-500 mb-4 tracking-[0.3em] flex items-center">
                <span className="w-8 h-px bg-gray-800 mr-3"></span> Brief
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap font-medium">{job.description}</p>
            </section>

            <section>
              <h4 className="text-[10px] uppercase font-black text-gray-500 mb-4 tracking-[0.3em] flex items-center">
                <span className="w-8 h-px bg-gray-800 mr-3"></span> Checkpoints
              </h4>
              <ul className="space-y-3">
                {job.requirements.map((req, i) => {
                  const matched = isRequirementMatched(req);
                  return (
                    <li key={i} className={`text-sm p-4 rounded-2xl flex items-start space-x-4 transition border backdrop-blur-md ${matched ? 'bg-yellow-400/5 border-yellow-400/20 text-white shadow-md' : 'bg-white/5 border-transparent text-gray-500'}`}>
                      <i className={`fa-solid ${matched ? 'fa-square-check text-yellow-400' : 'fa-square opacity-20'} mt-1`}></i>
                      <span className="font-bold">{req}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="pt-4 sticky bottom-0 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent pb-6">
              <button 
                onClick={handleOpenSource}
                className={`group block w-full text-center py-4 font-black rounded-2xl transition-all border backdrop-blur-xl shadow-2xl relative overflow-hidden ${
                  job.sourceId === 'fb-workplace' 
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30' 
                  : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/20'
                }`}
              >
                <div className="relative z-10 flex items-center justify-center space-x-3 uppercase tracking-widest text-xs">
                  <i className={`${job.sourceId === 'fb-workplace' ? 'fa-brands fa-facebook-f' : 'fa-solid fa-paper-plane'} text-sm`}></i>
                  <span>{job.sourceId === 'fb-workplace' ? 'Respond on Facebook' : 'Visit Official Portal'}</span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <EmailComposer 
            job={job} 
            identity={identity} 
            lang={lang} 
            onSent={() => {
              onStatusChange(job.id, JobStatus.APPLIED, 'Applied via internal email tool');
              setView('details');
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default JobDetail;