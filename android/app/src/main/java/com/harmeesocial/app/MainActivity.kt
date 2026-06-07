package com.harmeesocial.app

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)

        // Handle view insets for proper layout
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        setupWebView()
        loadWebContent()
    }

    private fun setupWebView() {
        val webSettings: WebSettings = webView.settings
        
        // Enable JavaScript
        webSettings.javaScriptEnabled = true
        
        // Enable DOM storage for local storage
        webSettings.domStorageEnabled = true
        
        // Enable database for offline support
        webSettings.databaseEnabled = true
        
        // Configure cache
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        
        // Allow media playback without user gesture
        webSettings.mediaPlaybackRequiresUserGesture = false
        
        // Mixed content policy for HTTPS/HTTP
        webSettings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        
        // User agent
        webSettings.userAgentString = "HarmeeSocial/1.0 (Android)"
        
        // Enable zoom
        webSettings.builtInZoomControls = true
        webSettings.displayZoomControls = false
        
        // Viewport settings
        webSettings.useWideViewPort = true
        webSettings.loadWithOverviewMode = true

        // Set WebViewClient for handling navigation
        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                progressBar.progress = 0
                progressBar.visibility = android.view.View.VISIBLE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                progressBar.visibility = android.view.View.GONE
            }
        }

        // Set WebChromeClient for handling progress and dialogs
        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                super.onProgressChanged(view, newProgress)
                progressBar.progress = newProgress
            }

            override fun onReceivedTitle(view: WebView?, title: String?) {
                super.onReceivedTitle(view, title)
                this@MainActivity.title = title
            }
        }
    }

    private fun loadWebContent() {
        // Try to load from local assets first
        try {
            webView.loadUrl("file:///android_asset/www/index.html")
        } catch (e: Exception) {
            // Fallback to a local HTML page
            val html = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Harmee Social</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: #fff;
                        }
                        .container {
                            text-align: center;
                            padding: 20px;
                            max-width: 500px;
                        }
                        h1 {
                            font-size: 2.5em;
                            margin-bottom: 10px;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                        }
                        p {
                            font-size: 1.1em;
                            margin-bottom: 30px;
                            opacity: 0.9;
                        }
                        .features {
                            display: grid;
                            gap: 15px;
                            margin: 30px 0;
                        }
                        .feature {
                            background: rgba(255,255,255,0.1);
                            padding: 15px;
                            border-radius: 10px;
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(255,255,255,0.2);
                        }
                        .feature h3 {
                            margin-bottom: 5px;
                            font-size: 1.1em;
                        }
                        .feature p {
                            font-size: 0.9em;
                            margin: 0;
                        }
                        .status {
                            background: rgba(0,255,0,0.1);
                            border: 1px solid #4ade80;
                            color: #4ade80;
                            padding: 10px;
                            border-radius: 5px;
                            margin-top: 20px;
                            font-size: 0.9em;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🎉 Harmee Social</h1>
                        <p>Next-Generation Social Networking Platform</p>
                        
                        <div class="features">
                            <div class="feature">
                                <h3>📹 Video Sharing</h3>
                                <p>Share and discover amazing video content</p>
                            </div>
                            <div class="feature">
                                <h3>💬 Messaging</h3>
                                <p>Connect with friends in real-time</p>
                            </div>
                            <div class="feature">
                                <h3>👥 Communities</h3>
                                <p>Join and create communities around your interests</p>
                            </div>
                            <div class="feature">
                                <h3>⚡ Real-Time Engagement</h3>
                                <p>Stay connected with live updates and notifications</p>
                            </div>
                        </div>
                        
                        <div class="status">
                            ✓ App loaded successfully<br>
                            Version: 1.0.0 Debug Build
                        </div>
                    </div>
                </body>
                </html>
            """.trimIndent()
            
            webView.loadData(html, "text/html", "UTF-8")
        }
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
