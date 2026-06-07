import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, Send, Check, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Comment, User } from '../types';

interface VideoFeedProps {
  videos: Video[];
  currentUser: any;
  onLikeToggle: (id: string) => void;
  onAddComment: (videoId: string, commentText: string) => void;
  onShare: (id: string) => void;
  onUserClick: (user: User) => void;
  darkMode: boolean;
  onLogout?: () => void;
  onChatClick?: () => void;
  unreadChatsCount?: number;
}

export default function VideoFeed({ 
  videos, 
  currentUser,
  onLikeToggle, 
  onAddComment, 
  onShare, 
  onUserClick, 
  darkMode,
  onLogout,
  onChatClick,
  unreadChatsCount = 0
}: VideoFeedProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareBouncing, setIsShareBouncing] = useState(false);
  
  // Custom states and refs for double-tap to like gesture & floating pop-up hearts
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const lastClickRef = useRef<number>(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Configure video observer to handle playing and pausing on scroll
  useEffect(() => {
    const activeVideo = videoRefs.current[currentIdx];
    if (activeVideo) {
      if (isPlaying) {
        activeVideo.play().catch((err) => console.log("Autoplay blocked:", err));
      } else {
        activeVideo.pause();
      }
    }
    
    // Pause other videos
    videoRefs.current.forEach((ref, idx) => {
      if (idx !== currentIdx && ref) {
        ref.pause();
        ref.currentTime = 0;
      }
    });

  }, [currentIdx, isPlaying]);

  // Handle gesture timing configurations
  useEffect(() => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
    }
  }, [currentIdx]);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickRef.current;

    if (timeDiff < 300) {
      // Double tap detected!
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }

      // Get precision click coordinates relative to the container element
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const activeVideo = videos[currentIdx];
      if (activeVideo) {
        // Double tap confirmed: add satisfying floating heart bursts at tap site
        const newHeart = {
          id: Date.now() + Math.random(),
          x,
          y
        };
        setHearts((prev) => [...prev, newHeart]);

        // Trigger like callback if not already liked (matches Instagram gesture behavior)
        if (!activeVideo.isLiked) {
          onLikeToggle(activeVideo.id);
        }
      }
    } else {
      // Hold for single tap timing
      clickTimeoutRef.current = setTimeout(() => {
        setIsPlaying((prev) => !prev);
        clickTimeoutRef.current = null;
      }, 250);
    }

    lastClickRef.current = currentTime;
  };

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
  };

  const activeVideo = videos[currentIdx];

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    if (currentIdx < videos.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setIsPlaying(true);
    }
  };

  const handleSendCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !activeVideo) return;
    onAddComment(activeVideo.id, newComment);
    setNewComment('');
  };

  const triggerShare = (video: Video) => {
    setIsShareBouncing(true);
    onShare(video.id);
    setShareFeedback(video.id);
    setToastMessage("Link copied! Share with your friends! 🌏🚀");
    
    setTimeout(() => {
      setIsShareBouncing(false);
    }, 700);

    setTimeout(() => {
      setShareFeedback(null);
    }, 2000);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (videos.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-sm text-zinc-400">No videos available in your region.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col justify-between relative bg-black h-full`}>
      
      {/* Video Carousel/Feed Stage */}
      <div className="absolute inset-0 w-full h-full flex flex-col select-none overflow-hidden group">
        
        {/* Actual Video Content Rendering */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={(el) => { videoRefs.current[currentIdx] = el; }}
            src={activeVideo.videoUrl}
            loop
            muted={isMuted}
            playsInline
            onClick={handleVideoClick}
            className="w-full h-full object-cover cursor-pointer"
            referrerPolicy="no-referrer"
          />

          {/* Satisfying double-tap pop-up hearts overlay */}
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ scale: 0, opacity: 0, rotate: -15 }}
                animate={{ 
                  scale: [0.2, 1.4, 1], 
                  opacity: [0, 1, 0],
                  rotate: [0, 15, -5, 0],
                  y: -50
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                onAnimationComplete={() => removeHeart(heart.id)}
                style={{
                  position: 'absolute',
                  left: heart.x - 30,
                  top: heart.y - 30,
                  zIndex: 30,
                  pointerEvents: 'none'
                }}
                className="text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]"
              >
                <Heart size={60} fill="currentColor" stroke="white" strokeWidth={1.5} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Quick Play indicate Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="p-5 rounded-full bg-white/20 backdrop-blur-md text-white shadow-xl"
              >
                <Play size={32} fill="white" />
              </motion.div>
            </div>
          )}

          {/* Sound volume controller float */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white z-20 cursor-pointer transition-all"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          {/* Elegant Floating Toast Notification */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -15, x: "-50%", scale: 0.9 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: -15, x: "-50%", scale: 0.9 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="absolute top-16 left-1/2 bg-zinc-950/90 backdrop-blur-md text-white px-4.5 py-2.5 rounded-2xl text-xs font-sans font-semibold tracking-wide flex items-center gap-2 z-30 shadow-xl pointer-events-none border border-zinc-800"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {toastMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* DM / direct messaging trigger button */}
          {onChatClick && (
            <button
              onClick={(e) => { e.stopPropagation(); onChatClick(); }}
              className="absolute top-4 right-15 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-indigo-400 hover:text-indigo-300 z-20 cursor-pointer transition-all relative"
              title="Direct DMs Inbox"
            >
              <Send size={15} className="-rotate-12" />
              {unreadChatsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[8px] font-bold text-white ring-2 ring-black animate-pulse">
                  {unreadChatsCount}
                </span>
              )}
            </button>
          )}

          {/* Logout button float */}
          {onLogout && (
            <button
              onClick={(e) => { e.stopPropagation(); onLogout(); }}
              className="absolute top-4 right-26 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-red-400 hover:text-red-300 z-20 cursor-pointer transition-all"
              title="Log out session"
            >
              <LogOut size={16} />
            </button>
          )}

          {/* Floating Channel/Topic context indicator */}
          <div className="absolute top-4 left-4 py-1.5 px-3 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-sans text-white/90 font-medium tracking-wide flex items-center gap-1.5 z-20">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
            LIVE FEED
          </div>

          {/* Bottom Feed Navigation Controls (Previous/Next indicators) */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
            {currentIdx > 0 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 pointer-events-auto cursor-pointer text-white/80 hover:text-white flex items-center justify-center text-xs font-bold font-mono transition-all"
                title="Previous short"
              >
                ▲
              </button>
            )}
            <div className="flex-1"></div>
            {currentIdx < videos.length - 1 && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 pointer-events-auto cursor-pointer text-white/80 hover:text-white flex items-center justify-center text-xs font-bold font-mono transition-all"
                title="Next short"
              >
                ▼
              </button>
            )}
          </div>

          {/* Sider bar details overlay (Liked count, Comments count) */}
          <div className="absolute right-4.5 bottom-24 flex flex-col items-center gap-5 z-20">
            
            {/* User Avatar Circle */}
            <div className="flex flex-col items-center mb-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onUserClick(activeVideo.user); }}
                className="w-11 h-11 rounded-full ring-2 ring-indigo-500 overflow-hidden cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <img 
                  src={activeVideo.user.avatar} 
                  alt={activeVideo.user.displayName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </button>
              <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold -mt-2.5 z-10 select-none">
                +
              </div>
            </div>

            {/* Like Interactive Button */}
            <div className="flex flex-col items-center text-center">
              <motion.button 
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); onLikeToggle(activeVideo.id); }}
                className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center text-white cursor-pointer transition-colors ${
                  activeVideo.isLiked ? 'bg-red-500' : 'bg-black/40 hover:bg-black/55'
                }`}
              >
                <Heart size={20} fill={activeVideo.isLiked ? "white" : "none"} className={activeVideo.isLiked ? "animate-wiggle" : ""} />
              </motion.button>
              <span className="text-[10px] text-white font-medium font-sans mt-1 shadow-sm drop-shadow-sm">
                {activeVideo.likesCount}
              </span>
            </div>

            {/* Comments Open Trigger */}
            <div className="flex flex-col items-center text-center">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowComments(activeVideo.id); }}
                className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur-md flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <MessageCircle size={20} />
              </button>
              <span className="text-[10px] text-white font-medium font-sans mt-1 shadow-sm drop-shadow-sm">
                {activeVideo.commentsCount}
              </span>
            </div>

            {/* Shares overlay buttons mockup */}
            <div className="flex flex-col items-center text-center">
              <motion.button 
                onClick={(e) => { e.stopPropagation(); triggerShare(activeVideo); }}
                animate={isShareBouncing ? { 
                  y: [0, -14, 4, -4, 0],
                  scale: [1, 1.25, 0.9, 1.05, 1],
                } : {}}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                whileTap={{ scale: 0.9 }}
                className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center text-white cursor-pointer transition-colors ${
                  shareFeedback ? 'bg-green-500' : 'bg-black/40 hover:bg-black/55'
                }`}
              >
                {shareFeedback ? <Check size={20} /> : <Share2 size={20} />}
              </motion.button>
              <span className="text-[10px] text-white font-medium font-sans mt-1 shadow-sm drop-shadow-sm">
                {shareFeedback ? "Copied" : activeVideo.sharesCount}
              </span>
            </div>

          </div>

          {/* Custom Video Metadata overlay on left bottom side */}
          <div className="absolute left-0 right-16 bottom-6 p-4 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white flex flex-col gap-1 z-15 pointer-events-none">
            <span 
              onClick={(e) => { e.stopPropagation(); onUserClick(activeVideo.user); }}
              className="text-sm font-semibold tracking-wide pointer-events-auto hover:underline cursor-pointer flex items-center gap-1.5"
            >
              @{activeVideo.user.username}
              <span className="inline-block px-1.5 py-0.5 bg-indigo-500 text-[8px] tracking-widest uppercase rounded font-bold">PRO</span>
            </span>
            <p className="text-xs text-white/90 line-clamp-2 leading-relaxed">
              {activeVideo.caption}
            </p>
            {/* Tags wrapper */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {activeVideo.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono text-indigo-300 font-medium tracking-wide">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Simulated Video Timeline Tracker progress bar */}
          <div className="absolute left-0 bottom-0 w-full h-1 bg-white/20 z-20">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="h-full bg-indigo-500"
            />
          </div>

        </div>

      </div>

      {/* Dynamic Slide-Up Comments Bottom Drawer */}
      <AnimatePresence>
        {showComments === activeVideo.id && (
          <>
            {/* Dim Backdrop wrapper */}
            <div 
              className="absolute inset-0 bg-black/60 z-30"
              onClick={() => setShowComments(null)}
            />
            {/* Content Drawer wrapper */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`absolute bottom-0 left-0 right-0 rounded-t-[32px] p-5 h-[410px] flex flex-col z-40 ${
                darkMode ? 'bg-zinc-950 text-white border-t border-zinc-900' : 'bg-white text-slate-950 border-t border-slate-100'
              }`}
            >
              {/* Drag line handle layout */}
              <div className="w-12 h-1.5 bg-zinc-400 dark:bg-zinc-800 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowComments(null)}></div>
              
              <div className="flex items-center justify-between mb-3.5 px-1">
                <h3 className="text-sm font-bold tracking-tight">
                  Comments ({activeVideo.comments.length})
                </h3>
                <button 
                  onClick={() => setShowComments(null)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-white font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* Dynamic scrollable comments list container */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
                {activeVideo.comments.map((comment: Comment) => (
                  <div key={comment.id} className="flex gap-3 text-xs items-start">
                    <img 
                      src={comment.avatar} 
                      alt={comment.username} 
                      className="w-8 h-8 rounded-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          @{comment.username}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
                {activeVideo.comments.length === 0 && (
                  <div className="text-center py-8 text-zinc-400">
                    No comments yet. Start the conversation below!
                  </div>
                )}
              </div>

              {/* Submit Comment Section form */}
              <form onSubmit={handleSendCommentSubmit} className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Post an encouraging word..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className={`flex-1 px-4 py-2 text-xs rounded-xl outline-none border transition-all ${
                    darkMode 
                      ? 'bg-zinc-900 border-zinc-800 focus:border-indigo-500 text-white' 
                      : 'bg-slate-100 border-slate-200 focus:border-indigo-600 text-slate-800'
                  }`}
                />
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 cursor-pointer text-xs transition-transform"
                >
                  <Send size={14} />
                </button>
              </form>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
