package com.harmee.social.domain.model

data class User(
    val id: String,
    val username: String,
    val displayName: String,
    val avatarUrl: String,
    val bio: String = "",
    val followersCount: Int = 0,
    val followingCount: Int = 0,
    val postsCount: Int = 0,
    val isFollowing: Boolean = false
)

data class Comment(
    val id: String,
    val username: String,
    val avatarUrl: String,
    val text: String,
    val timestamp: String
)

data class VideoPost(
    val id: String,
    val videoUrl: String,
    val username: String,
    val avatarUrl: String,
    val title: String,
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val sharesCount: Int = 0,
    val isLiked: Boolean = false,
    val comments: List<Comment> = emptyList()
)

data class ChatMessage(
    val id: String,
    val senderId: String,
    val text: String,
    val timestamp: String,
    val isRead: Boolean = false
)

data class Chat(
    val id: String,
    val participant: User,
    val lastMessage: String,
    val messages: List<ChatMessage> = emptyList(),
    val unreadCount: Int = 0
)
