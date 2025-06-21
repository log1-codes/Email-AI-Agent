"use client";
import React, { useEffect, useState } from "react";
import { Mail, MailOpen, ChevronLeft, ChevronRight, Sparkles, Trash2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Types
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

interface CategorizedEmail extends EmailItem {
  summary?: string;
}

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

// Email Card Component
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
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="h-full border border-gray-200 bg-white pt-4">
      {/* Fixed-height top bar for action icons */}
      <div className="flex items-center justify-end gap-1 px-4" style={{ minHeight: 40 }}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-black hover:bg-gray-100"
          onClick={() => onMarkAsRead && onMarkAsRead(email)}
          title={email.read ? 'Mark as Unread' : 'Mark as Read'}
        >
          {email.read ? <MailOpen size={14} /> : <Mail size={14} />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-black hover:bg-gray-100"
          onClick={() => onSummarize && onSummarize(email)}
          title="Summarize"
        >
          <Sparkles size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-black hover:bg-gray-100"
          onClick={() => onDelete && onDelete(email)}
          title="Delete"
        >
          <Trash2 size={14} />
        </Button>
      </div>
      <CardHeader className="pb-3 px-4 pt-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm leading-tight mb-2 text-black">
            {email.subject || '(No Subject)'}
          </h3>
          <div className="space-y-1">
            <div className="text-xs text-gray-600 truncate">
              {email.sender || 'Unknown sender'}
            </div>
            <div className="text-xs text-gray-400">
              {formatDate(email.received_at)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-0 px-4 pb-4 min-h-[180px]">
        <div className="space-y-3">
          <div className="text-sm text-gray-700 leading-relaxed">
            {email.snippet}
          </div>
          
          {email.summary && (
            <div className="pt-3 border-t border-gray-200">
              <Badge variant="outline" className="text-xs mb-2 border-gray-300 text-gray-600">
                Summary
              </Badge>
              <p className="text-sm text-gray-700 leading-relaxed">
                {email.summary}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 mt-auto">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100"
              onClick={onSkipPrev}
              disabled={isFirst}
              title="Previous"
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100"
              onClick={onSkipNext}
              disabled={isLast}
              title="Next"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
          
          {email.read && (
            <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
              Read
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Email List Component
const EmailList: React.FC<EmailListProps> = ({ emails, onSelectEmail }) => {
  return (
    <Card className="border border-gray-200 bg-white">
      <CardContent className="p-0">
        {emails.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No emails found.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {emails.map((email) => (
              <Button
                key={email.id}
                variant="ghost"
                className="w-full justify-start p-4 h-auto rounded-none hover:bg-gray-50"
                onClick={() => onSelectEmail && onSelectEmail(email)}
              >
                <div className="text-left w-full space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm text-black truncate flex-1">
                      {email.subject || '(No Subject)'}
                    </h4>
                    {email.read ? (
                      <MailOpen size={12} className="text-gray-400 flex-shrink-0" />
                    ) : (
                      <Mail size={12} className="text-black flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {email.sender || 'Unknown sender'}
                  </div>
                  <div className="text-sm text-gray-700 truncate">
                    {email.snippet}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Category Labels
const CATEGORY_LABELS = [
  { key: "important", label: "Important" },
  { key: "moderate", label: "Moderate" },
  { key: "other", label: "Other" },
];

// Main Dashboard Component
export default function HomePage() {
  const [categorizedEmails, setCategorizedEmails] = useState<Record<string, CategorizedEmail[]>>({ 
    important: [], 
    moderate: [], 
    other: [] 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readMap, setReadMap] = useState<Record<string, Set<string>>>({});
  const [currentIndex, setCurrentIndex] = useState<Record<string, number>>({ 
    important: 0, 
    moderate: 0, 
    other: 0 
  });
  const [refreshCount, setRefreshCount] = useState(0);
  const [buffer, setBuffer] = useState<EmailItem[]>([]);
  const [fetchIndex, setFetchIndex] = useState(0);
  const [noMoreEmails, setNoMoreEmails] = useState(false);

  // Helper to keep total displayed emails at 100
  const fillTo100 = (grouped: Record<string, CategorizedEmail[]>, buffer: EmailItem[], classifyAndAdd: (email: EmailItem) => void) => {
    const total = grouped.important.length + grouped.moderate.length + grouped.other.length;
    if (total >= 100 || buffer.length === 0) return;
    classifyAndAdd(buffer[0]);
    setBuffer(buffer.slice(1));
  };

  // Classify and add a single email to the UI
  const classifyAndAdd = async (email: EmailItem) => {
    let category = "other";
    try {
      const classifyRes = await fetch("http://localhost:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: email.body || email.snippet }),
      });
      const classifyData = await classifyRes.json();
      if (classifyData.category) {
        category = classifyData.category.toLowerCase();
        if (!CATEGORY_LABELS.some((c) => c.key === category)) category = "other";
      }
    } catch {}
    setCategorizedEmails(prev => {
      const updated = { ...prev };
      updated[category] = [...updated[category], { ...email, category }];
      return updated;
    });
    // Automate Notion sync for important emails only
    if (category === "important") {
      // Fire and forget, do not block UI
      fetch("http://localhost:8000/emails/process_one", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: email.id }),
      });
    }
  };

  // Fetch a batch of unread emails
  const fetchBatch = async (batchIndex: number) => {
    try {
      const res = await fetch(`http://localhost:8000/emails?max_results=50&skip=${batchIndex * 50}`);
      const emails: EmailItem[] = await res.json();
      if (!emails || emails.length === 0) {
        setNoMoreEmails(true);
        return;
      }
      setBuffer(prev => [...prev, ...emails]);
      if (batchIndex === 0) {
        let count = 0;
        for (let i = 0; i < emails.length && count < 100; i++) {
          classifyAndAdd(emails[i]);
          count++;
        }
        setBuffer(emails.slice(count));
      }
    } catch (e) {
      setError("Failed to fetch or process emails");
    }
  };

  // On load or refresh, fetch the first batch
  useEffect(() => {
    setLoading(true);
    setError(null);
    setCategorizedEmails({ important: [], moderate: [], other: [] });
    setReadMap({});
    setCurrentIndex({ important: 0, moderate: 0, other: 0 });
    setBuffer([]);
    setFetchIndex(0);
    setNoMoreEmails(false);
    fetchBatch(0).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [refreshCount]);

  // When buffer drops below 20, fetch the next batch in the background
  useEffect(() => {
    if (buffer.length < 20 && !noMoreEmails) {
      setFetchIndex(idx => {
        const nextIdx = idx + 1;
        fetchBatch(nextIdx);
        return nextIdx;
      });
    }
    // eslint-disable-next-line
  }, [buffer, noMoreEmails]);

  // When an email is marked as read or deleted, remove it and fill from buffer
  const removeAndFill = (email: EmailItem, category: string) => {
    setCategorizedEmails(prev => {
      const updated = { ...prev };
      updated[category] = updated[category].filter(e => e.id !== email.id);
      return updated;
    });
    setTimeout(() => {
      setCategorizedEmails(current => {
        fillTo100(current, buffer, classifyAndAdd);
        return current;
      });
    }, 0);
  };

  const handleMarkAsRead = async (email: EmailItem, category: string) => {
    try {
      const res = await fetch("http://localhost:8000/emails/mark_read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: email.id }),
      });
      if (!res.ok) throw new Error("Failed to mark as read in Gmail");
      setReadMap((prev) => {
        const updated = { ...prev };
        if (!updated[category]) updated[category] = new Set();
        updated[category].add(email.id);
        return updated;
      });
      removeAndFill(email, category);
    } catch {
      setError("Failed to mark as read in Gmail");
    }
  };

  const handleDelete = async (email: EmailItem, category: string) => {
    try {
      const res = await fetch("http://localhost:8000/emails/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: email.id }),
      });
      if (!res.ok) throw new Error("Failed to delete email in Gmail");
      removeAndFill(email, category);
    } catch {
      setError("Failed to delete email in Gmail");
    }
  };

  const handleSummarize = async (email: EmailItem, category: string) => {
    try {
      const res = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_text: email.body || email.snippet }),
      });
      const data = await res.json();
      setCategorizedEmails((prev) => {
        const updated = { ...prev };
        updated[category] = updated[category].map((e) =>
          e.id === email.id ? { ...e, summary: data.summary } : e
        );
        return updated;
      });
    } catch {}
  };

  // Skip/arrow navigation
  const handleSkip = (category: string, direction: 'prev' | 'next') => {
    setCurrentIndex((prev) => {
      const max = (categorizedEmails[category] || []).length;
      let idx = prev[category] || 0;
      if (direction === 'prev') idx = Math.max(0, idx - 1);
      if (direction === 'next') idx = Math.min(max - 1, idx + 1);
      return { ...prev, [category]: idx };
    });
  };

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-black mb-4">Email AI Agent Dashboard</h1>
          <div className="flex items-center justify-between">
            <div className="h-px bg-gray-200 flex-1"></div>
            <Button 
              onClick={() => setRefreshCount((c) => c + 1)} 
              variant="outline"
              className="ml-4 border-gray-300 hover:bg-gray-100"
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">{error}</p>
          </div>
        )}

        {/* Email Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {CATEGORY_LABELS.map((cat) => {
            const emails = categorizedEmails[cat.key] || [];
            const idx = currentIndex[cat.key] || 0;
            const emailCount = emails.length;
            
            return (
              <div key={cat.key} className="border border-gray-200 rounded-lg bg-white">
                <div className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-medium text-black">{cat.label}</h2>
                    {emailCount > 0 && (
                      <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                        {idx + 1} of {emailCount}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="p-4 min-h-96">
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-sm text-gray-500">Loading emails...</div>
                    </div>
                  ) : emails.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-sm text-gray-400">No emails in this category</div>
                    </div>
                  ) : (
                    <EmailCard
                      key={emails[idx].id}
                      email={{ ...emails[idx], read: readMap[cat.key]?.has(emails[idx].id) }}
                      onMarkAsRead={(email) => handleMarkAsRead(email, cat.key)}
                      onSummarize={(email) => handleSummarize(email, cat.key)}
                      onDelete={(email) => handleDelete(email, cat.key)}
                      onSkipPrev={() => handleSkip(cat.key, 'prev')}
                      onSkipNext={() => handleSkip(cat.key, 'next')}
                      isFirst={idx === 0}
                      isLast={idx === emails.length - 1}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export { EmailList };