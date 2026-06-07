package com.harmee.social.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseAuthUserCollisionException
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException
import com.harmee.social.domain.model.User
import com.harmee.social.domain.repository.AuthRepository
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class AuthRepositoryImpl(
    private val firebaseAuth: FirebaseAuth = FirebaseAuth.getInstance()
) : AuthRepository {

    override val currentUserFlow: Flow<User?> = callbackFlow {
        val listener = FirebaseAuth.AuthStateListener { auth ->
            val firebaseUser = auth.currentUser
            if (firebaseUser != null) {
                trySend(
                    User(
                        id = firebaseUser.uid,
                        username = firebaseUser.displayName?.replace("\\s+".toRegex(), "_")?.lowercase() ?: "user_${firebaseUser.uid.take(5)}",
                        displayName = firebaseUser.displayName ?: firebaseUser.email?.substringBefore("@") ?: "Socialite",
                        avatarUrl = "avatar_1", // Default avatar
                        bio = "Adventures start here! 💫"
                    )
                )
            } else {
                trySend(null)
            }
        }
        firebaseAuth.addAuthStateListener(listener)
        awaitClose {
            firebaseAuth.removeAuthStateListener(listener)
        }
    }

    override suspend fun signInWithEmailAndPassword(email: String, password: String): Result<User> = suspendCoroutine { continuation ->
        firebaseAuth.signInWithEmailAndPassword(email, password)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val firebaseUser = task.isResult?.user
                    if (firebaseUser != null) {
                        continuation.resume(
                            Result.success(
                                User(
                                    id = firebaseUser.uid,
                                    username = firebaseUser.displayName?.replace("\\s+".toRegex(), "_")?.lowercase() ?: "user_${firebaseUser.uid.take(5)}",
                                    displayName = firebaseUser.displayName ?: firebaseUser.email?.substringBefore("@") ?: "Socialite",
                                    avatarUrl = "avatar_1",
                                    bio = "Adventures start here! 💫"
                                )
                            )
                        )
                    } else {
                        continuation.resume(Result.failure(Exception("Email or password is incorrect")))
                    }
                } else {
                    val exception = task.exception
                    val errorMessage = if (exception is FirebaseAuthInvalidCredentialsException) {
                        "Email or password is incorrect"
                    } else {
                        "Email or password is incorrect" // Broad matching requirement
                    }
                    continuation.resume(Result.failure(Exception(errorMessage)))
                }
            }
    }

    override suspend fun signUpWithEmailAndPassword(
        email: String,
        password: String,
        username: String,
        displayName: String
    ): Result<User> = suspendCoroutine { continuation ->
        firebaseAuth.createUserWithEmailAndPassword(email, password)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    val firebaseUser = task.isResult?.user
                    if (firebaseUser != null) {
                        // User Profile update to set displayName
                        val profileUpdates = com.google.firebase.auth.userProfileChangeRequest {
                            setDisplayName(displayName)
                        }
                        firebaseUser.updateProfile(profileUpdates).addOnCompleteListener {
                            continuation.resume(
                                Result.success(
                                    User(
                                        id = firebaseUser.uid,
                                        username = username.replace("\\s+".toRegex(), "_").lowercase(),
                                        displayName = displayName,
                                        avatarUrl = "avatar_1",
                                        bio = "Adventures start here! 💫"
                                    )
                                )
                            )
                        }
                    } else {
                        continuation.resume(Result.failure(Exception("An authentication error occurred.")))
                    }
                } else {
                    val exception = task.exception
                    val errorMessage = if (exception is FirebaseAuthUserCollisionException) {
                        "User already exists. Please sign in"
                    } else {
                        exception?.localizedMessage ?: "An authentication error occurred."
                    }
                    continuation.resume(Result.failure(Exception(errorMessage)))
                }
            }
    }

    override suspend fun signOut() {
        firebaseAuth.signOut()
    }
}
