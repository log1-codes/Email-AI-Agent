import React from 'react';
import { Sparkles, Tag, Save } from 'lucide-react';

interface EmailActionsProps {
  onSummarize?: () => void;
  onClassify?: () => void;
  onSave?: () => void;
  loading?: boolean;
}

/**
 * EmailActions component
 * Renders action buttons for summarizing, classifying, and saving an email.
 */
const EmailActions: React.FC<EmailActionsProps> = ({ onSummarize, onClassify, onSave, loading }) => {
  return (
    <div className="flex gap-4 mt-4 justify-center">
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-md hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 disabled:opacity-50"
        onClick={onSummarize}
        disabled={loading}
      >
        <Sparkles size={16} /> Summarize
      </button>
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow-md hover:from-green-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 disabled:opacity-50"
        onClick={onClassify}
        disabled={loading}
      >
        <Tag size={16} /> Classify
      </button>
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-700 text-white font-semibold shadow-md hover:from-gray-600 hover:to-gray-800 transition-all duration-300 hover:scale-105 disabled:opacity-50"
        onClick={onSave}
        disabled={loading}
      >
        <Save size={16} /> Save
      </button>
    </div>
  );
};

export default EmailActions; 