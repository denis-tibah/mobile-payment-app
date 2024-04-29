import { View, TouchableWithoutFeedback, Image } from "react-native";
import { styles } from "./styles";
import Avatar from "../Avatar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "../../redux/profile/profileSlice";
import { useRoute } from "@react-navigation/native";
import ZazooIcon from "../../assets/icons/Zazoo";

export function Header({ navigation }: any): any {
  const auth = useSelector((state: any) => state.auth);
  const profileData = useSelector((state: any) => state.profile?.profile)?.data;

  const route = useRoute();

  useEffect(() => {
    if (auth?.data?.access_token) {
      dispatch<any>(getProfile());
    }
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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {auth?.isAuthenticated && (
          <View style={styles.actions}>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("profile")}
            >
              <View style={styles.action__iconMargin}>
                <Avatar
                  isBase64Image
                  src={profileData?.userProfile?.profileimage}
                  fileUpload
                  borderColor={route.name === "profile" ? "#E7038E" : "#ddebff"}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        {/* <View style={styles.iconContainer}>
          <ZazooIcon size={14} />
        </View> */}
      </View>
    </View>
  );
}
