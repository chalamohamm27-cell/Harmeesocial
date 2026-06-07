package com.harmee.social

import android.app.Application
import com.google.firebase.FirebaseApp

class HarmeeApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Firebase on app startup
        try {
            FirebaseApp.initializeApp(this)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
