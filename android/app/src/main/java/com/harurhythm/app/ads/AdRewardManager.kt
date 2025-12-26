package com.harurhythm.app.ads

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

object AdRewardManager {
    private const val TAG = "AdRewardManager"
    // Test Ad Unit ID for Rewarded Video
    private const val AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917"

    private var rewardedAd: RewardedAd? = null
    private var isLoading = false

    fun initialize(context: Context) {
        MobileAds.initialize(context) { }
        loadAd(context)
    }

    fun loadAd(context: Context) {
        if (isLoading || rewardedAd != null) return

        isLoading = true
        val adRequest = AdRequest.Builder().build()

        RewardedAd.load(context, AD_UNIT_ID, adRequest, object : RewardedAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) {
                Log.d(TAG, adError.toString())
                rewardedAd = null
                isLoading = false
            }

            override fun onAdLoaded(ad: RewardedAd) {
                Log.d(TAG, "Ad was loaded.")
                rewardedAd = ad
                isLoading = false
                
                rewardedAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        Log.d(TAG, "Ad dismissed fullscreen content.")
                        rewardedAd = null
                        loadAd(context) // Preload next ad
                    }

                    override fun onAdFailedToShowFullScreenContent(p0: AdError) {
                         Log.d(TAG, "Ad failed to show fullscreen content.")
                         rewardedAd = null
                    }
                }
            }
        })
    }

    fun showAd(activity: Activity, onReward: () -> Unit) {
        rewardedAd?.let { ad ->
            ad.show(activity) { rewardItem ->
                // Handle the reward.
                Log.d(TAG, "User earned the reward.")
                onReward()
            }
        } ?: run {
            Log.d(TAG, "The rewarded ad wasn't ready yet.")
            // Retry loading if creating an empty state
            loadAd(activity)
        }
    }
}
