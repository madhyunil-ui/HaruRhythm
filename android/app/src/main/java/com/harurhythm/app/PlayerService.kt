package com.harurhythm.app

import android.os.Bundle
import android.support.v4.media.MediaBrowserCompat
import androidx.media.MediaBrowserServiceCompat
import java.util.Collections

class PlayerService : MediaBrowserServiceCompat() {

    override fun onCreate() {
        super.onCreate()
        // Here we will eventually initialize the media session
    }

    override fun onGetRoot(
        clientPackageName: String,
        clientUid: Int,
        rootHints: Bundle?
    ): BrowserRoot? {
        // Return a non-null root to allow connection
        return BrowserRoot("root", null)
    }

    override fun onLoadChildren(
        parentId: String,
        result: MediaBrowserServiceCompat.Result<MutableList<MediaBrowserCompat.MediaItem>>
    ) {
        // Return empty list/result for now
        result.sendResult(null)
    }
}
