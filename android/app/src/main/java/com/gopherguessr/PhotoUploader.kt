package com.gopherguessr

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

object PhotoUploader {
    // TODO: Replace with actual app auth key
    private const val APP_AUTH_KEY = "YOUR_APP_AUTH_KEY"
    private const val UPLOAD_URL = "https://gopher.nimbus.page/api_upload"
    
    private val client = OkHttpClient()

    fun upload(
        base64: String,
        latitude: Double,
        longitude: Double,
        onSuccess: () -> Unit,
        onError: (String) -> Unit
    ) {
        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("appAuthKey", APP_AUTH_KEY)
            .addFormDataPart("name", "TEST FROM ANDROID APP")
            .addFormDataPart("campus", "EastBankCore")
            .addFormDataPart("difficulty", "ONE")
            .addFormDataPart("indoors", "Yes")
            .addFormDataPart("base64", base64)
            .addFormDataPart("latitude", latitude.toString())
            .addFormDataPart("longitude", longitude.toString())
            .build()

        val request = Request.Builder()
            .url(UPLOAD_URL)
            .post(requestBody)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                onError(e.message ?: "Unknown error")
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    onSuccess()
                } else {
                    onError("Server error: ${response.code}")
                }
            }
        })
    }
}
