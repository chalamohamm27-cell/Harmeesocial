import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, ArrowLeft, Phone, Video, CheckCheck, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Chat, Message, User } from '../types';

interface ChatScreenProps {
  chats: Chat[];
  onSendMessage: (chatId: string, text: string) => void;
  onInitiateCall: (user: User, type: 'audio' | 'video') => void;
  darkMode: boolean;
  onUserClick: (user: User) => void;
}

export default function ChatScreen({ chats, onSendMessage, onInitiateCall, darkMode, onUserClick }: ChatScreenProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeChat = chats.find(c => c.id === selectedChatId);

  // Dynamic automatic reply engine
  useEffect(() => {
    if (!activeChat) return;

    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    const messages = activeChat.messages;
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      
      // If the last message was sent by 'self', trigger an automatic reply
      if (lastMsg.senderId === 'self') {
        setIsTyping(true);
        const timer = setTimeout(() => {
          setIsTyping(false);
          let replyText = "Hey! That sounds fantastic.";
          
          const textLower = lastMsg.text.toLowerCase();
          if (textLower.includes('hello') || textLower.includes('hey') || textLower.includes('hi')) {
            replyText = `Hey there! Glad you reached out on Harmee! How is your day going? ✨`;
          } else if (textLower.includes('call') || textLower.includes('video') || textLower.includes('phone') || textLower.includes('talk')) {
            replyText = `Oh, we should absolutely connect! Try clicking the phone/video call buttons in our chat header right now! I'm active and online. 📞📱`;
          } else if (textLower.includes('cool') || textLower.includes('nice') || textLower.includes('amazing') || textLower.includes('great')) {
            replyText = `Right?! The modern Material 3 fluid physics feeling is so nice in this Android environment tracker.`;
          } else {
            replyText = `Yeah, totally agree. Check out the live video call feature by clicking the camera icon at the top of our chat room! 📸`;
          }

          onSendMessage(activeChat.id, replyText);
        }, 1800);

        return () => clearTimeout(timer);
      }
    }
  }, [activeChat?.messages.length]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedChatId) return;
    onSendMessage(selectedChatId, inputText);
    setInputText('');
  };

  const filteredChats = chats.filter(c => 
    c.user.displayName.toLowerCase().includes(searchText.toLowerCase()) || 
    c.user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className={`flex-1 flex flex-col h-full bg-inherit relative`}>
      
      <AnimatePresence mode="wait">
        {!selectedChatId ? (
          /* CHATS LIST VIEW INITIAL */
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header layout */}
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Messages</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full">
                Active Now
              </span>
            </div>

            {/* Search inputs bar */}
            <div className="px-4 pb-3">
              <div className={`relative flex items-center rounded-2xl border ${
                darkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <Search size={15} className="absolute left-3 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search direct messages..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Chats Dynamic List */}
            <div className="flex-1 overflow-y-auto divide-y divide-zinc-200 dark:divide-zinc-800/60">
              {filteredChats.map((chat) => {
                const lastMsg = chat.messages[chat.messages.length - 1];
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={`w-full px-4 py-3.5 flex items-center gap-3 border-none text-left transition-colors cursor-pointer ${
                      darkMode ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* User Avatar with online pulse dot */}
                    <div className="relative">
                      <img 
                        src={chat.user.avatar} 
                        alt={chat.user.displayName} 
                        className="w-11 h-11 rounded-full object-cover shadow-sm"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 bg-green-500"></span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold tracking-tight truncate">
                          {chat.user.displayName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {lastMsg ? lastMsg.timestamp : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">
                        {lastMsg ? lastMsg.text : 'Start chatting!'}
                      </p>
                    </div>

                    {chat.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                        {chat.unreadCount}
                      </span>
                    )}

                  </button>
                );
              })}

              {filteredChats.length === 0 && (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  No conversations match your search.
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          /* INDIVIDUAL CHAT DETAILS VIEW */
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header for detail chat with Caller buttons */}
            <div className={`p-3 border-b flex items-center justify-between transition-colors ${
              darkMode ? 'border-zinc-800 bg-zinc-900/60' : 'border-slate-100 bg-slate-50'
            }`}>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedChatId(null)}
                  className="p-1 px-1.5 rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
                
                {/* Clicking on User Info on header */}
                <div 
                  className="flex items-center gap-2.5 cursor-pointer hover:opacity-85" 
                  onClick={() => onUserClick(activeChat!.user)}
                >
                  <img 
                    src={activeChat?.user.avatar} 
                    alt={activeChat?.user.displayName} 
                    className="w-8.5 h-8.5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs font-semibold leading-none text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]">
                      {activeChat?.user.displayName}
                    </h3>
                    <span className="text-[9px] text-green-500 font-medium">Online</span>
                  </div>
                </div>

              </div>

              {/* Call Initiation Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onInitiateCall(activeChat!.user, 'audio')}
                  className="p-2 text-zinc-400 hover:text-indigo-500 hover:bg-zinc-800/40 rounded-xl cursor-pointer transition-colors"
                  title="Audio call"
                >
                  <Phone size={15} />
                </button>
                <button
                  onClick={() => onInitiateCall(activeChat!.user, 'video')}
                  className="p-2 text-indigo-500 hover:text-white bg-indigo-500/10 hover:bg-indigo-600 rounded-xl cursor-pointer transition-colors"
                  title="Video call"
                >
                  <Video size={15} />
                </button>
              </div>

            </div>

            {/* Infinite Chat Messages panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {activeChat?.messages.map((m: Message) => {
                const isMe = m.senderId === 'self';
                return (
                  <div 
                    key={m.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : darkMode 
                          ? 'bg-zinc-800 text-zinc-100 rounded-tl-none' 
                          : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      <p>{m.text}</p>
                      
                      <div className="flex items-center justify-end gap-1.5 mt-1 select-none">
                        <span className={`text-[8px] font-mono ${isMe ? 'text-indigo-200' : 'text-zinc-400'}`}>
                          {m.timestamp}
                        </span>
                        {isMe && <CheckCheck size={11} className="text-indigo-200" />}
                      </div>

                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start">
                  <div className={`rounded-xl p-3 text-xs flex items-center gap-1.5 ${
                    darkMode ? 'bg-zinc-800' : 'bg-slate-100'
                  }`}>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Send Message Footer Area widget */}
            <form onSubmit={handleMessageSubmit} className={`p-3 border-t flex gap-2 items-center ${
              darkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-slate-100 bg-white'
            }`}>
              
              <button 
                type="button" 
                className="p-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                onClick={() => setInputText(prev => prev + " 📱")}
              >
                <Smile size={16} />
              </button>

              <input
                type="text"
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={`flex-1 px-3.5 py-2 text-xs rounded-xl outline-none border transition-all ${
                  darkMode 
                    ? 'bg-zinc-900 border-zinc-850 focus:border-indigo-500 text-white' 
                    : 'bg-slate-100 border-slate-200 focus:border-indigo-600 text-slate-800'
                }`}
              />

              <button
                type="submit"
                className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 active:scale-95 cursor-pointer text-xs transition-transform"
              >
                <Send size={13} />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
