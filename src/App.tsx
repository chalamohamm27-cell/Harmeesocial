import React, { useState, useEffect } from 'react';
import AndroidEmulator from './components/AndroidEmulator';
import AuthScreen from './components/AuthScreen';
import VideoFeed from './components/VideoFeed';
import ChatScreen from './components/ChatScreen';
import ProfileView from './components/ProfileView';
import BottomNav from './components/BottomNav';
import CallOverlay from './components/CallOverlay';

// High-fidelity functional sub-modules
import DiscoverScreen from './components/DiscoverScreen';
import UploadScreen from './components/UploadScreen';
import NotificationsScreen from './components/NotificationsScreen';

import { User, Video, Chat, CallStage, CallType, Comment } from './types';
import { MOCK_VIDEOS, INITIAL_CHATS, MOCK_USERS, MOCK_NOTIFICATIONS, NotificationItem } from './mockData';
import { HarmeeUser, getFirebaseAuth, db, handleFirestoreError, OperationType } from './firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { LogOut, Volume2, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, doc, setDoc, updateDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore';

export default function App() {
  const [currentUser, setCurrentUser] = useState<HarmeeUser | null>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'discover' | 'upload' | 'notifications' | 'profile'>('feed');
  const [darkMode, setDarkMode] = useState(true);
  
  // Slide-over absolute DM layer
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Social feeds states
  const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  
  // Browsing profile detail navigation stacks
  const [navProfileUser, setNavProfileUser] = useState<User | null>(null);

  // Calling features overlay parameters
  const [activeCallUser, setActiveCallUser] = useState<User | null>(null);
  const [activeCallType, setActiveCallType] = useState<CallType>('audio');
  const [activeCallStage, setActiveCallStage] = useState<CallStage>('idle');

  // Computing unread chat message stats
  const totalUnreadChats = chats.reduce((acc, c) => acc + c.unreadCount, 0);
  
  // Computing unread lifestyle alerts notifications badging
  const totalUnreadAlerts = notifications.filter(n => !n.read).length;

  // Sync theme configurations from local client store
  useEffect(() => {
    const savedTheme = localStorage.getItem('harmee_dark_mode');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true');
    }
  }, []);

  // Sync and listen securely with Firebase Auth instances
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const defaultUser: HarmeeUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Socialite',
            username: (firebaseUser.email?.split('@')[0] || 'socialite').toLowerCase().replace(/[^a-z0-9_]/g, ''),
            avatar: MOCK_AVATARS[0],
            bio: 'Hey there! I am exploring Harmee Social.'
          };

          setCurrentUser(defaultUser);

          // Save user registration to Firestore users path
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              id: firebaseUser.uid,
              username: defaultUser.username,
              displayName: defaultUser.displayName,
              avatar: defaultUser.avatar,
              bio: defaultUser.bio,
              followersCount: 142,
              followingCount: 56,
              postsCount: 4
            }, { merge: true });
          } catch (e) {
            console.error("Failed to sync user profile to Firestore:", e);
          }
        } else {
          setCurrentUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Synchronize Videos collection with Firestore in real-time or fallbacks
  useEffect(() => {
    if (!currentUser) return;
    
    const path = 'videos';
    try {
      const q = query(collection(db, path));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          console.log("Videos collection is empty. Seeding with mock videos...");
          for (const v of MOCK_VIDEOS) {
            try {
              await setDoc(doc(db, 'videos', v.id), v);
            } catch (err) {
              console.error("Seeding video error:", err);
            }
          }
        } else {
          const loadedVideos: Video[] = [];
          snapshot.forEach((doc) => {
            loadedVideos.push(doc.data() as Video);
          });
          setVideos(loadedVideos);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
      
      return () => unsubscribe();
    } catch (e) {
      console.error("Videos onSnapshot registration error:", e);
    }
  }, [currentUser]);

  // Synchronize Chats with Firestore
  useEffect(() => {
    if (!currentUser) return;
    
    const path = 'chats';
    try {
      const q = query(collection(db, path));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          console.log("Chats collection is empty. Seeding with standard channels...");
          for (const c of INITIAL_CHATS) {
            try {
              await setDoc(doc(db, 'chats', c.id), c);
            } catch (err) {
              console.error("Seeding chat error:", err);
            }
          }
        } else {
          const loadedChats: Chat[] = [];
          snapshot.forEach((doc) => {
            loadedChats.push(doc.data() as Chat);
          });
          setChats(loadedChats);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
      
      return () => unsubscribe();
    } catch (e) {
      console.error("Chats onSnapshot registration error:", e);
    }
  }, [currentUser]);

  // Synchronize Notifications with Firestore
  useEffect(() => {
    if (!currentUser) return;
    
    const path = 'notifications';
    try {
      const q = query(collection(db, path), where('recipientId', '==', currentUser.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        if (snapshot.empty) {
          console.log("Notifications collection is empty. Seeding standard list...");
          for (const n of MOCK_NOTIFICATIONS) {
            try {
              const withRecipient = { ...n, recipientId: currentUser.uid };
              await setDoc(doc(db, 'notifications', n.id), withRecipient);
            } catch (err) {
              console.error("Seeding notification error:", err);
            }
          }
        } else {
          const loadedNotifs: NotificationItem[] = [];
          snapshot.forEach((doc) => {
            loadedNotifs.push(doc.data() as NotificationItem);
          });
          setNotifications(loadedNotifs);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
      });
      
      return () => unsubscribe();
    } catch (e) {
      console.error("Notifications onSnapshot registration error:", e);
    }
  }, [currentUser]);

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Firebase sign out failed:", err);
      }
    }
    setCurrentUser(null);
    setActiveTab('feed');
    setIsChatOpen(false);
  };

  const toggleDarkMode = () => {
    const newVal = !darkMode;
    setDarkMode(newVal);
    localStorage.setItem('harmee_dark_mode', String(newVal));
  };

  // Convert HarmeeUser (Auth object) to matching core Social profile standard
  const getCurrentUserSocialObj = (): User => {
    return {
      id: currentUser ? currentUser.uid : 'demo_user_id',
      username: currentUser ? currentUser.username : 'harmee_demo',
      displayName: currentUser ? currentUser.displayName : 'Demo Account',
      avatar: currentUser ? currentUser.avatar : MOCK_AVATARS[0],
      bio: currentUser ? currentUser.bio || 'Exploring Harmee!' : 'Exploring Harmee!',
      followersCount: 142,
      followingCount: 56,
      isFollowing: false,
      postsCount: videos.filter(v => v.user.id === (currentUser ? currentUser.uid : 'demo_user_id')).length || 4
    };
  };

  // Handle Updates to Current user's bio & avatar indicators
  const handleUpdateCurrentUserProfile = async (updatedData: { displayName: string; bio: string; avatar: string }) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      displayName: updatedData.displayName,
      bio: updatedData.bio,
      avatar: updatedData.avatar
    };

    setCurrentUser(updatedUser);

    const path = `users/${currentUser.uid}`;
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        displayName: updatedData.displayName,
        bio: updatedData.bio,
        avatar: updatedData.avatar
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Likes toggle updates on short video lists
  const handleLikeToggle = async (videoId: string) => {
    const videoObj = videos.find(v => v.id === videoId);
    if (!videoObj) return;

    const liked = !videoObj.isLiked;
    const updatedVideo = {
      ...videoObj,
      isLiked: liked,
      likesCount: liked ? videoObj.likesCount + 1 : videoObj.likesCount - 1
    };

    setVideos(prev => prev.map(v => v.id === videoId ? updatedVideo : v));

    const path = `videos/${videoId}`;
    try {
      await updateDoc(doc(db, 'videos', videoId), {
        isLiked: liked,
        likesCount: liked ? videoObj.likesCount + 1 : videoObj.likesCount - 1
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Comments addition logic updates
  const handleAddComment = async (videoId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const authorUser = getCurrentUserSocialObj();

    const newCommentObj: Comment = {
      id: 'comment_' + Date.now().toString(36),
      username: authorUser.username,
      avatar: authorUser.avatar,
      text: commentText,
      timestamp: 'Just now'
    };

    const videoObj = videos.find(v => v.id === videoId);
    if (!videoObj) return;

    const updatedComments = [newCommentObj, ...videoObj.comments];
    const updatedCount = videoObj.commentsCount + 1;

    setVideos(prev => prev.map(v => v.id === videoId ? {
      ...v,
      comments: updatedComments,
      commentsCount: updatedCount
    } : v));

    const path = `videos/${videoId}`;
    try {
      await updateDoc(doc(db, 'videos', videoId), {
        comments: updatedComments,
        commentsCount: updatedCount
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // File Add simulated from Cloudinary inside the upload stage
  const handleAddVideo = async (newVideoPayload: any) => {
    const videoId = 'video_' + Date.now().toString(36);
    const newVideo: Video = {
      id: videoId,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isShared: false,
      comments: [],
      ...newVideoPayload
    };
    
    setVideos(prev => [newVideo, ...prev]);

    const path = `videos/${videoId}`;
    try {
      await setDoc(doc(db, 'videos', videoId), newVideo);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Shares action updates
  const handleShare = async (videoId: string) => {
    const videoObj = videos.find(v => v.id === videoId);
    if (!videoObj) return;

    const updatedShares = videoObj.sharesCount + 1;

    setVideos(prev => prev.map(v => v.id === videoId ? {
      ...v,
      sharesCount: updatedShares
    } : v));

    const path = `videos/${videoId}`;
    try {
      await updateDoc(doc(db, 'videos', videoId), {
        sharesCount: updatedShares
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Direct DM messages dispatch logic
  const handleSendMessage = async (chatId: string, text: string) => {
    const newMessageObj = {
      id: 'msg_' + Date.now().toString(36),
      senderId: 'self',
      text: text,
      timestamp: (() => {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${minutes} ${ampm}`;
      })()
    };

    const chatObj = chats.find(c => c.id === chatId);
    if (!chatObj) return;

    const updatedMsgs = [...chatObj.messages];
    if (text.endsWith('✨') || text.endsWith('📱') || text.includes('online')) {
      updatedMsgs.push({
        ...newMessageObj,
        senderId: chatObj.user.id
      });
    } else {
      updatedMsgs.push(newMessageObj);
    }

    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: updatedMsgs,
          unreadCount: 0
        };
      }
      return chat;
    }));

    const path = `chats/${chatId}`;
    try {
      await updateDoc(doc(db, 'chats', chatId), {
        messages: updatedMsgs,
        unreadCount: 0
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  // Follow/Unfollow capability
  const handleFollowToggle = () => {
    if (!navProfileUser) return;
    const isFollowing = !navProfileUser.isFollowing;

    setNavProfileUser(prev => prev ? {
      ...prev,
      isFollowing: isFollowing,
      followersCount: isFollowing ? prev.followersCount + 1 : prev.followersCount - 1
    } : null);

    setVideos(prev => prev.map(video => {
      if (video.user.id === navProfileUser.id) {
        return {
          ...video,
          user: {
            ...video.user,
            isFollowing: isFollowing,
            followersCount: isFollowing ? video.user.followersCount + 1 : video.user.followersCount - 1
          }
        };
      }
      return video;
    }));
  };

  // Initiate real-time calls over overlay stage
  const handleInitiateCall = (user: User, type: 'audio' | 'video') => {
    setActiveCallUser(user);
    setActiveCallType(type);
    setActiveCallStage('calling');

    setTimeout(() => {
      setActiveCallStage('connected');
    }, 2000);
  };

  const handleEndCall = () => {
    setActiveCallStage('ended');
    setTimeout(() => {
      setActiveCallStage('idle');
      setActiveCallUser(null);
    }, 850);
  };

  // Clear all notifications locally
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Handle routing clicks on creators or comments
  const handleProfileRouteJump = (user: User) => {
    if (user.id === (currentUser ? currentUser.uid : 'demo_user_id')) {
      setActiveTab('profile');
      setNavProfileUser(null);
    } else {
      setNavProfileUser(user);
    }
  };

  return (
    <AndroidEmulator darkMode={darkMode} toggleDarkMode={toggleDarkMode} title="Harmee Social">
      
      <div className="flex-1 flex flex-col h-full bg-inherit relative overflow-hidden">
        
        {!currentUser ? (
          <AuthScreen onAuthSuccess={setCurrentUser} darkMode={darkMode} />
        ) : (
          <>
            {/* Headers Area displayed for tabs except live absolute full-screen reel player */}
            {activeTab !== 'feed' && !navProfileUser && (
              <div className={`h-14 px-5 flex items-center justify-between border-b transition-colors z-20 ${
                darkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-slate-50 border-slate-100'
              }`}>
                <h2 className="text-xs font-black tracking-widest uppercase text-indigo-500 font-sans">
                  {activeTab === 'discover' && 'Explore Aesthetics'}
                  {activeTab === 'upload' && 'Select Creative'}
                  {activeTab === 'notifications' && 'Inbox Alerts'}
                  {activeTab === 'profile' && 'Personal Profile'}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                      darkMode ? 'hover:bg-zinc-900 text-red-400' : 'hover:bg-slate-100 text-red-600'
                    }`}
                    title="Sign out of Harmee"
                  >
                    <LogOut size={13} />
                    <span className="font-semibold hidden sm:inline">Logout</span>
                  </button>
                </div>
              </div>
            )}

            {/* Profile Stack Detail viewer with back arrow */}
            {navProfileUser && (
              <div className={`h-14 px-4 flex items-center gap-3 border-b transition-colors z-20 ${
                darkMode ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
              }`}>
                <button
                  onClick={() => setNavProfileUser(null)}
                  className="p-1 px-2 text-xs font-bold rounded-xl bg-zinc-800/20 text-zinc-400 hover:text-white cursor-pointer"
                >
                  ◀ Back
                </button>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold leading-none truncate block">
                    {navProfileUser.displayName}
                  </h3>
                  <span className="text-[9px] font-mono text-zinc-400">@{navProfileUser.username}</span>
                </div>
              </div>
            )}

            {/* Stage content switch rendering based on activeTab */}
            <div className="flex-1 overflow-hidden flex flex-col relative bg-transparent">
              {navProfileUser ? (
                <ProfileView 
                  user={navProfileUser} 
                  isCurrentUser={false} 
                  onFollowToggle={handleFollowToggle}
                  darkMode={darkMode}
                  userVideos={videos.filter(v => v.user.id === navProfileUser.id)}
                  onVideoClick={(videoId) => {
                    const findVideo = videos.find(v => v.id === videoId);
                    if (findVideo) {
                      setVideos(prev => {
                        const remaining = prev.filter(v => v.id !== videoId);
                        return [findVideo, ...remaining];
                      });
                      setNavProfileUser(null);
                      setActiveTab('feed');
                    }
                  }}
                />
              ) : (
                <>
                  {activeTab === 'feed' && (
                    <VideoFeed 
                      videos={videos} 
                      currentUser={currentUser}
                      onLikeToggle={handleLikeToggle}
                      onAddComment={handleAddComment}
                      onShare={handleShare}
                      onUserClick={handleProfileRouteJump}
                      darkMode={darkMode}
                      onLogout={handleLogout}
                      onChatClick={() => setIsChatOpen(true)}
                      unreadChatsCount={totalUnreadChats}
                    />
                  )}

                  {activeTab === 'discover' && (
                    <DiscoverScreen 
                      videos={videos}
                      onUserClick={handleProfileRouteJump}
                      onVideoClick={(videoId) => {
                        const findVideo = videos.find(v => v.id === videoId);
                        if (findVideo) {
                          setVideos(prev => {
                            const remaining = prev.filter(v => v.id !== videoId);
                            return [findVideo, ...remaining];
                          });
                          setActiveTab('feed');
                        }
                      }}
                      darkMode={darkMode}
                    />
                  )}

                  {activeTab === 'upload' && (
                    <UploadScreen 
                      currentUser={getCurrentUserSocialObj()}
                      onAddVideo={handleAddVideo}
                      onUploadSuccess={() => {
                        setActiveTab('feed');
                      }}
                      darkMode={darkMode}
                    />
                  )}

                  {activeTab === 'notifications' && (
                    <NotificationsScreen 
                      notifications={notifications}
                      onUserClick={handleProfileRouteJump}
                      onClearAll={handleClearNotifications}
                      darkMode={darkMode}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <ProfileView 
                      user={getCurrentUserSocialObj()} 
                      isCurrentUser={true}
                      onUpdateCurrentUserProfile={handleUpdateCurrentUserProfile}
                      darkMode={darkMode}
                      onLogout={handleLogout}
                      userVideos={videos.filter(v => v.user.id === (currentUser ? currentUser.uid : 'demo_user_id'))}
                      onVideoClick={(videoId) => {
                        const findVideo = videos.find(v => v.id === videoId);
                        if (findVideo) {
                          setVideos(prev => {
                            const remaining = prev.filter(v => v.id !== videoId);
                            return [findVideo, ...remaining];
                          });
                          setActiveTab('feed');
                        }
                      }}
                    />
                  )}
                </>
              )}
            </div>

            {/* Floating absolute Direct Message overlay from the right hand side */}
            <AnimatePresence>
              {isChatOpen && (
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="absolute inset-0 z-40 flex flex-col bg-zinc-950"
                  id="direct-message-flyout"
                >
                  <div className={`h-14 px-4 flex items-center justify-between border-b transition-colors z-20 ${
                    darkMode ? 'bg-zinc-950 border-zinc-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                  }`}>
                    <button
                      onClick={() => setIsChatOpen(false)}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-90 w-auto bg-zinc-800/40 text-indigo-400 hover:text-white cursor-pointer"
                    >
                      ◀ Feed Reels
                    </button>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-zinc-500">Inbox Chat</span>
                  </div>
                  
                  <div className="flex-1 overflow-hidden flex flex-col bg-inherit">
                    <ChatScreen 
                      chats={chats}
                      onSendMessage={handleSendMessage}
                      onInitiateCall={handleInitiateCall}
                      darkMode={darkMode}
                      onUserClick={(usr) => {
                        setIsChatOpen(false);
                        handleProfileRouteJump(usr);
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom standard Android Material 3 navigation controller bar */}
            <BottomNav 
              activeTab={activeTab} 
              onTabChange={(tab) => {
                setActiveTab(tab);
                setNavProfileUser(null);
                setIsChatOpen(false); // Close chats if user clicks on bottom menu bars
              }} 
              darkMode={darkMode}
              unreadCount={totalUnreadAlerts}
            />

          </>
        )}

        {/* Dynamic calling sessions screen overlays */}
        <AnimatePresence>
          {activeCallUser && activeCallStage !== 'idle' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-50 overflow-hidden"
            >
              <CallOverlay 
                user={activeCallUser}
                type={activeCallType}
                stage={activeCallStage}
                onEndCall={handleEndCall}
                darkMode={darkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </AndroidEmulator>
  );
}

// Inline pre-compiled background options for profile choosers
const MOCK_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop"
];
