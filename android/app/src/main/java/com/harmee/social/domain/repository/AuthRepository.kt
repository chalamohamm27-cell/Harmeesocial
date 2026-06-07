package com.harmee.social.domain.repository

import com.harmee.social.domain.model.User
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    val currentUserFlow: Flow<User?>
    
    suspend fun signInWithEmailAndPassword(email: String, password: String): Result<User>
    
    suspend fun signUpWithEmailAndPassword(
        email: String, 
        password: String, 
        username: String, 
        displayName: String
    ): Result<User>
    
    suspend fun signOut()
}
