import React, { useState, useMemo } from 'react';
import { JobListing, Language, JobStatus } from '../types';
import { UI_LABELS, SOCIAL_FEED_FACEBOOK_GROUP_URL } from '../constants';

interface JobFeedProps {
  jobs: JobListing[];
  onSelectJob: (id: string) => void;
  onStatusChange?: (id: string, s: JobStatus, note?: string) => void;
  selectedJobId: string | null;
  lang: Language;
  isSavedView?: boolean;
}

const JobFeed: React.FC<JobFeedProps> = ({ jobs, onSelectJob, onStatusChange, selectedJobId, lang, isSavedView }) => {
  const [search, setSearch] = useState('');
  const [activeFeed, setActiveFeed] = useState<'all' | 'social'>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const t = UI_LABELS[lang];

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.location.toLowerCase().includes(search.toLowerCase());
      
      const isSocialSource = j.sourceId === 'fb-workplace';
      const matchesFeed = activeFeed === 'social' ? isSocialSource : true;
      
      return matchesSearch && matchesFeed;
    });
  }, [jobs, search, activeFeed]);

  const handleLocationClick = (e: React.MouseEvent, job: JobListing) => {
    e.stopPropagation();
    const query = job.address || `${job.company}, ${job.location}, New Caledonia`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const confirmDelete = () => {
    if (confirmDeleteId && onStatusChange) {
      onStatusChange(confirmDeleteId, JobStatus.NEW, 'Unsaved by user');
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black relative">
      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0f0f0f] border border-red-500/30 p-8 rounded-[2rem] max-w-sm w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in duration-300">
            <h3 className="text-xl font-black text-white text-center mb-6 tracking-tighter uppercase">Remove Bookmark?</h3>
            <div className="flex flex-col gap-3">
              <button onClick={confirmDelete} className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-all active:scale-95">Confirm Removal</button>
              <button onClick={() => setConfirmDeleteId(null)} className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/5 text-gray-500 border border-white/10 hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Feed Controls */}
      <div className="p-4 border-b border-yellow-400/10 bg-black/40 backdrop-blur-xl">
        <div className="flex flex-col gap-4">
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveFeed('all')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFeed === 'all' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-gray-500'}`}
            >
              <i className="fa-solid fa-globe mr-2"></i>
              Global Index
            </button>
            <button 
              onClick={() => setActiveFeed('social')}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFeed === 'social' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500'}`}
            >
              <i className="fa-brands fa-facebook-messenger mr-2"></i>
              Social Feed
            </button>
          </div>

          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input 
              type="text" 
              placeholder={activeFeed === 'social' ? "Search community posts..." : t.search}
              className={`w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none transition-all ${activeFeed === 'social' ? 'focus:border-blue-500/50' : 'focus:border-yellow-400/50'}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Social Feed: Facebook access card — icon, view job announcements, join group */}
        {activeFeed === 'social' && (
          <div className="p-5 rounded-3xl border border-blue-500/30 bg-blue-900/10 backdrop-blur-md">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <i className="fa-brands fa-facebook text-2xl text-blue-400"></i>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-white text-sm uppercase tracking-wider mb-1">Facebook</h4>
                <p className="text-blue-300/90 text-xs">{t.socialFeedCardDesc}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={SOCIAL_FEED_FACEBOOK_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <i className="fa-solid fa-bullhorn"></i>
                {t.socialFeedOpenFacebook}
              </a>
              <a
                href={SOCIAL_FEED_FACEBOOK_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <i className="fa-solid fa-user-plus"></i>
                {t.socialFeedJoinGroup}
              </a>
            </div>
          </div>
        )}

        {filtered.length > 0 ? (
          filtered.map(job => {
            const isSocial = job.sourceId === 'fb-workplace';
            const isSelected = selectedJobId === job.id;
            
            return (
              <div 
                key={job.id}
                onClick={() => onSelectJob(job.id)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all relative group backdrop-blur-md ${
                  isSelected 
                    ? isSocial ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]' : 'bg-yellow-400/10 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.1)]' 
                    : isSocial ? 'bg-blue-900/5 border-blue-500/10 hover:border-blue-500/30' : 'bg-[#0a0a0a] border-white/5 hover:border-yellow-400/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 pr-4">
                    <h3 className={`font-black text-lg leading-tight transition-colors mb-1 ${isSelected ? isSocial ? 'text-blue-400' : 'text-yellow-400' : 'text-white'}`}>
                      {job.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isSocial ? 'text-blue-500' : 'text-yellow-400/70'}`}>
                        {job.company}
                      </span>
                      {isSocial && <i className="fa-brands fa-facebook text-blue-500 text-[10px]"></i>}
                    </div>
                  </div>
                  
                  {isSavedView && (
                    <button onClick={(e) => handleDeleteClick(e, job.id)} className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
                      <i className="fa-solid fa-trash-can text-xs"></i>
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="text-[10px] font-bold bg-white/5 text-gray-500 px-3 py-1.5 rounded-xl border border-white/5">
                    <i className="fa-solid fa-location-dot mr-1.5 opacity-50"></i>
                    {job.location}
                  </div>
                  <div className={`text-[10px] font-black px-3 py-1.5 rounded-xl border ${isSocial ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-yellow-400/5 text-yellow-400/80 border-yellow-400/10'}`}>
                    {job.contractType}
                  </div>
                  {job.relevanceScore !== undefined && (
                    <div className="text-[10px] font-black bg-green-400/10 text-green-400 px-3 py-1.5 rounded-xl border border-green-400/20">
                      {job.relevanceScore}% MATCH
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    {isSocial ? (
                      <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-lg">Social Listing</span>
                    ) : (
                      <span className="text-[9px] font-black text-yellow-400/60 uppercase tracking-widest bg-yellow-400/10 px-2 py-0.5 rounded-lg">{job.sourceId}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 border ${activeFeed === 'social' ? 'bg-blue-500/5 border-blue-500/10 text-blue-500/20' : 'bg-white/5 border-white/10 text-white/5'}`}>
              <i className={`fa-solid ${activeFeed === 'social' ? 'fa-comments' : 'fa-magnifying-glass'} text-3xl`}></i>
            </div>
            <h4 className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">No matches found</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFeed;