import React, { useState } from 'react';
import { Search, Hash, Users, Sparkles, Flame, Play } from 'lucide-react';
import { User, Video } from '../types';
import { MOCK_USERS } from '../mockData';

interface DiscoverScreenProps {
  videos: Video[];
  onUserClick: (user: User) => void;
  onVideoClick: (videoId: string) => void; // callbacks to route directly to video
  darkMode: boolean;
}

export default function DiscoverScreen({ videos, onUserClick, onVideoClick, darkMode }: DiscoverScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Group all available tags in our videos
  const trendingTags = Array.from(new Set(videos.flatMap(v => v.tags)));

  // Filter users based on query
  const filteredUsers = searchQuery.trim() === '' ? [] : MOCK_USERS.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter videos based on active search queries or tags
  const filteredVideos = videos.filter(video => {
    const textMatch = searchQuery.trim() === '' || 
      video.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      video.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.user.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const tagMatch = !selectedTag || video.tags.includes(selectedTag);

    return textMatch && tagMatch;
  });

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto bg-inherit p-4`}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="text-amber-500" size={18} />
          Discover Creators
        </h2>
        <p className="text-[11px] text-zinc-400">Search profiles, trending aesthetics, or hashtags.</p>
      </div>

      {/* Modern Search bar */}
      <div className={`relative flex items-center rounded-2xl border mb-4 ${
        darkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-slate-50 border-slate-200'
      }`}>
        <Search size={15} className="absolute left-3 text-zinc-400" />
        <input
          type="text"
          placeholder="Search creators, keywords, or tags..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedTag(null); // Clear tag filter on typing
          }}
          className="w-full text-xs pl-9 pr-10 py-2.5 outline-none bg-transparent"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-zinc-400 text-[10px] uppercase font-bold tracking-wider hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* User Search Results */}
      {searchQuery.trim() !== '' && filteredUsers.length > 0 && (
        <div className={`p-3 rounded-2xl border mb-4 ${
          darkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
            <Users size={12} /> Matching Profiles ({filteredUsers.length})
          </span>
          <div className="space-y-2.5 max-h-48 overflow-y-auto">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => onUserClick(user)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-zinc-800/10 dark:hover:bg-zinc-800/40 rounded-xl cursor-pointer transition-all"
              >
                <img 
                  src={user.avatar} 
                  alt={user.displayName} 
                  className="w-8 h-8 rounded-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold block leading-none">{user.displayName}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">@{user.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Topics Grid */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2 flex items-center gap-1">
          <Flame size={12} className="text-red-500 animate-pulse" /> Trending Aesthetics
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => {
              setSelectedTag(null);
              setSearchQuery('');
            }}
            className={`px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide border cursor-pointer transition-all ${
              !selectedTag && searchQuery === '' 
                ? 'bg-indigo-600 text-white border-transparent shadow-sm' 
                : darkMode 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            All Trending
          </button>
          
          {trendingTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(tag);
                  setSearchQuery(''); // clear verbal search
                }}
                className={`px-3 py-1.5 rounded-full text-[10px] font-medium tracking-wide border cursor-pointer transition-all flex items-center gap-1 ${
                  isActive 
                    ? 'bg-indigo-600 text-white border-transparent shadow-sm' 
                    : darkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700' 
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <Hash size={10} className="opacity-80" />
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Discover Grid */}
      <div className="flex-1">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
          Discover Feed ({filteredVideos.length})
        </span>

        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredVideos.map((video) => (
              <div 
                key={video.id}
                onClick={() => onVideoClick(video.id)}
                className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/10 dark:border-zinc-800/60 relative group cursor-pointer shadow-sm hover:scale-[1.02] transition-all"
              >
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.caption} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Overlay elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-between p-2.5">
                  <div className="flex justify-end p-0.5">
                    <span className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/90">
                      <Play size={10} fill="white" />
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-white/95 font-medium line-clamp-2 leading-tight">
                      {video.caption}
                    </p>
                    <div className="flex items-center gap-1.5 pt-0.5">
                      <img 
                        src={video.user.avatar} 
                        alt={video.user.username} 
                        className="w-3.5 h-3.5 rounded-full object-cover ring-1 ring-indigo-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[9px] text-zinc-300 font-medium truncate">@{video.user.username}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-zinc-400 text-xs">
            No matching media for the selected parameters.
          </div>
        )}
      </div>

    </div>
  );
}
