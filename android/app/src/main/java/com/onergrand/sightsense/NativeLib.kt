package com.onergrand.sightsense

object NativeLib {
    init {
        System.loadLibrary("mynative") // Имя вашей библиотеки
    }

    // Объявляем нативные функции
    @JvmStatic external fun stereo(processedImage: DoubleArray)
    @JvmStatic external fun binaural(leftImage: DoubleArray, rightImage: DoubleArray)
}
