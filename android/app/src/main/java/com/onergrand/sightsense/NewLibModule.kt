package com.onergrand.sightsense

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NewLibModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "NewLib"
    }

    @ReactMethod
    fun stereo(processedImage: DoubleArray) {
        NativeLib.stereo(processedImage)
    }

    @ReactMethod
    fun binaural(leftImage: DoubleArray, rightImage: DoubleArray) {
        NativeLib.binaural(leftImage, rightImage)
    }
}
