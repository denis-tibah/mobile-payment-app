import { useEffect, useState, useRef, Fragment } from "react";
import { View, TouchableWithoutFeedback, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

import { getProfile } from "../../redux/profile/profileSlice";
import { dateFunctions } from "../../utils/helpers";
import useGeneratePDF from "../../hooks/useGeneratePDF";
import { Seperator } from "../Seperator/Seperator";
import SwipableBottomSheet from "../SwipableBottomSheet";
import { styles } from "./styles";
import Avatar from "../Avatar";
import Typography from "../Typography";
import Button from "../Button";
import WholeContainer from "../../layout/WholeContainer";

export function Header({ navigation }: any): any {
  const auth = useSelector((state: any) => state.auth);
  const userId = auth?.userData?.id;

  const profileData = useSelector((state: any) => state.profile?.profile)?.data;

  const route = useRoute();
  const refRBSheet = useRef();

  const dispatch = useDispatch();

  const { handleSetDate, isGeneratingPDF, resetPDFParams } = useGeneratePDF();

  const {
    dateIsEqual,
    previousMonth,
    currentYear,
    previousMonthFirstDay,
    lastDateOfPrevMonth,
  } = dateFunctions();

  const [bottomSheetHeight, setBottomSheetHeight] = useState<number>(0);

  useEffect(() => {
    if (auth?.data?.access_token) {
      dispatch<any>(getProfile());
    }
  }, []);

  return (
    <Fragment>
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
              <View style={styles.action__iconMargin}>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate("profile")}
                >
                  <View>
                    <Avatar
                      isBase64Image
                      src={profileData?.userProfile?.profileimage}
                      fileUpload
                      borderColor={
                        route.name === "profile" ? "#E7038E" : "#ddebff"
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
                {/* FE implementation of statement alert with bell icon 05/16 */}
                {/* {dateIsEqual ? (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      refRBSheet?.current?.open();
                    }}
                  >
                    <View style={{ position: "absolute", top: -6, right: -5 }}>
                      <MaterialIcons
                        color="#E7038E"
                        size={20}
                        name={"notifications-active"}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : null} */}
              </View>
            </View>
          )}
        </View>
      </View>
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          resetPDFParams();
        }}
        wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: bottomSheetHeight + 45,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View
          style={{
            backgroundColor: "white",
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setBottomSheetHeight(height);
          }}
        >
          <WholeContainer>
            <View
              style={{
                paddingVertical: 6,
                marginBottom: 12,
              }}
            >
              <Typography
                fontWeight="600"
                fontSize={18}
                fontFamily="Nunito-SemiBold"
              >
                Your monthly statement is ready
              </Typography>
            </View>
          </WholeContainer>
          <Seperator backgroundColor={"#DDDDDD"} />
          <WholeContainer>
            <View style={{ paddingVertical: 32 }}>
              <Typography
                fontFamily="Mukta-Regular"
                fontSize={14}
                fontWeight={"400"}
                color="#696F7A"
                marginBottom={16}
              >
                You can download your{" "}
                <Typography
                  fontFamily="Mukta-Bold"
                  fontSize={14}
                  fontWeight={"700"}
                >
                  {previousMonth} {currentYear}
                </Typography>{" "}
                statement
              </Typography>
              <Button
                color="light-blue"
                onPress={() => {
                  handleSetDate({
                    previousMonthFirstDay,
                    lastDateOfPrevMonth,
                    userId,
                  });
                }}
                leftIcon={
                  <Feather color="#086AFB" size={16} name={"download"} />
                }
                disabled={isGeneratingPDF}
              >
                <Typography
                  fontWeight="600"
                  fontSize={16}
                  fontFamily="Nunito-SemiBold"
                >
                  {isGeneratingPDF
                    ? "Downloading..."
                    : "Download monthly statement"}
                </Typography>
              </Button>
            </View>
          </WholeContainer>
          <View style={styles.footerContent}>
            <View style={styles.downloadBtnMain}>
              <TouchableWithoutFeedback
                onPress={() => {
                  refRBSheet?.current?.close();
                  navigation.navigate("statements");
                }}
              >
                <View>
                  <Typography
                    fontFamily="Nunito-Regular"
                    fontSize={14}
                    fontWeight={"300"}
                    color="#E7038E"
                  >
                    Check your statements statement
                  </Typography>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
}
