package com.harmee.social.presentation.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PlayCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.harmee.social.domain.model.Chat
import com.harmee.social.domain.model.User
import com.harmee.social.domain.model.VideoPost
import com.harmee.social.presentation.chat.ChatScreen
import com.harmee.social.presentation.feed.FeedScreen
import com.harmee.social.presentation.profile.ProfileScreen

sealed class Screen(val route: String, val title: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Feed : Screen("feed", "Reels", Icons.Default.PlayCircle)
    object Chat : Screen("chat", "Chat", Icons.Default.Chat)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
}

@Composable
fun MainAppShell(
    currentUser: User,
    videosList: List<VideoPost>,
    chatsList: List<Chat>,
    onLikeToggle: (String) -> Unit,
    onAddComment: (String, String) -> Unit,
    onSendMessage: (String, String) -> Unit,
    onEditProfile: (String, String) -> Unit,
    onLogout: () -> Unit
) {
    val navController = rememberNavController()
    val screens = listOf(Screen.Feed, Screen.Chat, Screen.Profile)

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                screens.forEach { screen ->
                    NavigationBarItem(
                        selected = currentRoute == screen.route,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = { Icon(imageVector = screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = colorSchemePrimary(),
                            unselectedIconColor = Color.Gray,
                            selectedTextColor = colorSchemePrimary(),
                            unselectedTextColor = Color.Gray
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Feed.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Feed.route) {
                FeedScreen(
                    videosList = videosList,
                    onLikeToggle = onLikeToggle,
                    onAddComment = onAddComment,
                    onLogout = onLogout
                )
            }
            composable(Screen.Chat.route) {
                ChatScreen(
                    chatsList = chatsList,
                    onSendMessage = onSendMessage,
                    currentUserId = currentUser.id
                )
            }
            composable(Screen.Profile.route) {
                ProfileScreen(
                    user = currentUser,
                    onLogout = onLogout,
                    onEditProfile = onEditProfile
                )
            }
        }
    }
}

@Composable
fun colorSchemePrimary() = MaterialTheme.colorScheme.primary
