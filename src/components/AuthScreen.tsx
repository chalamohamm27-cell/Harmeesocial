import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HarmeeUser, MOCK_AVATARS, isFirebaseConfigured, getFirebaseAuth, saveSimulatedUser, getSimulatedUsers } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import harmeeLogo from '../assets/images/harmee_logo_1780783607432.png';

interface AuthScreenProps {
  onAuthSuccess: (user: HarmeeUser) => void;
  darkMode: boolean;
}

export default function AuthScreen({ onAuthSuccess, darkMode }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(MOCK_AVATARS[0]);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const firebaseAuth = getFirebaseAuth();
  const configured = isFirebaseConfigured();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please complete all required fields.");
      setLoading(false);
      return;
    }

    if (isSignUp && (!username || !displayName)) {
      setError("Please specify a unique username and display name.");
      setLoading(false);
      return;
    }

    try {
      if (configured && firebaseAuth) {
        if (isSignUp) {
          const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
          const user = userCredential.user;
          const harmeeUser: HarmeeUser = {
            uid: user.uid,
            email: user.email || email,
            displayName: displayName,
            username: username.toLowerCase().replace(/\s+/g, '_'),
            avatar: selectedAvatar,
            bio: 'Hey there! I am on Harmee Social.'
          };
          onAuthSuccess(harmeeUser);
        } else {
          const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
          const user = userCredential.user;
          const harmeeUser: HarmeeUser = {
            uid: user.uid,
            email: user.email || email,
            displayName: user.displayName || 'Socialite',
            username: (user.displayName || 'socialite').toLowerCase().replaceAll(' ', '_'),
            avatar: selectedAvatar,
            bio: 'Hey there! I am on Harmee Social.'
          };
          onAuthSuccess(harmeeUser);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (isSignUp) {
          const simulatedUsers = getSimulatedUsers();
          const emailExists = simulatedUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
          if (emailExists) {
            setError("User already exists. Please sign in");
            setLoading(false);
            return;
          }

          const newUser: HarmeeUser = {
            uid: 'sim_' + Date.now().toString(36),
            email: email,
            displayName: displayName,
            username: username.toLowerCase().replace(/\s+/g, '_'),
            avatar: selectedAvatar,
            bio: 'Creative soul building things on Harmee.'
          };
          saveSimulatedUser({
            uid: newUser.uid,
            email: newUser.email,
            username: newUser.username,
            displayName: newUser.displayName,
            avatar: newUser.avatar
          });
          onAuthSuccess(newUser);
        } else {
          if (password === 'wrong' || password.length < 6) {
            setError("Email or password is incorrect");
            setLoading(false);
            return;
          }

          const simulatedUsers = getSimulatedUsers();
          const matchedUser = simulatedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

          const activeUser = matchedUser ? {
            uid: matchedUser.uid,
            email: matchedUser.email,
            displayName: matchedUser.displayName,
            username: matchedUser.username,
            avatar: matchedUser.avatar,
            bio: 'Adventures start here! 💫'
          } : {
            uid: 'sim_user_host',
            email: email,
            displayName: email.split('@')[0].toUpperCase(),
            username: email.split('@')[0].toLowerCase(),
            avatar: selectedAvatar,
            bio: 'Adventures start here! 💫'
          };
          onAuthSuccess(activeUser);
        }
      }
    } catch (e: any) {
      console.error(e);
      let message = "An authentication error occurred.";
      if (e.code === 'auth/email-already-in-use') {
        message = "User already exists. Please sign in";
      } else if (
        e.code === 'auth/invalid-credential' || 
        e.code === 'auth/wrong-password' || 
        e.code === 'auth/user-not-found' || 
        e.code === 'auth/invalid-email' ||
        e.code === 'auth/user-disabled'
      ) {
        message = "Email or password is incorrect";
      } else {
        message = e.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      if (configured && firebaseAuth) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        const result = await signInWithPopup(firebaseAuth, provider);
        const user = result.user;
        const harmeeUser: HarmeeUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Socialite',
          username: (user.displayName || 'socialite').toLowerCase().replace(/[^a-z0-9_]/g, ''),
          avatar: user.photoURL || MOCK_AVATARS[0],
          bio: 'Hey there! I am exploring Harmee.'
        };
        onAuthSuccess(harmeeUser);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const matched = {
          uid: 'sim_google_123',
          email: 'google.user@harmee.social',
          username: 'google_partner',
          displayName: 'Google Partner',
          avatar: MOCK_AVATARS[1]
        };
        saveSimulatedUser(matched);
        onAuthSuccess({
          uid: matched.uid,
          email: matched.email,
          displayName: matched.displayName,
          username: matched.username,
          avatar: matched.avatar,
          bio: 'Authorized securely via Google simulation! 💫'
        });
      }
    } catch (e: any) {
      console.error("Google sign in error:", e);
      let msg = e.message || "Failed to sign in with Google.";
      if (e.code === 'auth/popup-closed-by-user') {
        msg = "The authentication popup was closed.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoBypass = () => {
    onAuthSuccess({
      uid: 'demo_user_id',
      email: 'demo@harmee.social',
      displayName: 'Demo Account',
      username: 'harmee_demo',
      avatar: MOCK_AVATARS[0],
      bio: 'Exploring Harmee Social app! Feel free to chat with simulated users or run high quality real-time video calls! ✨'
    });
  };

  return (
    <div className={`flex-1 flex flex-col justify-between px-6 py-8 h-full overflow-y-auto ${darkMode ? 'bg-zinc-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Intro branding top header */}
      <div className="flex flex-col items-center text-center mt-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 rounded-[22px] overflow-hidden shadow-xl mb-4 bg-zinc-950 border border-zinc-800/50 flex items-center justify-center"
        >
          <img 
            src={harmeeLogo} 
            alt="Harmee Social Logo" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* EXACTLY: Welcome to Harmee Social */}
        <h2 className="text-2xl font-bold tracking-tight font-sans">
          Welcome to Harmee Social
        </h2>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-[280px]">
          Short videos, real-time chat, and instant video calling.
        </p>
      </div>

      {/* Main card panel containing forms */}
      <div className="my-auto py-6">
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
              {error}
            </div>
          )}

          {isSignUp && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }} 
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Display Name Input */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <UserIcon size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none border transition-all ${
                    darkMode 
                      ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white' 
                      : 'bg-white border-slate-200 focus:border-indigo-600 text-slate-800'
                  }`}
                />
              </div>

              {/* Unique Username */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs select-none">
                  @
                </span>
                <input
                  type="text"
                  placeholder="username (e.g. harmee_chef)"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none border transition-all ${
                    darkMode 
                      ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white' 
                      : 'bg-white border-slate-200 focus:border-indigo-600 text-slate-800'
                  }`}
                />
              </div>
              
              {/* Profile Avatar Selection Option */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium tracking-wide uppercase text-zinc-400">
                  Choose Profile Picture
                </label>
                <div className="flex gap-2.5 justify-around py-1">
                  {MOCK_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(url)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden transition-all duration-200 ring-offset-2 ring-indigo-500 cursor-pointer ${
                        selectedAvatar === url ? 'ring-2 scale-110' : 'opacity-60 scale-90 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar option ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Email input field */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <Mail size={16} />
            </span>
            <input
              type="email"
              placeholder="Email Address"
              required
              id="auth_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none border transition-all ${
                darkMode 
                  ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white' 
                  : 'bg-white border-slate-200 focus:border-indigo-600 text-slate-800'
              }`}
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
              <Lock size={16} />
            </span>
            <input
              type="password"
              placeholder="Secret Password"
              required
              id="auth_password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 text-sm rounded-2xl outline-none border transition-all ${
                darkMode 
                  ? 'bg-zinc-950 border-zinc-800 focus:border-indigo-500 text-white' 
                  : 'bg-white border-slate-200 focus:border-indigo-600 text-slate-800'
              }`}
            />
          </div>

          {/* Sign In vs Create Account Actions */}
          <div className="space-y-2.5 pt-1">
            {!isSignUp ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  id="btn_sign_in"
                  className="w-full py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 font-medium rounded-2xl tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer text-sm transition-all"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError(null);
                  }}
                  id="btn_create_account_toggle"
                  className={`w-full py-3.5 outline-none border hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-xs rounded-2xl cursor-pointer shadow-sm tracking-wide transition-all ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  id="btn_create_account"
                  className="w-full py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 font-medium rounded-2xl tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer text-sm transition-all"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      Register Secure Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError(null);
                  }}
                  id="btn_sign_in_toggle"
                  className={`w-full py-3.5 outline-none border hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-xs rounded-2xl cursor-pointer shadow-sm tracking-wide transition-all ${
                    darkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  Back to Sign In
                </button>
              </>
            )}
          </div>
        </form>

        {/* EXACTLY: ──────── OR ──────── */}
        <div className="relative my-7 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${darkMode ? 'border-zinc-800' : 'border-slate-200'}`}></div>
          </div>
          <span className={`relative px-4 text-xs font-mono select-none ${darkMode ? 'bg-zinc-900 text-zinc-500' : 'bg-slate-50 text-slate-400'}`}>
            OR
          </span>
        </div>

        {/* EXACTLY: [ Continue with Google ] */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          id="btn_continue_with_google"
          className={`w-full py-3.5 flex items-center justify-center gap-3 rounded-2xl font-medium text-sm transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50 border ${
            darkMode 
              ? 'bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-800/60' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {/* Symmetrical Inline SVG Google Icon */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

      </div>

      {/* Demo Account quick access */}
      <div className={`mt-auto p-4 rounded-3xl border text-center ${
        darkMode ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-slate-100/60 border-slate-200'
      }`}>
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          {!configured && "⚠️ Cloud connection not set up yet. Start right away:"}
          {configured && "✨ Real Firebase Connection Active"}
        </p>
        <button
          onClick={handleDemoBypass}
          id="btn_demo_bypass"
          className="mt-2.5 w-full py-2 bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 font-medium text-xs rounded-xl cursor-pointer shadow-sm tracking-wide transition-all"
        >
          🔑 Use Instantly in Demo Mode
        </button>
      </div>

    </div>
  );
}

