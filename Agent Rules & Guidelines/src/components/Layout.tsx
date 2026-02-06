import React, { useState, useMemo } from 'react';
import { Language, JobSource, JobListing, UserIdentity, CustomSource } from '../types';
import { UI_LABELS, SOURCES, COMMUNES, SCRAPABLE_SOURCE_TYPES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  lang: Language;
  setLang: (l: Language) => void;
  activeTab: 'dashboard' | 'identity' | 'saved' | 'logs' | 'alphabetical';
  setActiveTab: (t: 'dashboard' | 'identity' | 'saved' | 'logs' | 'alphabetical') => void;
  enabledSources: string[];
  setEnabledSources: (s: string[]) => void;
  jobs: JobListing[];
  onSelectJob: (id: string) => void;
  identity: UserIdentity;
  setIdentity: (id: UserIdentity) => void;
  onConnectLocation: () => void;
  isLocating: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, lang, setLang, activeTab, setActiveTab, enabledSources, setEnabledSources, jobs, onSelectJob, identity, setIdentity, onConnectLocation, isLocating
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScraperManagerOpen, setIsScraperManagerOpen] = useState(false);
  const [isApiKeyPopoverOpen, setIsApiKeyPopoverOpen] = useState(false);
  
  // Folding States for Mobility
  const [isMobilityExpanded, setIsMobilityExpanded] = useState(false);
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  
  // Folding States for Job Index
  const [isFullIndexExpanded, setIsFullIndexExpanded] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const [newLink, setNewLink] = useState('');
  const [newSourceType, setNewSourceType] = useState<string>(SCRAPABLE_SOURCE_TYPES[0]?.id ?? 'website');
  const [sourceToDelete, setSourceToDelete] = useState<CustomSource | null>(null);

  const t = UI_LABELS[lang];

  const getSourceTypeLabel = (typeId: string) => {
    const row = SCRAPABLE_SOURCE_TYPES.find(s => s.id === typeId);
    return lang === Language.FR ? (row?.labelFr ?? typeId) : (row?.labelEn ?? typeId);
  };

  /** Custom sources grouped by type (Website, then Facebook Workplace), each group sorted A–Z by URL. */
  const customSourcesByType = useMemo(() => {
    const groups: Record<string, CustomSource[]> = {};
    SCRAPABLE_SOURCE_TYPES.forEach((st) => { groups[st.id] = []; });
    identity.customSources.forEach((source) => {
      const key = SCRAPABLE_SOURCE_TYPES.some((st) => st.id === source.type) ? source.type : 'website';
      groups[key].push(source);
    });
    SCRAPABLE_SOURCE_TYPES.forEach((st) => {
      groups[st.id].sort((a, b) => a.url.localeCompare(b.url, undefined, { sensitivity: 'base' }));
    });
    return groups;
  }, [identity.customSources]);

  // Grouped Communes for New Caledonia Regions
  const regionalCommunes = useMemo(() => ({
    'Province Sud': ['Nouméa', 'Dumbéa', 'Mont-Dore', 'Païta', 'Boulouparis', 'La Foa', 'Bourail'],
    'Province Nord': ['Koné', 'Voh', 'Koumac', 'Poindimié', 'Canala'],
    'Province des Îles': ['Lifou', 'Maré', 'Ouvéa']
  }), []);

  const toggleSource = (id: string) => {
    const nextSources = enabledSources.includes(id) 
      ? enabledSources.filter(s => s !== id) 
      : [...enabledSources, id];
    setEnabledSources(nextSources);
  };

  const toggleCommune = (commune: string) => {
    const nextCommunes = identity.preferredCommunes.includes(commune)
      ? identity.preferredCommunes.filter(c => c !== commune)
      : [...identity.preferredCommunes, commune];
    setIdentity({ ...identity, preferredCommunes: nextCommunes });
  };

  const toggleRegion = (e: React.MouseEvent, region: string) => {
    e.stopPropagation();
    setExpandedRegions(prev => 
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  };

  const handleMobilityMasterToggle = () => {
    const nextState = !isMobilityExpanded;
    setIsMobilityExpanded(nextState);
    if (!nextState) {
      setExpandedRegions([]);
    }
  };

  const handleIndexMasterToggle = () => {
    const nextState = !isFullIndexExpanded;
    setIsFullIndexExpanded(nextState);
    if (!nextState) {
      setExpandedCategories([]);
    }
  };

  const toggleCategory = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    setExpandedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const addCustomSource = () => {
    const url = newLink.trim();
    if (!url) return;
    const exists = identity.customSources.some(s => s.url === url && s.type === newSourceType);
    if (!exists) {
      setIdentity({
        ...identity,
        customSources: [...identity.customSources, { type: newSourceType, url }]
      });
    }
    setNewLink('');
  };

  const removeCustomSource = (source: CustomSource) => {
    setIdentity({
      ...identity,
      customSources: identity.customSources.filter(s => !(s.url === source.url && s.type === source.type))
    });
    setSourceToDelete(null);
  };

  const groupedJobs = useMemo(() => {
    const groups: Record<string, JobListing[]> = {};
    jobs.forEach(job => {
      const cat = job.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(job);
    });
    
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => a.title.localeCompare(b.title));
    });

    return groups;
  }, [jobs]);

  const sortedCategories = useMemo(() => {
    return Object.keys(groupedJobs).sort();
  }, [groupedJobs]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black font-sans text-white">
      {/* Scraper Links Manager Modal */}
      {isScraperManagerOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-yellow-400/20 p-8 rounded-[2rem] w-full max-w-lg shadow-[0_0_50px_rgba(251,191,36,0.1)] animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center">
                <i className="fa-solid fa-link text-yellow-400 mr-3"></i>
                {t.customSources}
              </h3>
              <button onClick={() => setIsScraperManagerOpen(false)} className="text-gray-500 hover:text-white transition">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-black tracking-widest text-gray-500">{t.sourceTypeLabel}</label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-all"
                >
                  {SCRAPABLE_SOURCE_TYPES.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#0a0a0a] text-white">
                      {lang === Language.FR ? st.labelFr : st.labelEn}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <input
                  type="url"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSource()}
                  placeholder={t.linkPlaceholder}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400/50 transition-all"
                />
                <button
                  onClick={addCustomSource}
                  className="bg-yellow-400 text-black px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-yellow-500 transition shadow-lg active:scale-95"
                >
                  {t.addLink}
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {identity.customSources.length > 0 ? (
                  SCRAPABLE_SOURCE_TYPES.map((st) => {
                    const sources = customSourcesByType[st.id] ?? [];
                    if (sources.length === 0) return null;
                    return (
                      <div key={st.id} className="space-y-2">
                        <h4 className="text-[10px] uppercase font-black tracking-widest text-yellow-400/80 sticky top-0 bg-[#0a0a0a] py-1">
                          {lang === Language.FR ? st.labelFr : st.labelEn}
                        </h4>
                        {sources.map((source) => (
                          <div key={`${source.type}-${source.url}`} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                            <div className="flex-1 min-w-0 mr-4">
                              <span className="text-xs text-gray-400 font-medium block break-all cursor-text">{source.url}</span>
                            </div>
                            <button onClick={() => setSourceToDelete(source)} className="text-red-500/50 hover:text-red-500 transition shrink-0" title={t.confirmDelete} aria-label={t.confirmDelete}>
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-700">
                    <i className="fa-solid fa-folder-open text-2xl mb-2 opacity-20"></i>
                    <p className="text-[10px] uppercase font-black tracking-widest">No custom sources saved</p>
                  </div>
                )}
              </div>
            </div>
            
            <p className="mt-8 text-[10px] text-gray-600 font-bold text-center leading-relaxed">
              These links tell OpenClaw or your scraper where to pull job data from; saved links are exposed via the OpenClaw feed.
            </p>
          </div>
        </div>
      )}

      {/* Delete source confirmation */}
      {sourceToDelete && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl" role="alertdialog" aria-labelledby="delete-source-title" aria-describedby="delete-source-desc">
          <div className="bg-[#0a0a0a] border border-yellow-400/20 p-8 rounded-[2rem] w-full max-w-md shadow-[0_0_50px_rgba(251,191,36,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-triangle-exclamation text-red-400 text-xl"></i>
              </div>
              <h4 id="delete-source-title" className="text-lg font-black uppercase tracking-tight text-white">
                {t.deleteSourceConfirmTitle}
              </h4>
            </div>
            <p id="delete-source-desc" className="text-sm text-gray-400 mb-2">
              {t.deleteSourceConfirmMessage}
            </p>
            <p className="text-xs text-gray-500 truncate mb-6" title={sourceToDelete.url}>
              {getSourceTypeLabel(sourceToDelete.type)} — {sourceToDelete.url}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSourceToDelete(null)}
                className="px-5 py-2.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-white/20 text-gray-400 hover:bg-white/5 transition"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => removeCustomSource(sourceToDelete)}
                className="px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-red-500/90 text-white hover:bg-red-500 transition"
              >
                {t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="h-16 border-b border-yellow-400/20 flex items-center justify-between px-6 bg-black/80 backdrop-blur-xl z-[100]">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSettingsOpen(false); }}
            className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl flex items-center justify-center hover:bg-yellow-400/20 transition-all shadow-lg active:scale-95"
          >
            <i className="fa-solid fa-anchor text-yellow-400"></i>
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-[0.3em] text-yellow-400 leading-none">NC JOBS</h1>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1">Nouvelle-Calédonie</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {['dashboard', 'identity', 'saved'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-gray-500 hover:text-white'}`}
            >
              {(t as any)[tab]}
            </button>
          ))}
          <div className="flex items-center space-x-2 ml-4 border-l border-white/10 pl-4">
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-gray-500 hover:text-white'}`}
            >
              {t.logs}
            </button>
            <div className="flex items-center space-x-1">
              <button 
                onClick={onConnectLocation}
                disabled={isLocating}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLocating ? 'bg-yellow-400/10 text-yellow-400 animate-pulse' : 'text-gray-600 hover:text-yellow-400 hover:bg-white/5'}`}
                title="Connect Device Location"
              >
                <i className="fa-solid fa-location-crosshairs text-xs"></i>
              </button>
              <button 
                onClick={() => setIsScraperManagerOpen(true)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-blue-400 hover:bg-white/5 transition-all"
                title="Manage Scraper Links"
              >
                <i className="fa-solid fa-link text-xs"></i>
              </button>
              <button 
                onClick={() => setIsApiKeyPopoverOpen(true)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${identity.openClawApiKey ? 'text-yellow-400/80 hover:text-yellow-400' : 'text-gray-600 hover:text-yellow-400'} hover:bg-white/5`}
                title={t.openClawApiKeyLabel}
              >
                <i className="fa-solid fa-key text-xs"></i>
              </button>
            </div>
          </div>
        </nav>

        {/* OpenClaw / Scraper API key popover */}
        {isApiKeyPopoverOpen && (
          <>
            <div className="fixed inset-0 z-[999]" onClick={() => setIsApiKeyPopoverOpen(false)} aria-hidden="true" />
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] w-full max-w-sm p-4">
              <div className="bg-[#0a0a0a] border border-yellow-400/20 rounded-[2rem] p-6 shadow-[0_0_50px_rgba(251,191,36,0.1)] animate-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black uppercase tracking-tighter flex items-center text-white">
                    <i className="fa-solid fa-key text-yellow-400 mr-2"></i>
                    {t.openClawApiKeyLabel}
                  </h3>
                  <button onClick={() => setIsApiKeyPopoverOpen(false)} className="text-gray-500 hover:text-white transition">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
                <input
                  type="password"
                  value={identity.openClawApiKey ?? ''}
                  onChange={(e) => setIdentity({ ...identity, openClawApiKey: e.target.value })}
                  placeholder={t.openClawApiKeyPlaceholder}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 transition-all"
                  autoComplete="off"
                />
                <p className="mt-3 text-[10px] text-gray-500 font-medium leading-relaxed">
                  {t.openClawApiKeyHint}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all border ${isSettingsOpen ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'bg-white/5 border-white/10 text-gray-500 hover:text-yellow-400'}`}
            >
              <i className="fa-solid fa-gear"></i>
            </button>

            {isSettingsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSettingsOpen(false)}></div>
                <div className="absolute right-0 mt-4 w-80 bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-3xl">
                  <div className="space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar pr-1">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Settings & Index</span>
                      <i className="fa-solid fa-gear text-gray-700"></i>
                    </div>

                    {/* FOLDING LOCATION & MOBILITY SECTION */}
                    <div>
                      <button 
                        onClick={handleMobilityMasterToggle}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isMobilityExpanded ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <i className="fa-solid fa-map-location-dot text-xs"></i>
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.mobilitySettings}</span>
                        </div>
                        <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-300 ${isMobilityExpanded ? 'rotate-180' : ''}`}></i>
                      </button>

                      {isMobilityExpanded && (
                        <div className="mt-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                          {Object.entries(regionalCommunes).map(([region, communes]) => {
                            const isExpanded = expandedRegions.includes(region);
                            return (
                              <div key={region} className="rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                                <button 
                                  onClick={(e) => toggleRegion(e, region)}
                                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition group text-left"
                                >
                                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isExpanded ? 'text-yellow-400' : 'text-gray-500 group-hover:text-white'}`}>
                                    {region}
                                  </span>
                                  <i className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'} text-[8px] text-gray-700`}></i>
                                </button>
                                
                                {isExpanded && (
                                  <div className="bg-black/40 border-t border-white/5 p-3 flex flex-col space-y-2 animate-in fade-in duration-200">
                                    {communes.map(commune => (
                                      <button 
                                        key={commune}
                                        onClick={() => toggleCommune(commune)}
                                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${identity.preferredCommunes.includes(commune) ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.1)]' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                                      >
                                        <span className="text-[9px] font-black uppercase tracking-widest">{commune}</span>
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${identity.preferredCommunes.includes(commune) ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'border-white/20'}`}>
                                          {identity.preferredCommunes.includes(commune) && <i className="fa-solid fa-check text-black text-[8px]"></i>}
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Full Job Index Master Folding */}
                    <div>
                      <button 
                        onClick={handleIndexMasterToggle}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${isFullIndexExpanded ? 'bg-yellow-400/10 border-yellow-400/40 text-yellow-400' : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center space-x-3">
                          <i className="fa-solid fa-list-check text-xs"></i>
                          <span className="text-[10px] font-black uppercase tracking-widest">Full Job Index</span>
                        </div>
                        <i className={`fa-solid fa-chevron-down text-[8px] transition-transform duration-300 ${isFullIndexExpanded ? 'rotate-180' : ''}`}></i>
                      </button>

                      {isFullIndexExpanded && (
                        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                          {sortedCategories.map(category => {
                            const isExpanded = expandedCategories.includes(category);
                            return (
                              <div key={category} className="rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                                <button onClick={(e) => toggleCategory(e, category)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition group text-left">
                                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isExpanded ? 'text-yellow-400' : 'text-gray-500 group-hover:text-white'}`}>{category}</span>
                                  <i className={`fa-solid ${isExpanded ? 'fa-minus' : 'fa-plus'} text-[8px] text-gray-700`}></i>
                                </button>
                                {isExpanded && (
                                  <div className="bg-black/40 border-t border-white/5 p-2 flex flex-col space-y-1 animate-in fade-in duration-200">
                                    {groupedJobs[category].map(job => (
                                      <button key={job.id} onClick={() => { onSelectJob(job.id); setIsSettingsOpen(false); }} className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition flex items-center space-x-3 group">
                                        <div className={`w-1 h-1 rounded-full ${job.sourceId === 'fb-workplace' ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-yellow-400 shadow-[0_0_8px_#fbbf24]'}`}></div>
                                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-white truncate">{job.title}</span>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Display Language</div>
                      <div className="flex p-1 bg-black rounded-xl border border-white/5">
                        <button onClick={() => setLang(Language.FR)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === Language.FR ? 'bg-yellow-400 text-black font-bold' : 'text-gray-600 hover:text-white'}`}>Français</button>
                        <button onClick={() => setLang(Language.EN)} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${lang === Language.EN ? 'bg-yellow-400 text-black font-bold' : 'text-gray-600 hover:text-white'}`}>English</button>
                      </div>
                      <button className="w-full p-4 rounded-2xl bg-red-600/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                        <i className="fa-solid fa-power-off mr-2"></i>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="hidden lg:flex w-72 border-r border-white/10 flex-col bg-black p-8 overflow-y-auto scrollbar-hide">
          <section className="mb-10">
            <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-6">Portal Filters</h3>
            <div className="space-y-4">
              {SOURCES.map(source => (
                <label key={source.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${enabledSources.includes(source.id) ? (source.id === 'fb-workplace' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-yellow-400 shadow-[0_0_10px_#fbbf24]') : 'bg-gray-800'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-widest transition-all ${enabledSources.includes(source.id) ? 'text-white' : 'text-gray-600 group-hover:text-gray-400'}`}>
                      {source.name}
                    </span>
                  </div>
                  <input type="checkbox" checked={enabledSources.includes(source.id)} onChange={() => toggleSource(source.id)} className="peer appearance-none w-4 h-4 rounded-lg bg-white/5 border border-white/10 checked:bg-white/20 transition-all cursor-pointer"/>
                </label>
              ))}
            </div>
          </section>

          <section className="mt-auto">
            <div className="p-6 rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[8px] font-black text-yellow-400 uppercase tracking-widest">OpenClaw Engine</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
                Centralizing {jobs.length} listings from New Caledonia today.
              </p>
            </div>
          </section>
        </aside>

        <main className="flex-1 relative overflow-hidden">
          {children}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden h-20 border-t border-white/5 flex items-center justify-around bg-black/90 backdrop-blur-2xl px-4 pb-4">
        {[
          { id: 'dashboard', icon: 'fa-table-columns', label: t.dashboard },
          { id: 'alphabetical', icon: 'fa-list-ul', label: 'List' },
          { id: 'identity', icon: 'fa-id-card', label: t.identity },
          { id: 'saved', icon: 'fa-bookmark', label: t.saved },
          { id: 'logs', icon: 'fa-clock-rotate-left', label: 'Logs' }
        ].map(item => (
          <div key={item.id} className="relative flex flex-col items-center">
            <button 
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center space-y-1.5 transition-all ${activeTab === item.id ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}
            >
              <i className={`fa-solid ${item.icon} text-lg ${activeTab === item.id ? 'drop-shadow-[0_0_8px_#fbbf24]' : ''}`}></i>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
            {item.id === 'logs' && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex space-x-2">
                <button 
                  onClick={onConnectLocation}
                  disabled={isLocating}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${isLocating ? 'bg-yellow-400 text-black border-yellow-400 animate-pulse' : 'bg-black/80 border-white/10 text-gray-500'}`}
                >
                  <i className="fa-solid fa-location-crosshairs text-[10px]"></i>
                </button>
                <button 
                  onClick={() => setIsScraperManagerOpen(true)}
                  className="w-7 h-7 rounded-full flex items-center justify-center border bg-black/80 border-white/10 text-gray-500 hover:text-blue-400 transition-all"
                >
                  <i className="fa-solid fa-link text-[10px]"></i>
                </button>
                <button 
                  onClick={() => setIsApiKeyPopoverOpen(true)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border bg-black/80 border-white/10 transition-all ${identity.openClawApiKey ? 'text-yellow-400/80' : 'text-gray-500 hover:text-yellow-400'}`}
                  title={t.openClawApiKeyLabel}
                >
                  <i className="fa-solid fa-key text-[10px]"></i>
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Layout;