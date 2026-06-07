import React from 'react';
import { Home, Search, PlusCircle, Bell, User, LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface TabItem {
  id: 'feed' | 'discover' | 'upload' | 'notifications' | 'profile';
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  activeTab: 'feed' | 'discover' | 'upload' | 'notifications' | 'profile';
  onTabChange: (tab: 'feed' | 'discover' | 'upload' | 'notifications' | 'profile') => void;
  darkMode: boolean;
  unreadCount?: number;
}

export default function BottomNav({ activeTab, onTabChange, darkMode, unreadCount = 0 }: BottomNavProps) {
  
  const tabs: TabItem[] = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'upload', label: 'Upload', icon: PlusCircle },
    { id: 'notifications', label: 'Inbox', icon: Bell },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className={`h-[68px] px-4 border-t flex items-center justify-around select-none z-30 transition-colors ${
      darkMode 
        ? 'bg-zinc-950 border-zinc-900 text-zinc-100' 
        : 'bg-white border-slate-100 text-slate-800'
    }`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center relative py-1 flex-1 cursor-pointer"
            title={`Navigate to ${tab.label}`}
          >
            {/* Pill Active Highlight Layer (Material 3 standard) */}
            <div className="relative flex items-center justify-center">
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute w-12 h-6.5 rounded-full bg-indigo-505 bg-indigo-500/15 dark:bg-indigo-400/10 z-0"
                />
              )}
              
              <div className="relative z-10 p-1">
                <Icon 
                  size={18} 
                  className={`transition-colors duration-200 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-650'
                  }`} 
                />
              </div>

              {/* Inbox notifications Badge count */}
              {tab.id === 'notifications' && unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white ring-2 ring-white dark:ring-zinc-950 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>

            <span className={`text-[9px] font-medium tracking-wide mt-1 transition-all ${
              isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-400 dark:text-zinc-500'
            }`}>
              {tab.label}
            </span>

          </button>
        );
      })}
    </div>
  );
}
