import React, { useState } from 'react';
import { Settings, Grid, Edit3, Save, MapPin, Link as LinkIcon, User as UserIcon, Plus, LogOut } from 'lucide-react';
import { User, Video } from '../types';
import { MOCK_AVATARS } from '../firebase';

interface ProfileViewProps {
  user: User;
  isCurrentUser: boolean;
  onFollowToggle?: () => void;
  onUpdateCurrentUserProfile?: (updatedData: { displayName: string; bio: string; avatar: string }) => void;
  darkMode: boolean;
  onLogout?: () => void;
  userVideos?: Video[];
  onVideoClick?: (videoId: string) => void;
}

export default function ProfileView({ 
  user, 
  isCurrentUser, 
  onFollowToggle, 
  onUpdateCurrentUserProfile, 
  darkMode,
  onLogout,
  userVideos = [],
  onVideoClick
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(user.displayName);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedAvatar, setEditedAvatar] = useState(user.avatar);

  // Pre-made mock photos to fill the grid based on user profile theme
  const getGridPhotos = (username: string) => {
    if (userVideos && userVideos.length > 0) {
      return userVideos.map(v => v.thumbnailUrl);
    }
    if (username.includes('sarah')) {
      return [
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop"
      ];
    }
    if (username.includes('alex')) {
      return [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop",
        "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&h=300&fit=crop"
      ];
    }
    return [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop"
    ];
  };

  const handleProfileSave = () => {
    if (onUpdateCurrentUserProfile) {
      onUpdateCurrentUserProfile({
        displayName: editedDisplayName,
        bio: editedBio,
        avatar: editedAvatar
      });
    }
    setIsEditing(false);
  };

  const gridPhotos = getGridPhotos(user.username);

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto bg-inherit`}>
      
      {/* Upper Cover Header Banner */}
      <div className="relative h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700">
        {isCurrentUser && (
          <div className="absolute top-3 right-4 flex items-center gap-2">
            {onLogout && (
              <button 
                onClick={onLogout}
                className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-red-300 hover:text-white hover:bg-white/30 cursor-pointer shadow-sm transition-all"
                title="Log out"
              >
                <LogOut size={15} />
              </button>
            )}
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 cursor-pointer shadow-sm transition-all"
              title="Edit profile settings"
            >
              <Settings size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Profile Info Details section */}
      <div className="px-5 pb-5 relative -mt-10">
        
        {/* Profile Avatar dynamic circles */}
        <div className="flex justify-between items-end mb-3.5">
          <div className="w-20 h-20 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-800 overflow-hidden shadow-md select-none">
            <img 
              src={user.avatar} 
              alt={user.displayName} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Action buttons (Follow or Edit profile toggles) */}
          <div className="flex gap-2">
            {isCurrentUser ? (
              <button
                onClick={() => {
                  if (isEditing) {
                    handleProfileSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-2xl cursor-pointer flex items-center gap-1.5 transition-all ${
                  darkMode 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-750' 
                    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Edit3 size={12} />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={onFollowToggle}
                className={`px-5 py-2 text-xs font-bold rounded-2xl cursor-pointer shadow-sm flex items-center gap-1 transition-all ${
                  user.isFollowing 
                    ? 'bg-zinc-800 text-white dark:bg-zinc-800/80 hover:bg-red-600' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Editing Modal/Form if true */}
        {isEditing ? (
          <div className={`p-4 rounded-3xl border space-y-3.5 ${
            darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-205'
          }`}>
            <h4 className="text-xs font-bold tracking-tight text-indigo-500">Edit Profile Parameters</h4>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wide text-zinc-400 font-medium">Display Name</label>
              <input
                type="text"
                value={editedDisplayName}
                onChange={(e) => setEditedDisplayName(e.target.value)}
                className={`w-full p-2.5 text-xs rounded-xl outline-none border transition-all ${
                  darkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-indigo-500 text-white' 
                    : 'bg-white border-slate-200 focus:border-indigo-600 text-slate-800'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wide text-zinc-400 font-medium">Interactive Bio</label>
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                rows={2}
                className={`w-full p-2.5 text-xs rounded-xl outline-none border transition-all ${
                  darkMode 
                    ? 'bg-zinc-900 border-zinc-800 focus:border-indigo-500 text-white' 
                    : 'bg-white border-slate-200 focus:border-indigo-600 text-slate-800'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wide text-zinc-400 font-medium font-sans">Choose Avatar Grid</label>
              <div className="flex gap-2 py-1 justify-between">
                {MOCK_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setEditedAvatar(url)}
                    className={`relative w-8 h-8 rounded-full overflow-hidden transition-all duration-200 ring-offset-2 ring-indigo-500 cursor-pointer ${
                      editedAvatar === url ? 'ring-2 scale-110 opacity-100' : 'opacity-50 scale-90'
                    }`}
                  >
                    <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-[11px] rounded-xl font-medium bg-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 cursor-pointer hover:opacity-85"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSave}
                className="px-4 py-1.5 text-[11px] font-bold rounded-xl bg-indigo-600 text-white cursor-pointer hover:opacity-90 flex items-center gap-1"
              >
                <Save size={11} />
                Save Changes
              </button>
            </div>

          </div>
        ) : (
          /* REGULAR PROFILE TEXT DETAILS */
          <div className="space-y-1.5 text-left">
            <div>
              <h3 className="text-base font-bold font-sans tracking-tight">
                {user.displayName}
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                @{user.username}
              </span>
            </div>

            <p className="text-xs text-zinc-650 dark:text-zinc-300 leading-relaxed pr-2">
              {user.bio}
            </p>

            <div className="flex gap-4 items-center pt-1.5 text-[11px] font-sans text-zinc-400">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-indigo-500" /> Tokyo, JP
              </span>
              <span className="flex items-center gap-1 select-all cursor-pointer hover:text-indigo-400">
                <LinkIcon size={11} className="text-indigo-500" /> harmee.social/{user.username}
              </span>
            </div>
          </div>
        )}

        {/* Stats segment with follow counts */}
        <div className="flex justify-around py-4 mt-4 border-t border-b border-zinc-200 dark:border-zinc-800/60 select-none">
          <div className="text-center">
            <span className="block text-sm font-bold font-mono tracking-tight">{user.postsCount}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans font-medium">Posts</span>
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold font-mono tracking-tight">
              {new Intl.NumberFormat('en', { notation: 'compact' }).format(user.followersCount)}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans font-medium">Followers</span>
          </div>
          <div className="text-center">
            <span className="block text-sm font-bold font-mono tracking-tight">
              {new Intl.NumberFormat('en', { notation: 'compact' }).format(user.followingCount)}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-sans font-medium">Following</span>
          </div>
        </div>

        {/* Grid navigation options headers */}
        <div className="flex items-center justify-start gap-2 mt-4.5 mb-3 px-1">
          <Grid size={15} className="text-indigo-500" />
          <span className="text-xs font-bold tracking-tight uppercase">Creatives & Media</span>
        </div>

        {/* Photos Grid rendering mock assets with elegant cover effect */}
        <div className="grid grid-cols-2 gap-2.5">
          {userVideos && userVideos.length > 0 ? (
            userVideos.map((video) => (
              <div 
                key={video.id}
                onClick={() => onVideoClick && onVideoClick(video.id)}
                className="aspect-square rounded-2xl overflow-hidden bg-zinc-800 hover:scale-[1.02] hover:shadow-md transition-all group relative cursor-pointer"
              >
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.caption} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[9px] font-mono font-medium text-white/95 tracking-wide">PLAY REEL</span>
                </div>
              </div>
            ))
          ) : (
            gridPhotos.map((url, idx) => (
              <div 
                key={idx} 
                className="aspect-square rounded-2xl overflow-hidden bg-zinc-800 hover:scale-[1.02] hover:shadow-md transition-all group relative cursor-pointer"
              >
                <img 
                  src={url} 
                  alt="Post asset grid" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[9px] font-mono font-medium text-white/95 tracking-wide">VIEW GALLERY</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
