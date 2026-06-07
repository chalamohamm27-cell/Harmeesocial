import React, { useState } from 'react';
import { Bell, Heart, MessageSquare, UserPlus, Sparkles, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../mockData';
import { User } from '../types';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onUserClick: (user: User) => void;
  onClearAll: () => void;
  darkMode: boolean;
}

export default function NotificationsScreen({ notifications, onUserClick, onClearAll, darkMode }: NotificationsScreenProps) {
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filteredNotifs = unreadOnly ? notifications.filter(n => !n.read) : notifications;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart size={12} fill="currentColor" className="text-red-500" />;
      case 'comment':
        return <MessageSquare size={12} fill="currentColor" className="text-blue-500" />;
      case 'follow':
        return <UserPlus size={12} className="text-green-500" />;
      default:
        return <Bell size={12} className="text-zinc-400" />;
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto bg-inherit p-4`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-1.5">
            <Bell className="text-indigo-500" size={18} />
            Notifications
          </h2>
          <p className="text-[11px] text-zinc-400">Track likes, comments, and new subscribers.</p>
        </div>

        {notifications.length > 0 && (
          <button 
            type="button"
            onClick={onClearAll}
            className="text-[9px] uppercase font-bold tracking-widest text-zinc-400 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter and stats pill toolbar */}
      <div className="flex gap-2 mb-4 justify-start">
        <button
          onClick={() => setUnreadOnly(false)}
          className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide cursor-pointer transition-all ${
            !unreadOnly 
              ? 'bg-zinc-800 text-white dark:bg-zinc-800 border-transparent shadow-sm' 
              : darkMode 
                ? 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-800'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setUnreadOnly(true)}
          className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wide cursor-pointer transition-all flex items-center gap-1.5 ${
            unreadOnly 
              ? 'bg-zinc-800 text-white dark:bg-zinc-800 border-transparent shadow-sm' 
              : darkMode 
                ? 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white' 
                : 'bg-slate-50 border-slate-100 text-slate-500 hover:text-slate-800'
          }`}
        >
          Unread
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>
          )}
        </button>
      </div>

      {/* List items block */}
      <div className="flex-1 space-y-2.5">
        {filteredNotifs.map((item) => (
          <div
            key={item.id}
            onClick={() => onUserClick(item.user)}
            className={`p-3 rounded-2xl border flex gap-3 items-center text-left cursor-pointer hover:scale-[1.005] active:scale-[0.995] transition-all duration-200 ${
              !item.read 
                ? darkMode ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-500/5 border-indigo-200/40'
                : darkMode ? 'bg-zinc-950/20 border-zinc-900' : 'bg-transparent border-slate-100'
            }`}
          >
            {/* Avatar circle with nested small action badge */}
            <div className="relative">
              <img 
                src={item.user.avatar} 
                alt={item.user.displayName} 
                className="w-10 h-10 rounded-full object-cover" 
                referrerPolicy="no-referrer"
              />
              <span className={`absolute -bottom-1.5 -right-1.5 p-1 rounded-full border-2 border-white dark:border-zinc-950 flex items-center justify-center ${
                item.type === 'like' ? 'bg-red-500 text-white' : item.type === 'comment' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'
              }`}>
                {getIcon(item.type)}
              </span>
            </div>

            {/* Notification content */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-baseline gap-1 flex-wrap text-xs">
                <span className="font-bold whitespace-nowrap">@{item.user.username}</span>
                <span className="text-zinc-500">
                  {item.type === 'like' && 'liked your media'}
                  {item.type === 'comment' && 'commented:'}
                  {item.type === 'follow' && 'followed your creative profile'}
                </span>
              </div>
              
              {/* Optional detail target text */}
              {item.targetText && (
                <p className="text-[11px] text-zinc-400 italic mt-0.5 line-clamp-1">
                  "{item.targetText}"
                </p>
              )}

              <span className="text-[9px] font-mono font-medium text-zinc-500 block mt-1">{item.timestamp} ago</span>
            </div>

            {/* Unread dot indicator helper */}
            {!item.read && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 animate-pulse"></span>
            )}

          </div>
        ))}

        {filteredNotifs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3">
            <CheckCircle2 size={32} className="text-zinc-650 dark:text-zinc-700 animate-pulse" />
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-zinc-400 block">All cleared!</span>
              <span className="text-[10px] text-zinc-500 block">No activity alerts in this selection.</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
