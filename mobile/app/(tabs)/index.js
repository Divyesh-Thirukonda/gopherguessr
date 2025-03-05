import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

export default function App() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: "https://gopher.nimbus.page" }}
      allowsInlineMediaPlayback={true}
      webviewDebuggingEnabled={true}
      userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
