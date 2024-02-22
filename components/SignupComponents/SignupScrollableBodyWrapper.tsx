import {
  View,
  Dimensions,
  ScrollView,
  Pressable,
  SafeAreaView,
} from "react-native";

const SignupScrollableBodyWrapper = ({ children }: any) => {
  const windowDimensionsHeight = Dimensions.get("window").height - 395;
  return (
    <View style={{ height: windowDimensionsHeight }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView bounces={false} nestedScrollEnabled style={{ flexGrow: 1 }}>
          <Pressable>{children}</Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SignupScrollableBodyWrapper;
