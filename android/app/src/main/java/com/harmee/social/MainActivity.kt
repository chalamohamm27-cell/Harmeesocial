package com.harmee.social

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import com.google.firebase.auth.FirebaseAuth
import com.harmee.social.data.repository.AuthRepositoryImpl
import com.harmee.social.domain.model.Chat
import com.harmee.social.domain.model.ChatMessage
import com.harmee.social.domain.model.Comment
import com.harmee.social.domain.model.User
import com.harmee.social.domain.model.VideoPost
import com.harmee.social.domain.repository.AuthRepository
import com.harmee.social.presentation.auth.AuthScreen
import com.harmee.social.presentation.navigation.MainAppShell
import com.harmee.social.presentation.theme.HarmeeSocialTheme
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private val authRepository: AuthRepository by lazy {
        AuthRepositoryImpl(FirebaseAuth.getInstance())
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            HarmeeSocialTheme {
                val currentUserState = authRepository.currentUserFlow.collectAsState(initial = null)
                val user = currentUserState.value

                var videosList by remember { mutableStateOf(getMockVideos()) }
                var chatsList by remember { mutableStateOf(getMockChats()) }

                val coroutineScope = rememberCoroutineScope()

                Surface {
                    if (user == null) {
                        AuthScreen(
                            authRepository = authRepository,
                            onAuthSuccess = { /* Autoredired via AuthState Flow */ }
                        )
                    } else {
                        MainAppShell(
                            currentUser = user,
                            videosList = videosList,
                            chatsList = chatsList,
                            onLikeToggle = { videoId ->
                                videosList = videosList.map { video ->
                                    if (video.id == videoId) {
                                        val nextLiked = !video.isLiked
                                        video.copy(
                                            isLiked = nextLiked,
                                            likesCount = if (nextLiked) video.likesCount + 1 else video.likesCount - 1
                                        )
                                    } else video
                                }
                            },
                            onAddComment = { videoId, text ->
                                val newComment = Comment(
                                    id = "com_${System.currentTimeMillis()}",
                                    username = user.username,
                                    avatarUrl = "avatar_1",
                                    text = text,
                                    timestamp = "Just now"
                                )
                                videosList = videosList.map { video ->
                                    if (video.id == videoId) {
                                        video.copy(
                                            comments = listOf(newComment) + video.comments,
                                            commentsCount = video.commentsCount + 1
                                        )
                                    } else video
                                }
                            },
                            onSendMessage = { chatId, text ->
                                val newMessage = ChatMessage(
                                    id = "msg_${System.currentTimeMillis()}",
                                    senderId = user.id,
                                    text = text,
                                    timestamp = "10:15 PM"
                                )
                                chatsList = chatsList.map { chat ->
                                    if (chat.id == chatId) {
                                        chat.copy(
                                            messages = chat.messages + newMessage,
                                            lastMessage = text
                                        )
                                    } else chat
                                }
                            },
                            onEditProfile = { newDisplayName, newBio ->
                                // Local state preview handler is updated
                            },
                            onLogout = {
                                coroutineScope.launch {
                                    authRepository.signOut()
                                }
                            }
                        )
                    }
                }
            }
        }
    }

    private fun getMockVideos(): List<VideoPost> {
        return listOf(
            VideoPost(
                id = "v_1",
                videoUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600",
                username = "glitch_hunter",
                avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                title = "Exploring the cyber alleyway in downtown Neo-Seoul! Overwhelming holographic setups today. #cyberpunk #aesthetic",
                likesCount = 1420,
                commentsCount = 82,
                sharesCount = 114,
                comments = listOf(
                    Comment("c_1", "pixel_craft", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", "This matches my mood perfectly!", "1h ago"),
                    Comment("c_2", "tokyo_rider", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", "What camera lens did you use?", "3h ago")
                )
            ),
            VideoPost(
                id = "v_2",
                videoUrl = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600",
                username = "retro_arcade",
                avatarUrl = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
                title = "Just booted up this rare 1982 vector graphic cabinet! The sound chip is pristine. #vintage #gaming",
                likesCount = 980,
                commentsCount = 45,
                sharesCount = 68,
                comments = listOf(
                    Comment("c_3", "sound_wave", "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100", "Incredible sound! Pure nostalgia.", "45m ago")
                )
            )
        )
    }

    private fun getMockChats(): List<Chat> {
        val companionUser = User(
            id = "user_sarah",
            username = "sarah_k",
            displayName = "Sarah Jenkins",
            avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120",
            bio = "Visual designer & traveler 🗺️"
        )
        return listOf(
            Chat(
                id = "chat_1",
                participant = companionUser,
                lastMessage = "Let's catch up tomorrow for the project review!",
                messages = listOf(
                    ChatMessage("m_1", "user_sarah", "Hey there! Ready for the brainstorm tomorrow?", "10:05 PM"),
                    ChatMessage("m_2", "sim_user_host", "Definitely! I prepared the wireframes and components already.", "10:10 PM"),
                    ChatMessage("m_3", "user_sarah", "Excellent! Let's catch up tomorrow for the project review!", "10:11 PM")
                ),
                unreadCount = 1
            )
        )
    }
}
