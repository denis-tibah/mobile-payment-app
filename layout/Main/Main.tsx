import { Platform } from "react-native"
import { useScrollToTop } from "@react-navigation/native"
import { useRef } from "react"
import { View, ImageBackground, StatusBar, SafeAreaView } from "react-native"
import Header from "../../components/Header"
import { setApiStore } from "../../api"
import { store } from "../../store"
import { signout } from "../../redux/auth/authSlice"
import { MenuProvider } from "react-native-popup-menu"

export function MainLayout({ children, navigation, showHeader = true }:any) {
  const screenContentRef:any = useRef()
  useScrollToTop(screenContentRef)
  setApiStore(store, signout)
  return (
    <>
    <MenuProvider skipInstanceCheck={true}>
      <ImageBackground
        style={{ height: "100%" }}
        source={require("../../assets/images/bg.png")}
        resizeMode="cover"
      >
        <SafeAreaView style={{ flex: 0, backgroundColor: "white" }} />
        <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "light-content"} />
        <View style={{ flexDirection: "column", flex: 1, }} ref={screenContentRef}>
          <View style={{ flex: 1 }} >
            {showHeader && <Header navigation={navigation} />}
            {children}
          </View>
        </View>
      </ImageBackground>
      </MenuProvider>
    </>
  )
}

