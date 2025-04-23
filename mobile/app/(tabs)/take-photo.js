// from: https://docs.expo.dev/router/installation/#quick-start

import { CameraView, CameraType, useCameraPermissions } from "expo-camera"
import { useState, useRef, useEffect } from "react"
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import axios from "axios"
import * as Location from "expo-location"
import { ImageManipulator, SaveFormat } from "expo-image-manipulator"

export default function App() {
  const [facing, setFacing] = useState("back")
  const [uploaded, setUploaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [permission, requestPermission] = useCameraPermissions()
  const cameraRef = useRef(null)

  useEffect(() => {
    async function getLocationPermissions() {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }
    }

    getLocationPermissions()
  }, [])

  if (!permission) {
    // Camera permissions are still loading.
    return <View />
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    )
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  async function upload() {
    try {
      setUploaded(false)
      setUploading(true)
      console.log("running...")
      const location = await Location.getCurrentPositionAsync({})
      const picture = await cameraRef.current.takePictureAsync({
        base64: true,
      })
      const context = await ImageManipulator.manipulate(picture.uri)
      context.resize({ width: 500 })
      const image = await context.renderAsync()
      const result = await image.saveAsync({
        format: SaveFormat.JPG,
        base64: true,
      })
      const form = new FormData()
      // TODO: CHANGE THIS BEFORE PUBLISH BECAUSE IT WILL BE IN PLAIN TEXT IN THE APP BUNDLE
      form.append("appAuthKey", process.env.EXPO_PUBLIC_APP_AUTH_KEY)
      form.append("name", "TEST FROM APP")
      form.append("campus", "EastBankCore")
      form.append("difficulty", "ONE")
      form.append("indoors", "Yes")
      form.append("base64", result.base64)
      form.append("latitude", location.coords.latitude)
      form.append("longitude", location.coords.longitude)
      const req = await axios.post(
        "https://gopher.nimbus.page/api_upload",
        form
      )
      console.log(req)
      setUploaded(true)
      setUploading(false)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <View style={styles.container}>
      {uploaded && <Text style={styles.success}>Uploaded successfully!</Text>}
      {uploading && <Text style={styles.inProgress}>Uploading...</Text>}
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={upload}>
            <Text style={styles.text}>Upload!</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  success: {
    fontSize: 32,
    fontWeight: "bold",
    color: "green",
    padding: 8,
    backgroundColor: "lightgreen",
    textAlign: "center",
  },
  inProgress: {
    fontSize: 32,
    fontWeight: "bold",
    color: "blue",
    padding: 8,
    backgroundColor: "lightblue",
    textAlign: "center",
  },
})
