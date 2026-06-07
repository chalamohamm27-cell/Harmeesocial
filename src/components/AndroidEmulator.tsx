import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Moon, Sun, Bell } from 'lucide-react';

interface AndroidEmulatorProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  title: string;
}

export default function AndroidEmulator({ children, darkMode, toggleDarkMode, title }: AndroidEmulatorProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // mapping 0 to 12
      setTime(`${hours}:${minutes} ${ampm}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen w-full flex items-center justify-center transition-colors duration-300 p-2 sm:p-6 ${darkMode ? 'bg-zinc-950 text-white' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Visual Workspace Title / Header (Only visible on Desktop, outside the emulator panel) */}
      <div className="absolute top-4 left-6 hidden lg:flex flex-col gap-1 pointer-events-none">
        <h1 className="text-xl font-semibold tracking-tight font-sans text-zinc-400 dark:text-zinc-600">
          Harmee Social
        </h1>
        <p className="text-xs font-mono text-zinc-400/80 dark:text-zinc-500">
          Android Material 3 Simulator
        </p>
      </div>

      <div className="absolute top-4 right-6 hidden lg:flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-full border transition-all pointer-events-auto cursor-pointer ${
            darkMode 
              ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-yellow-400' 
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
          }`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Main Physical Android Emulator Container */}
      <div 
        id="android-frame-wrapper" 
        className={`relative w-full max-w-[430px] h-[100dvh] sm:h-[860px] rounded-0 sm:rounded-[48px] border-none sm:border-8 transition-all overflow-hidden shadow-2xl flex flex-col ${
          darkMode 
            ? 'bg-zinc-900 border-zinc-800 shadow-zinc-950/75' 
            : 'bg-white border-slate-900 shadow-slate-300'
        }`}
      >
        {/* Dynamic Notch/Dynamic Island simulation */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 items-center justify-center hidden sm:flex">
          <div className="w-3 h-3 bg-zinc-900 rounded-full border border-zinc-800 absolute right-4"></div>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest pl-2">HARMEE</p>
        </div>

        {/* Operating System Status Bar */}
        <div className={`h-11 sm:h-12 px-6 flex items-end justify-between select-none z-40 transition-colors ${
          darkMode ? 'bg-zinc-950 text-zinc-200' : 'bg-slate-50 text-slate-800'
        }`}>
          {/* Simulated Time */}
          <span className="text-xs font-medium font-sans pb-1.5 sm:pb-2">{time}</span>

          {/* Quick status indicators */}
          <div className="flex items-center gap-2 pb-1.5 sm:pb-2">
            <Signal size={14} className="opacity-90" />
            <Wifi size={14} className="opacity-90" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-mono mr-0.5">98%</span>
              <Battery size={15} />
            </div>
          </div>
        </div>

        {/* Outer Device Glass Screen Container */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-inherit">
          {children}
        </div>

        {/* Custom Navigation pill (Android bottom pill) */}
        <div className={`h-6 flex items-center justify-center transition-colors ${
          darkMode ? 'bg-zinc-950 border-t border-zinc-900/50' : 'bg-slate-50 border-t border-slate-100'
        }`}>
          <div className={`w-32 h-1 rounded-full ${darkMode ? 'bg-zinc-700' : 'bg-slate-400'}`}></div>
        </div>

      </div>
    </div>
  );
}
