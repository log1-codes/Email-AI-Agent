import React, { useState } from 'react';
import { Mail, MailOpen, ChevronLeft, ChevronRight, Sparkles, Trash2, Clock, User, Eye, EyeOff } from 'lucide-react';

// Type for a single email item
export interface EmailItem {
  id: string;
  subject: string;
  sender?: string;
  snippet: string;
  body?: string;
  received_at?: string;
  category?: string;
  summary?: string;
  read?: boolean;
}

// Props for the EmailList component
interface EmailListProps {
  emails: EmailItem[];
  onSelectEmail?: (email: EmailItem) => void;
}

interface EmailCardProps {
  email: EmailItem;
  onMarkAsRead?: (email: EmailItem) => void;
  onSummarize?: (email: EmailItem) => void;
  onDelete?: (email: EmailItem) => void;
  onSkipPrev?: () => void;
  onSkipNext?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  onMarkAsRead,
  onSummarize,
  onDelete,
  onSkipPrev,
  onSkipNext,
  isFirst,
  isLast,
}) => {
  const [showSummary, setShowSummary] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative bg-gradient-to-br from-white via-gray-50 to-blue-50/30 rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative p-8 flex flex-col gap-6">
        {/* Header with actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2 group-hover:text-blue-700 transition-colors duration-300">
              {email.subject || '(No Subject)'}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-500" />
                <span className="font-medium">{email.sender || 'Unknown sender'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-purple-500" />
                <span>{email.received_at || 'Unknown date'}</span>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                email.read 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
              title={email.read ? 'Mark as Unread' : 'Mark as Read'}
              onClick={() => onMarkAsRead && onMarkAsRead(email)}
            >
              {email.read ? <MailOpen size={18} /> : <Mail size={18} />}
            </button>
            
            <button
              className="p-3 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-300 hover:scale-110 hover:rotate-12"
              title="Summarize with AI"
              onClick={() => onSummarize && onSummarize(email)}
            >
              <Sparkles size={18} />
            </button>
            
            <button
              className="p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300 hover:scale-110"
              title="Delete Email"
              onClick={() => onDelete && onDelete(email)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Email snippet */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
          <p className="text-gray-700 leading-relaxed line-clamp-3">
            {email.snippet}
          </p>
        </div>

        {/* Summary section */}
        <div className="space-y-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={() => setShowSummary(!showSummary)}
          >
            {showSummary ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSummary ? 'Hide Summary' : 'AI Summary'}
          </button>
          
          {showSummary && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200/50 transform transition-all duration-500 animate-in slide-in-from-top">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-800 mb-2">AI Summary</h4>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    {email.summary || 'No summary available yet. Click the sparkle icon to generate an AI summary of this email.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation controls */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            className={`p-3 rounded-full transition-all duration-300 ${
              isFirst
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:scale-110 shadow-lg'
            }`}
            onClick={onSkipPrev}
            disabled={isFirst}
            title="Previous Email"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button
            className={`p-3 rounded-full transition-all duration-300 ${
              isLast
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:scale-110 shadow-lg'
            }`}
            onClick={onSkipNext}
            disabled={isLast}
            title="Next Email"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Read status indicator */}
      {!email.read && (
        <div className="absolute top-4 left-4 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full shadow-lg animate-pulse" />
      )}
    </div>
  );
};

/**
 * Modern EmailList component with card-based design
 */
const EmailList: React.FC<EmailListProps> = ({ emails, onSelectEmail }) => {
  const [hoveredEmail, setHoveredEmail] = useState<string | null>(null);

  return (
    <div className="space-y-4 p-4">
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
            <Mail size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No emails found</h3>
          <p className="text-gray-500">Your inbox is empty or no emails match your current filter.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {emails.map((email, index) => (
            <div
              key={email.id}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredEmail(email.id)}
              onMouseLeave={() => setHoveredEmail(null)}
              onClick={() => onSelectEmail && onSelectEmail(email)}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:border-blue-300/50 overflow-hidden">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    {/* Read status indicator */}
                    <div className="flex-shrink-0 pt-1">
                      {email.read ? (
                        <MailOpen size={20} className="text-blue-500" />
                      ) : (
                        <div className="relative">
                          <Mail size={20} className="text-orange-500" />
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-400 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Subject */}
                      <h4 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300 truncate">
                        {email.subject || '(No Subject)'}
                      </h4>
                      
                      {/* Sender and date */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-blue-500" />
                          <span className="font-medium truncate">
                            {email.sender || 'Unknown sender'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-purple-500" />
                          <span className="whitespace-nowrap">
                            {email.received_at || 'Unknown date'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Snippet */}
                      <p className="text-gray-700 line-clamp-2 leading-relaxed">
                        {email.snippet}
                      </p>
                    </div>
                    
                    {/* Hover actions */}
                    <div className={`flex items-center gap-2 transition-all duration-300 ${
                      hoveredEmail === email.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}>
                      <button
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 hover:scale-110"
                        title="View Email"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEmail && onSelectEmail(email);
                        }}
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Bottom accent line */}
                <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmailList;