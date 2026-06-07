import React, { useState } from 'react';
import { Upload, Film, FileText, CheckCircle, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { Video, User } from '../types';

interface UploadScreenProps {
  currentUser: any;
  onAddVideo: (newVideo: Omit<Video, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'isLiked' | 'isShared' | 'comments'> & { videoUrl: string; thumbnailUrl: string }) => void;
  onUploadSuccess: () => void;
  darkMode: boolean;
}

// Preset high-quality viral stock videos for simulator
const VIDEO_PRESETS = [
  {
    title: 'Neon Skateboarder',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-skater-doing-tricks-under-neon-lights-40011-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1564982743470-47edd9986d41?w=500&q=80',
    tags: ['skater', 'neonlights', 'streetvibes', 'nightlife']
  },
  {
    title: 'Cinematic Mountain Peak Ride',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-cyclist-riding-on-a-mountain-road-in-autumn-41968-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500&q=80',
    tags: ['adventure', 'cycling', 'autumn', 'scenic']
  },
  {
    title: 'Gourmet Chocolate Souffle Baking',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-chocolate-pouring-on-a-muffin-40502-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1541743607455-894c2598380e?w=500&q=80',
    tags: ['baking', 'desserts', 'foodporn', 'aesthetic']
  },
  {
    title: 'Lofi Cyberpunk Coding Setup',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-at-night-42283-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80',
    tags: ['coding', 'lofi', 'desksetup', 'cyberpunk']
  }
];

export default function UploadScreen({ currentUser, onAddVideo, onUploadSuccess, darkMode }: UploadScreenProps) {
  const [caption, setCaption] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customFileSelected, setCustomFileSelected] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState('');

  // Upload progress simulation states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');
  const [uploadPercent, setUploadPercent] = useState(0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCustomFileSelected(true);
    setCustomFileName('simulated_device_capture_' + Math.floor(Math.random() * 1000) + '.mp4');
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCustomFileSelected(true);
      setCustomFileName(e.target.files[0].name);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setIsUploading(true);
    setUploadPercent(10);
    setUploadStep('Connecting to Cloudinary secure API storage...');

    // Progress Simulation Timeline
    setTimeout(() => {
      setUploadPercent(40);
      setUploadStep('Uploading raw MP4 container block stream...');
    }, 1200);

    setTimeout(() => {
      setUploadPercent(75);
      setUploadStep('Configuring Cloudinary transcoder backend...');
    }, 2400);

    setTimeout(() => {
      setUploadPercent(95);
      setUploadStep('Generating AI preview cover photo and thumbnail extraction...');
    }, 3600);

    setTimeout(() => {
      setUploadPercent(100);
      setUploadStep('Successfully indexed and synced to Harmee Social DB!');

      // Add to main state
      const source = customFileSelected ? VIDEO_PRESETS[3] : VIDEO_PRESETS[selectedPresetIndex];
      const parsedTags = tagsInput.trim() === '' 
        ? source.tags 
        : tagsInput.split(',').map(tag => tag.trim().replace('#', '')).filter(Boolean);

      const payload = {
        videoUrl: source.url,
        thumbnailUrl: source.thumbnail,
        caption: caption,
        user: {
          id: currentUser?.uid || 'demo_user_id',
          username: currentUser?.username || 'harmee_demo',
          displayName: currentUser?.displayName || 'Socialite User',
          avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
          bio: currentUser?.bio || 'Hey there!',
          followersCount: 104,
          followingCount: 31,
          isFollowing: false,
          postsCount: 12
        },
        tags: parsedTags
      };

      onAddVideo(payload);

      setTimeout(() => {
        setIsUploading(false);
        setUploadPercent(0);
        setUploadStep('');
        setCaption('');
        setTagsInput('');
        setCustomFileSelected(false);
        setCustomFileName('');
        // Return to Reels tab
        onUploadSuccess();
      }, 500);

    }, 4500);
  };

  return (
    <div className={`flex-1 flex flex-col h-full overflow-y-auto bg-inherit p-4`}>
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
          <Film className="text-indigo-500 animate-pulse" size={18} />
          Publish Reel
        </h2>
        <p className="text-[11px] text-zinc-400">Add vertical videos, store in Cloudinary, and capture trends.</p>
      </div>

      {isUploading ? (
        /* LOADING / CLOUDINARY UPLOAD PIPELINE STAGE overlays */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="relative flex items-center justify-center">
            {/* Outer spinning ring */}
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin absolute" />
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
          </div>

          <div className="space-y-2 max-w-xs">
            <h3 className="text-sm font-bold tracking-tight">Pushing video to Cloudinary...</h3>
            <p className="text-xs text-zinc-400 h-8 font-medium animate-pulse">{uploadStep}</p>
          </div>

          <div className="w-[200px] h-2 bg-zinc-800 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-650 rounded-full transition-all duration-300" 
              style={{ width: `${uploadPercent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono font-semibold text-indigo-400">{uploadPercent}% upload completed</span>
        </div>
      ) : (
        /* STANDARD UPLOAD WORKFLOW FORM CONTAINER */
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-left">
          
          {/* File Picker drag & drop simulator */}
          <div 
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
              customFileSelected 
                ? 'border-green-500/50 bg-green-500/5' 
                : darkMode 
                  ? 'border-zinc-800 bg-zinc-950/40 hover:border-zinc-700' 
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
            }`}
          >
            {customFileSelected ? (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto">
                  <CheckCircle size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-semibold block leading-none text-green-500">File Armed & Ready</span>
                  <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[200px] block mt-1">{customFileName}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    setCustomFileSelected(false);
                    setCustomFileName('');
                  }}
                  className="text-[10px] text-red-400 uppercase font-bold tracking-wider hover:underline"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 mx-auto">
                  <Upload size={20} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold block leading-none">Simulate Local Video Upload</span>
                  <span className="text-[10px] text-zinc-400 block">Drag & drop raw MP4 or tap below</span>
                </div>
                <label className="inline-block px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-550/20 text-indigo-400 rounded-xl text-[10px] font-bold cursor-pointer transition-all">
                  Browse Device Storage
                  <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileSelectChange}
                    className="hidden" 
                  />
                </label>
              </div>
            )}
          </div>

          {/* Presets Grid choice if no custom file selected */}
          {!customFileSelected && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                Or Select from Simulated Device Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_PRESETS.map((preset, idx) => {
                  const isChosen = selectedPresetIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPresetIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                        isChosen 
                          ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10 text-white' 
                          : darkMode 
                            ? 'border-zinc-805 bg-zinc-950/20 text-zinc-300 hover:border-zinc-700' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-[10px] font-semibold line-clamp-1">{preset.title}</span>
                      <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                        <ImageIcon size={10} className="text-indigo-400" /> Thumbnail extraction
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Caption Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <FileText size={11} className="text-indigo-500" /> Write your caption
            </label>
            <textarea
              required
              rows={2}
              maxLength={200}
              placeholder="What is going on in downtown Tokyo? Highlight the vibe, tag your friends..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={`w-full p-3 text-xs rounded-2xl outline-none border transition-all ${
                darkMode 
                  ? 'bg-zinc-950 border-zinc-850 focus:border-indigo-500 text-white' 
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-650 text-slate-800'
              }`}
            />
            <span className="text-[9px] text-zinc-500 text-right block mt-0.5 font-mono">{caption.length}/200 characters</span>
          </div>

          {/* Hashtags Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              Hashtags / Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="urban, design, coding, aesthetic"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={`w-full p-2.5 text-xs rounded-xl outline-none border transition-all ${
                darkMode 
                  ? 'bg-zinc-950 border-zinc-850 focus:border-indigo-500 text-white' 
                  : 'bg-slate-50 border-slate-205 focus:border-indigo-650 text-slate-850'
              }`}
            />
          </div>

          {/* Submit Trigger Buttons */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 cursor-pointer active:scale-98 transition-transform text-center flex items-center justify-center gap-2"
          >
            <Film size={14} />
            Upload video & Synced with Cloudinary
          </button>
        </form>
      )}

    </div>
  );
}
