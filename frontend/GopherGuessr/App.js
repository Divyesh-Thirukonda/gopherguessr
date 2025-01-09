import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from "react-native-webview";

export default function App() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "file:///path-to-your-next-js-exported-index.html" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
