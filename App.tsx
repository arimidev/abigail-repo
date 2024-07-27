import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import EntryRoute from "./src/routes/EntryRoute";
import { Provider } from "react-redux";
import { store } from "./src/redux_utils/store";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { NotifierWrapper } from "react-native-notifier";
import { DummyComp } from "./src/components/DummyComp";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    medium: require("./assets/fonts/Poppins/Poppins-Regular.ttf"),
    bold: require("./assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    semi_bold: require("./assets/fonts/Poppins/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return <DummyComp />;
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Provider store={store}>
          <NotifierWrapper>
            <NavigationContainer>
              <EntryRoute />
            </NavigationContainer>
          </NotifierWrapper>
        </Provider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
