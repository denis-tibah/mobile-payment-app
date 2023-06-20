import { View, TouchableWithoutFeedback, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { styles } from "./styles";
import Avatar from "../Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../../redux/profile/profileSlice";
import { SubMenu } from "../SubMenu/SubMenu";
import { useRoute } from "@react-navigation/native";

export function Header({ navigation }: any): any {
  const auth = useSelector((state: any) => state.auth);
  const profileData = useSelector((state: any) => state.profile?.profile)?.data;
  const route = useRoute();

  useEffect(() => {
    dispatch<any>(getProfile());
  }, []);

  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <View>
        <Image
          style={{ height: 30, width: 125 }}
          source={require("../../assets/images/ZazooLogo.png")}
        />
      </View>
      {auth?.isAuthenticated && (
        <View style={styles.actions}>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("profile")}
          >
            <View style={styles.action__iconMargin}>
              <Avatar
                isBase64Image
                src={profileData?.UserProfile?.profileimage}
                fileUpload
                borderColor={route.name === "profile" ? "#E7038E" : "#ddebff"}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      )}
      {/* <SubMenu navigation={navigation} /> */}
    </View>
  );
}
