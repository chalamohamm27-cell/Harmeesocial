import { User, Video, Chat } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_sarah',
    username: 'sarah_spark',
    displayName: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Digital artist & wanderer 🎨 | Living life one pixel at a time. Tap follow for daily visual inspiration!',
    followersCount: 14200,
    followingCount: 312,
    isFollowing: true,
    postsCount: 54
  },
  {
    id: 'user_alex',
    username: 'alex_adventures',
    displayName: 'Alex Rivers',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Adrenaline junkie 🏔️ | Exploring the highest peaks and deepest valleys. Join the adventure!',
    followersCount: 8900,
    followingCount: 540,
    isFollowing: false,
    postsCount: 120
  },
  {
    id: 'user_elena',
    username: 'elena_bakes',
    displayName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Professional pastry chef 👩‍🍳 | Baking sweetness into your feed. Gluten-full and proud!',
    followersCount: 25400,
    followingCount: 198,
    isFollowing: false,
    postsCount: 89
  },
  {
    id: 'user_marcus',
    username: 'marcus_beats',
    displayName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'Sound designer & electronic music producer 🎧 | Crafting synthesized vibes for the soul. Check out my new single!',
    followersCount: 3100,
    followingCount: 420,
    isFollowing: true,
    postsCount: 37
  },
  {
    id: 'user_lucas',
    username: 'lucas_code',
    displayName: 'Lucas Miller',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    bio: 'Fullstack Developer 💻 | Coffee runs in my veins. Writing clean code and teaching others.',
    followersCount: 18700,
    followingCount: 612,
    isFollowing: false,
    postsCount: 204
  }
];

export const MOCK_VIDEOS: Video[] = [
  {
    id: 'video_1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-in-tokyo-39871-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&q=80',
    caption: 'Lost in the mesmerizing neon streets of Tokyo 🇯🇵✨ The vibe here at midnight is absolutely unreal.',
    user: MOCK_USERS[0],
    likesCount: 3421,
    viewsCount: 12500,
    commentsCount: 284,
    sharesCount: 110,
    isLiked: false,
    isShared: false,
    tags: ['tokyo', 'neonvibes', 'travelreels', 'cyberpunk'],
    comments: [
      {
        id: 'c1',
        username: 'alex_adventures',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        text: 'This is incredible! Which street is this?',
        timestamp: '2h ago'
      },
      {
        id: 'c2',
        username: 'elena_bakes',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        text: 'The colors are so dreamy. Reminds me of a pastel cake 🍰',
        timestamp: '5h ago'
      },
      {
        id: 'c3',
        username: 'marcus_beats',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        text: 'I can hear a deep lo-fi beat playing over this in my head.',
        timestamp: '1d ago'
      }
    ]
  },
  {
    id: 'video_2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-neon-lights-40010-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&q=80',
    caption: 'Improvising under the neon glow. Music frees the body and the soul 🕺🎧 Vibing with Marcus Vance\'s track.',
    user: MOCK_USERS[3],
    likesCount: 1845,
    viewsCount: 8900,
    commentsCount: 92,
    sharesCount: 45,
    isLiked: false,
    isShared: false,
    tags: ['dance', 'freestyle', 'neonlights', 'beats'],
    comments: [
      {
        id: 'c4',
        username: 'sarah_spark',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        text: 'The lighting sync is pure masterclass! 🔥',
        timestamp: '1h ago'
      },
      {
        id: 'c5',
        username: 'lucas_code',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        text: 'Those moves are fluid! Respect.',
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: 'video_3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-42330-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=500&q=80',
    caption: 'Spring has officially arrived! 🌸 Spending my morning capturing these gorgeous yellow blossoms.',
    user: MOCK_USERS[2],
    likesCount: 4912,
    viewsCount: 22100,
    commentsCount: 412,
    sharesCount: 189,
    isLiked: false,
    isShared: false,
    tags: ['nature', 'spring', 'cinematic', 'peaceful'],
    comments: [
      {
        id: 'c6',
        username: 'sarah_spark',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        text: 'So therapeutic to watch this on loop.',
        timestamp: '10m ago'
      },
      {
        id: 'c7',
        username: 'alex_adventures',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        text: 'The color grading is spot on.',
        timestamp: '8h ago'
      }
    ]
  },
  {
    id: 'video_4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-1527-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=500&q=80',
    caption: 'Finding peace in the constant motion of the waves 🌊 Captured this stunning turquoise swell.',
    user: MOCK_USERS[1],
    likesCount: 8201,
    viewsCount: 45600,
    commentsCount: 618,
    sharesCount: 430,
    isLiked: false,
    isShared: false,
    tags: ['ocean', 'aerial', 'waves', 'moodyblue'],
    comments: [
      {
        id: 'c8',
        username: 'lucas_code',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        text: 'Makes me want to pack my bags and head for the beach right now.',
        timestamp: '4h ago'
      },
      {
        id: 'c9',
        username: 'elena_bakes',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        text: 'Wow, nature is the ultimate designer! Beautiful.',
        timestamp: '11h ago'
      }
    ]
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_sarah',
    user: MOCK_USERS[0],
    unreadCount: 2,
    messages: [
      {
        id: 'm1',
        senderId: 'user_sarah',
        text: 'Hey there! Loved your feedback on my Tokyo neon video!',
        timestamp: '07:22 PM'
      },
      {
        id: 'm2',
        senderId: 'user_sarah',
        text: 'I\'m currently working on a cyberpunk-themed photo edit. Would you like to see a sneak peek?',
        timestamp: '07:23 PM'
      }
    ]
  },
  {
    id: 'chat_marcus',
    user: MOCK_USERS[3],
    unreadCount: 0,
    messages: [
      {
        id: 'm3',
        senderId: 'self',
        text: 'Hey Marcus, that freestyle dance video looked awesome!',
        timestamp: '03:15 PM'
      },
      {
        id: 'm4',
        senderId: 'user_marcus',
        text: 'Appreciate it! The tracks are releasing soon. Let me know if you want access to the high-quality masters.',
        timestamp: '03:18 PM'
      },
      {
        id: 'm5',
        senderId: 'self',
        text: 'Absolutely, sign me up!',
        timestamp: '03:20 PM'
      }
    ]
  },
  {
    id: 'chat_alex',
    user: MOCK_USERS[1],
    unreadCount: 0,
    messages: [
      {
        id: 'm6',
        senderId: 'user_alex',
        text: 'Are you joining the hiking meetup this weekend?',
        timestamp: 'Yesterday'
      },
      {
        id: 'm7',
        senderId: 'self',
        text: 'Depending on the weather check! Where are we heading?',
        timestamp: 'Yesterday'
      },
      {
        id: 'm8',
        senderId: 'user_alex',
        text: 'Blue Pine trail. It\'s about 12km with stunning scenic views. Let me know by Thursday!',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  targetText?: string;
  timestamp: string;
  read: boolean;
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'follow',
    user: MOCK_USERS[4],
    timestamp: '5m',
    read: false
  },
  {
    id: 'notif_2',
    type: 'like',
    user: MOCK_USERS[2],
    targetText: 'your comment "The pastel colors are amazing!"',
    timestamp: '2h',
    read: false
  },
  {
    id: 'notif_3',
    type: 'comment',
    user: MOCK_USERS[0],
    targetText: 'Love how clean the Android style interface looks.',
    timestamp: '3h',
    read: false
  }
];
