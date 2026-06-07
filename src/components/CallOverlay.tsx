import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User as UserIcon, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, CallType, CallStage } from '../types';

interface CallOverlayProps {
  user: User;
  type: CallType;
  stage: CallStage;
  onEndCall: () => void;
  onAcceptCall?: () => void;
  darkMode: boolean;
}

export default function CallOverlay({ user, type, stage, onEndCall, onAcceptCall, darkMode }: CallOverlayProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Set up timer for connected state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stage === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stage]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-zinc-950 text-white z-50 flex flex-col justify-between p-6">
      
      {/* Top Banner indicating call security and metadata */}
      <div className="flex flex-col items-center gap-1.5 mt-8 select-none">
        
        <div className="flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-mono tracking-widest text-zinc-300">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
          {type === 'video' ? 'SECURE VIDEO NODE' : 'SECURE VOICE NODE'}
        </div>

        {stage === 'connected' && (
          <span className="text-[11px] font-mono tracking-wide text-indigo-400 font-bold mt-1">
            {formatTime(seconds)}
          </span>
        )}
      </div>

      {/* Center user avatar / simulated camera feed layout */}
      <div className="my-auto flex flex-col items-center justify-center">
        
        {type === 'video' && stage === 'connected' && !isCameraOff ? (
          /* VIDEO CALL ACTIVE CONTAINER */
          <div className="relative w-full aspect-[9/16] max-h-[380px] rounded-[32px] overflow-hidden bg-zinc-900 border border-zinc-805 shadow-2xl">
            {/* Main Remote User dynamic video loop simulating active feed or placeholder */}
            <img 
              src={user.avatar} 
              alt={user.displayName} 
              className="w-full h-full object-cover opacity-80" 
              referrerPolicy="no-referrer"
            />
            
            {/* Mini PIP feedback panel showing self camera feedback */}
            <div className="absolute bottom-4 right-4 w-24 aspect-[9/16] rounded-xl overflow-hidden border-2 border-white/80 shadow-md bg-zinc-950">
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                <span className="text-[8px] font-mono text-zinc-400">Self CAMERA</span>
              </div>
            </div>

            {/* Bottom floating user name overlay banner */}
            <div className="absolute bottom-4 left-4 py-1.5 px-3 rounded-xl bg-black/40 backdrop-blur-sm">
              <p className="text-[10px] font-semibold tracking-wide">
                @{user.username}
              </p>
            </div>
          </div>
        ) : (
          /* AUDIO CALL OR IDLE DIALING OR BLOCKED VIDEO STATUS */
          <div className="relative flex flex-col items-center">
            
            {/* Interactive Pulse circles indicator for active dialers */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="absolute w-32 h-32 rounded-full bg-indigo-500/10"
              />
              <motion.div 
                animate={{ scale: [1, 1.7, 1] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut", delay: 0.6 }}
                className="absolute w-32 h-32 rounded-full bg-indigo-500/5"
              />

              <div className="w-24 h-24 rounded-full ring-4 ring-indigo-500 overflow-hidden shadow-2xl z-10">
                <img 
                  src={user.avatar} 
                  alt={user.displayName} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h3 className="text-base font-bold font-sans tracking-tight mt-6">
              {user.displayName}
            </h3>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              @{user.username}
            </p>

            {/* Stage text status */}
            <span className="text-xs font-medium text-emerald-400 animate-pulse mt-4">
              {stage === 'calling' && 'Outgoing connection...'}
              {stage === 'ringing' && 'Incoming Call on Harmee...'}
              {stage === 'connected' && 'Call connected'}
              {stage === 'ended' && 'Connection ended'}
            </span>

          </div>
        )}

      </div>

      {/* Bottom control parameters bar (Accept call / Toggle call options / End call) */}
      <div className="flex flex-col gap-6 items-center mb-8">
        
        <div className="flex items-center gap-5 justify-center">
          
          {/* Mute Mic toggle button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-2xl cursor-pointer transition-colors ${
              isMuted ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/15 text-zinc-300'
            }`}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Toggle Camera state inside video sessions */}
          {type === 'video' && (
            <button
              onClick={() => setIsCameraOff(!isCameraOff)}
              className={`p-3.5 rounded-2xl cursor-pointer transition-colors ${
                isCameraOff ? 'bg-red-500 text-white' : 'bg-white/10 hover:bg-white/15 text-zinc-300'
              }`}
            >
              {isCameraOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
          )}

          {/* Hang up Red caller action */}
          <button
            onClick={onEndCall}
            className="p-4 bg-red-600 rounded-3xl hover:bg-red-700 active:scale-95 text-white shadow-lg cursor-pointer shadow-red-600/25 transition-transform"
            title="End direct call Link"
          >
            <PhoneOff size={22} className="rotate-0" />
          </button>

        </div>

        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] uppercase tracking-wide font-mono select-none">
          <span className="w-1 h-1 bg-zinc-500 rounded-full"></span>
          End to End Encrypted
        </div>

      </div>

    </div>
  );
}
