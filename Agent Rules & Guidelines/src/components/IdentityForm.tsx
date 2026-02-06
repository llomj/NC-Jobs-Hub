import React from 'react';
import { UserIdentity, Language } from '../types';
import { UI_LABELS } from '../constants';

interface IdentityFormProps {
  identity: UserIdentity;
  setIdentity: (identity: UserIdentity) => void;
  lang: Language;
}

const IdentityForm: React.FC<IdentityFormProps> = ({ identity, setIdentity, lang }) => {
  const t = UI_LABELS[lang];

  const updateField = (field: keyof UserIdentity, value: any) => {
    setIdentity({ ...identity, [field]: value });
  };

  const addSkill = () => {
    const skill = prompt('Add a skill:');
    if (skill && skill.trim()) {
      updateField('skills', [...identity.skills, skill.trim()]);
    }
  };

  const removeSkill = (index: number) => {
    updateField('skills', identity.skills.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">{t.identityTitle}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Full Name</label>
          <input
            type="text"
            value={identity.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Email</label>
          <input
            type="email"
            value={identity.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Phone</label>
          <input
            type="tel"
            value={identity.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2">Means of Transport</label>
          <input
            type="text"
            value={identity.meansOfTransport}
            onChange={(e) => updateField('meansOfTransport', e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">Experience Summary</label>
        <textarea
          rows={4}
          value={identity.experienceSummary}
          onChange={(e) => updateField('experienceSummary', e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">Skills</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {identity.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="text-yellow-600 hover:text-red-400 transition"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          onClick={addSkill}
          className="bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-lg text-sm hover:bg-yellow-400/30 transition"
        >
          + Add Skill
        </button>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-400 mb-2">Resume Text</label>
        <textarea
          rows={6}
          value={identity.resumeText}
          onChange={(e) => updateField('resumeText', e.target.value)}
          className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-400 resize-none"
        />
      </div>
    </div>
  );
};

export default IdentityForm;