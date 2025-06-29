import React, { useState } from 'react';
import { MessageCircle, Trash2, Calendar } from 'lucide-react';
import { ChatSession } from '../App';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export default function ChatSidebar({ 
  sessions, 
  currentSessionId, 
  onSelectSession, 
  onDeleteSession 
}: ChatSidebarProps) {
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getSessionTitle = (session: ChatSession) => {
    if (session.title !== 'New conversation') return session.title;
    if (session.originalFeeling) return `Feeling ${session.originalFeeling.toLowerCase()}`;
    if (session.lastMessage) return truncateText(session.lastMessage, 30);
    return 'New conversation';
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const dateKey = formatDate(session.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar" role="region" aria-label="Conversation history">
      {sessions.length === 0 ? (
        <div className="p-6 text-center text-therapy-gray-500">
          <MessageCircle size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1 opacity-75">Your conversations will appear here</p>
        </div>
      ) : (
        <div className="p-3">
          {Object.entries(groupedSessions).map(([dateGroup, groupSessions]) => (
            <div key={dateGroup} className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-3">
                <Calendar size={14} className="text-therapy-gray-400" />
                <h3 className="text-xs font-medium text-therapy-gray-500 uppercase tracking-wider">
                  {dateGroup}
                </h3>
              </div>
              <div className="space-y-1" role="list" aria-label={`Conversations from ${dateGroup}`}>
                {groupSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`
                      relative group rounded-xl transition-all duration-200 ease-out
                      ${session.id === currentSessionId 
                        ? 'bg-gradient-to-r from-soft-blue-100 to-muted-teal-100 border border-soft-blue-200 shadow-gentle' 
                        : 'hover:bg-therapy-gray-50 hover:shadow-gentle'
                      }
                    `}
                    onMouseEnter={() => setHoveredSession(session.id)}
                    onMouseLeave={() => setHoveredSession(null)}
                    role="listitem"
                  >
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className="w-full text-left p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-blue-300 focus:ring-opacity-50"
                      aria-label={`Open conversation: ${getSessionTitle(session)}`}
                      aria-current={session.id === currentSessionId ? 'page' : undefined}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                          ${session.id === currentSessionId 
                            ? 'bg-gradient-to-br from-soft-blue-400 to-muted-teal-400 text-white shadow-sm' 
                            : 'bg-therapy-gray-200 text-therapy-gray-600'
                          }
                        `}>
                          <MessageCircle size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`
                            text-sm font-medium truncate
                            ${session.id === currentSessionId 
                              ? 'text-soft-blue-700' 
                              : 'text-therapy-gray-700'
                            }
                          `}>
                            {getSessionTitle(session)}
                          </h4>
                          {session.lastMessage && (
                            <p className={`
                              text-xs mt-1 truncate
                              ${session.id === currentSessionId 
                                ? 'text-soft-blue-600' 
                                : 'text-therapy-gray-500'
                              }
                            `}>
                              {truncateText(session.lastMessage, 40)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`
                              text-xs
                              ${session.id === currentSessionId 
                                ? 'text-soft-blue-500' 
                                : 'text-therapy-gray-400'
                              }
                            `}>
                              {session.conversation.length} messages
                            </span>
                            {session.reflectionDepth > 1 && (
                              <span className={`
                                text-xs px-2 py-0.5 rounded-full
                                ${session.id === currentSessionId 
                                  ? 'bg-soft-blue-200 text-soft-blue-700' 
                                  : 'bg-therapy-gray-200 text-therapy-gray-600'
                                }
                              `}>
                                Depth {session.reflectionDepth}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    {/* Delete Button */}
                    {hoveredSession === session.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-therapy-gray-400 hover:text-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                        title="Delete conversation"
                        aria-label={`Delete conversation: ${getSessionTitle(session)}`}
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}