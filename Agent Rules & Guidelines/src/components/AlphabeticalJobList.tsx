import React, { useMemo, useState } from 'react';
import { JobListing, Language } from '../types';

interface AlphabeticalJobListProps {
  jobs: JobListing[];
  onSelectJob: (id: string) => void;
  selectedJobId: string | null;
  lang: Language;
}

const AlphabeticalJobList: React.FC<AlphabeticalJobListProps> = ({ jobs, onSelectJob, selectedJobId, lang }) => {
  const [filter, setFilter] = useState('');

  const sortedJobs = useMemo(() => {
    return [...jobs]
      .filter(j => j.title.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [jobs, filter]);

  // Group by first letter
  const groups = useMemo(() => {
    const map: Record<string, JobListing[]> = {};
    sortedJobs.forEach(job => {
      const firstChar = job.title.charAt(0).toUpperCase();
      if (!map[firstChar]) map[firstChar] = [];
      map[firstChar].push(job);
    });
    return map;
  }, [sortedJobs]);

  const letters = Object.keys(groups).sort();

  return (
    <div className="flex flex-col h-full bg-black">
      <div className="p-4 border-b border-yellow-400/10">
        <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center">
          <i className="fa-solid fa-list-ul mr-3"></i>
          Alphabetical Directory
        </h2>
        <div className="relative">
          <i className="fa-solid fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input 
            type="text" 
            placeholder="Filter list..."
            className="w-full bg-yellow-400/5 border border-yellow-400/20 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-yellow-400 transition"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {letters.length > 0 ? (
          letters.map(letter => (
            <div key={letter} className="space-y-2">
              <div className="sticky top-0 bg-black/80 backdrop-blur py-2 z-10 border-b border-yellow-400/5">
                <span className="text-lg font-bold text-yellow-400 font-mono">{letter}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {groups[letter].map(job => (
                  <div 
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition cursor-pointer ${
                      selectedJobId === job.id 
                        ? 'bg-yellow-400/10 border-yellow-400 text-white' 
                        : 'bg-white/5 border-transparent text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-1 h-1 rounded-full ${job.status === 'new' ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      <div>
                        <div className="text-sm font-bold truncate max-w-[200px] md:max-w-md">{job.title}</div>
                        <div className="text-[10px] uppercase opacity-60 tracking-wider">{job.company}</div>
                      </div>
                    </div>
                    {job.relevanceScore !== undefined && (
                      <div className="text-[10px] font-bold text-yellow-400/60 font-mono">
                        {job.relevanceScore}% MATCH
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-600 italic">
            No matching jobs in index.
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphabeticalJobList;