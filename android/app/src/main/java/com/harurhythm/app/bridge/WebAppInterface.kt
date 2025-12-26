package com.harurhythm.app.bridge

import android.app.Activity
import android.webkit.JavascriptInterface
import android.widget.Toast
import com.harurhythm.app.ads.AdRewardManager

class WebAppInterface(private val activity: Activity) {

    @JavascriptInterface
    fun showRewardAd() {
        activity.runOnUiThread {
            AdRewardManager.showAd(activity) {
                // On Reward Earned
                Toast.makeText(activity, "보상이 지급되었습니다! \uD83C\uDF89", Toast.LENGTH_SHORT).show()
                
                // Optional: Notify web back via WebView evaluation if needed
                // activity.bridge.webView.evaluateJavascript("window.onRewardEarned()", null)
            }
        }
    }
}
