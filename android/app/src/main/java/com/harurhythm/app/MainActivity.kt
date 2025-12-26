package com.harurhythm.app

import android.os.Bundle
import com.getcapacitor.BridgeActivity
import com.harurhythm.app.bridge.WebAppInterface
import com.harurhythm.app.ads.AdRewardManager

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize AdMob
        // AdRewardManager.initialize(this)

        // Register JS Interface
        // 'this.bridge.webView' is available in BridgeActivity
        val webView = this.bridge.webView
        // webView.addJavascriptInterface(WebAppInterface(this), "Android")
    }
}
