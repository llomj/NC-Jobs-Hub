import React, { useState, useEffect } from 'react';
import { JobListing, UserIdentity, Language } from '../types';
import { UI_LABELS } from '../constants';
import { draftApplicationEmail } from '../services/geminiService';

interface EmailComposerProps {
  job: JobListing;
  identity: UserIdentity;
  lang: Language;
  onSent: () => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ job, identity, lang, onSent }) => {
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const t = UI_LABELS[lang];

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      const content = await draftApplicationEmail(job, identity, lang);
      setSubject(`Application for ${job.title} - ${identity.fullName}`);
      setBody(content);
      setLoading(false);
    };
    generate();
  }, [job, identity, lang]);

  const handleSend = () => {
    // In a real PWA, this might use a backend API or a mailto link
    const mailtoLink = `mailto:${job.contactEmail || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    onSent();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-xl font-bold text-yellow-400 mb-1">{t.emailCompose}</h3>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Powered by Gemini Pro</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-gray-400">Gemini is drafting your application...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1 block">To</label>
            <div className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm text-gray-300">
              {job.contactEmail || 'No direct email available (Source apply only)'}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-1 block">Subject</label>
            <input 
              type="text" 
              className="w-full bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-3 text-sm focus:outline-none focus:border-yellow-400"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-1 block">Body</label>
            <textarea 
              rows={12}
              className="w-full bg-yellow-400/5 border border-yellow-400/20 rounded-lg p-4 text-sm focus:outline-none focus:border-yellow-400 resize-none font-sans"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>

          <div className="pt-4 flex space-x-4">
            <button 
              onClick={handleSend}
              className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-500 transition flex items-center justify-center"
            >
              <i className="fa-solid fa-paper-plane mr-2"></i>
              {t.sendEmail}
            </button>
            <button 
              onClick={() => {}} 
              className="p-3 border border-yellow-400/20 rounded-xl hover:bg-white/5 transition text-gray-400"
              title="Save Draft"
            >
              <i className="fa-solid fa-floppy-disk"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailComposer;