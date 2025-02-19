import { WebView } from "react-native-webview";
import Constants from "expo-constants";
import { StyleSheet, Linking } from "react-native";
import * as WebBrowser from "expo-web-browser";

export default function App() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: "https://gopher.nimbus.page" }}
      allowsInlineMediaPlayback={true}
      webviewDebuggingEnabled={true}
      javaScriptCanOpenWindowsAutomatically={true}
      onOpenWindow={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        const { targetUrl } = nativeEvent;
        WebBrowser.openBrowserAsync(targetUrl);
      }}
      userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
