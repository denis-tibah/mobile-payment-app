import { View, Text, Button, ImageBackground, Image } from "react-native";

import Typography from "../../components/Typography";
import { styles } from "./styles";

export const ErrorFallback = (props: {
  error: Error;
  resetError: Function;
  navigation: any;
}) => (
  <ImageBackground
    style={{ height: "100%" }}
    source={require("../../assets/images/bg.png")}
    resizeMode="cover"
  >
    <View style={styles.header}>
      <Image
        style={{ height: 30, width: 125 }}
        source={require("../../assets/images/ZazooLogo.png")}
      />
    </View>
    <View
      style={{
        height: "85%",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <View style={styles.container}>
        <View style={{ marginBottom: 20 }}>
          <Typography
            fontSize={26}
            fontFamily="Nunito-SemiBold"
            fontWeight="800"
          >
            Something happened!
          </Typography>
        </View>
        <View style={{ marginBottom: 14 }}>
          <Typography fontSize={18} fontWeight="600">
            {props.error.toString()}
          </Typography>
        </View>
        <Button onPress={props.resetError} title={"Try again"} />
      </View>
    </View>
  </ImageBackground>
);
