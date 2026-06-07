export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  postsCount: number;
}

export interface Comment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface Video {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  user: User;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isShared: boolean;
  tags: string[];
  comments: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  user: User;
  messages: Message[];
  unreadCount: number;
}

export type CallStage = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
export type CallType = 'audio' | 'video';

export interface CallSession {
  id: string;
  user: User;
  type: CallType;
  stage: CallStage;
  duration: number; // in seconds
  isMuted: boolean;
  isCameraOff: boolean;
}
