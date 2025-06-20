import React from 'react';
import { Mail, User, Clock, Tag, X, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { EmailItem } from './EmailList';

// Props for the EmailDetail component
interface EmailDetailProps {
  email: EmailItem | null;
  summaries?: string[];
  onClose?: () => void;
}

/**
 * EmailDetail component
 * Shows the full details of a selected email, including subject, sender, body, category, and summaries.
 */
const EmailDetail: React.FC<EmailDetailProps> = ({ email, summaries, onClose }) => {
  if (!email) {
    return (
      <div className="p-8 text-center text-gray-400 text-lg font-medium bg-gradient-to-br from-white to-blue-50/40 rounded-2xl shadow-lg">
        Select an email to view details.
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl border border-white/60 p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8">
      {onClose && (
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-100 transition-all duration-300 shadow-md"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}
      <div className="mb-4 flex items-center gap-3">
        <Mail size={22} className="text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 truncate flex-1">{email.subject || '(No Subject)'}</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-700">
        <span className="flex items-center gap-2"><User size={16} className="text-blue-400" />{email.sender || 'Unknown sender'}</span>
        <span className="flex items-center gap-2"><Clock size={16} className="text-purple-400" />{email.received_at || 'Unknown date'}</span>
        <span className="flex items-center gap-2"><Tag size={16} className="text-pink-400" />{email.category || 'Uncategorized'}</span>
      </div>
      <div className="bg-white/80 rounded-2xl border border-gray-200/60 shadow-inner p-6 mb-6 max-h-60 overflow-y-auto">
        <div className="text-gray-800 whitespace-pre-line text-base leading-relaxed">
          {email.body || email.snippet}
        </div>
      </div>
      {summaries && summaries.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-2xl p-5 border border-blue-200/40 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={18} className="text-purple-500" />
            <span className="font-semibold text-blue-800">AI Summaries</span>
          </div>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            {summaries.map((summary, idx) => (
              <li key={idx}>{summary}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailDetail; 