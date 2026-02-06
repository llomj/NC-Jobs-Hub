import React from 'react';
import { ApplicationLog, JobListing, Language, JobStatus } from '../types';
import { UI_LABELS } from '../constants';

interface TrackingLogsProps {
  logs: ApplicationLog[];
  jobs: JobListing[];
  lang: Language;
}

const TrackingLogs: React.FC<TrackingLogsProps> = ({ logs, jobs, lang }) => {
  const t = UI_LABELS[lang];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-yellow-400">{t.logs}</h2>
        <button className="text-xs font-bold border border-yellow-400/30 px-3 py-1 rounded hover:bg-yellow-400 hover:text-black transition">
          <i className="fa-solid fa-file-export mr-2"></i>
          Export CSV
        </button>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map(log => {
            const job = jobs.find(j => j.id === log.jobId);
            return (
              <div key={log.id} className="bg-[#0f0f0f] border border-yellow-400/10 p-4 rounded-xl flex items-start justify-between group hover:border-yellow-400/30 transition">
                <div className="flex items-start space-x-4">
                  <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    log.status === JobStatus.APPLIED ? 'bg-blue-400/20 text-blue-400' :
                    log.status === JobStatus.INTERVIEW ? 'bg-purple-400/20 text-purple-400' :
                    log.status === JobStatus.SAVED ? 'bg-yellow-400/20 text-yellow-400' :
                    log.status === JobStatus.REJECTED ? 'bg-red-400/20 text-red-400' : 'bg-gray-400/20 text-gray-400'
                  }`}>
                    <i className={
                      log.status === JobStatus.APPLIED ? 'fa-solid fa-paper-plane' :
                      log.status === JobStatus.INTERVIEW ? 'fa-solid fa-comments' :
                      log.status === JobStatus.SAVED ? 'fa-solid fa-bookmark' :
                      log.status === JobStatus.REJECTED ? 'fa-solid fa-xmark' : 'fa-solid fa-clock'
                    }></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-yellow-400 transition">{job?.title || 'Unknown Job'}</h4>
                    <p className="text-sm text-yellow-400/80 mb-1">{job?.company}</p>
                    <p className="text-xs text-gray-500 italic">"{log.notes}"</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-gray-600 font-mono mb-1 uppercase tracking-tighter">
                    {new Date(log.timestamp).toLocaleString()}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border ${
                    log.status === JobStatus.APPLIED ? 'border-blue-400/30 text-blue-400' :
                    log.status === JobStatus.SAVED ? 'border-yellow-400/30 text-yellow-400' :
                    'border-gray-400/30 text-gray-400'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 text-gray-600">
            <i className="fa-solid fa-clipboard-question text-4xl mb-2 opacity-20"></i>
            <p>No activity logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingLogs;