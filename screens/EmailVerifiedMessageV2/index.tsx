import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
/* import { useDispatch, useSelector } from "react-redux"; */

/* import { getTransactions } from "../../redux/transaction/transactionSlice"; */
import { screenNames } from "../../utils/helpers";
/* import { Modal } from "../../components/Modal/Modal"; */
import Button from "../../components/Button";
/* import { RootState } from "../../store"; */
import * as Notifications from "expo-notifications";
/* import BottomSheet from "../../components/BottomSheet"; */
import Typography from "../../components/Typography";
import CheckIcon from "../../assets/icons/Check";
import { styles } from "./styles";
import ModalBottomSheet from "../../components/ModalBottomSheet/ModalBottomSheet";
import SwipableBottomSheet from "../../components/SwipableBottomSheet";

export default function EmailVerifiedMessageV2({
  isOpen,
  data,
  setShowEmailVerified,
  notificationIdentifier,
  route,
}: any) {
  const { navigate }: any = useNavigation();
  const refRBSheet = useRef();
  /* const dispatch = useDispatch(); */
  /* const userData = useSelector((state: RootState) => state?.auth?.userData); */
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpenModal) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [isOpenModal]);

  // console.log('*****data*****', data?.emailverificationData);

  // useEffect(() => {
  //   // if (isOpen || route?.params?.isOpenEmailVerified) {
  //     if (isOpen) {
  //       setIsOpenModal(true);
  //   }

  // }, []);

  const closePopup = async () => {
    //Add navigation route to next step to registration process
    // setShowEmailVerified({ show: false, data: {} });
    setShowEmailVerified({ show: false, data: {} });

    //dismiss all notifications
    // Notifications.dismissAllNotificationsAsync();
    //dismiss single notifications
    Notifications.dismissNotificationAsync(notificationIdentifier);

    navigate(screenNames.signup, {
      stepIndex: 1,
    });
    // setIsOpenModal(false);
  };

  /* return (
    <Modal
      isOpen={isOpen}
      footer={<View style={styles.buttonContainer}></View>}
      headerTitle={"Email Verified"}
    >
      <View style={styles.container}>
        <View style={styles.transactionDetails}>
          <Text>{data?.emailverificationData?.message}</Text>
        </View>

        <Button color={"green"} onPress={() => closePopup()}>
          <Text style={styles.buttonText}>OK</Text>
        </Button>
      </View>
    </Modal>
  ); */

  return (
    <Fragment>
      {isOpenModal && Platform.OS === "ios" ? (
        <ModalBottomSheet
          isOpen={isOpenModal}
          hasNoHeaderPadding
          contentHeight={450}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerWrapper}>
              <CheckIcon color="white" size={18} />
              <Typography
                color="#FFFF"
                fontSize={18}
                marginLeft={6}
                fontWeight={"600"}
              >
                Email address verified
              </Typography>
            </View>
          </View>
          <View style={styles.headerWrapper}>
            <Button
              color={"green"}
              onPress={() => closePopup()}
              style={styles.buttonOK}
            >
              <Text>OK</Text>
            </Button>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require('("../../../assets/images/verified.png')}
              style={styles.image}
            />
          </View>
        </ModalBottomSheet>
      ) : null}
      {isOpenModal && Platform.OS === "android" ? (
        <SwipableBottomSheet
          rbSheetRef={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={false}
          onClose={() => {
            navigate(screenNames.signup, {
              stepIndex: 1,
            });
          }}
          height={380}
          wrapperStyles={{
            backgroundColor: "rgba(172, 172, 172, 0.5)",
            zIndex: 2,
          }}
          containerStyles={{
            backgroundColor: "#0DCA9D",
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            elevation: 12,
            shadowColor: "#52006A",
            zIndex: 2,
          }}
          draggableIconStyles={{ backgroundColor: "#FFF", width: 90 }}
        >
          <View style={styles.headerContainer}>
            <View style={styles.headerWrapper}>
              <CheckIcon color="white" size={18} />
              <Typography
                color="#FFFF"
                fontSize={18}
                marginLeft={6}
                fontWeight={"600"}
              >
                Email address verified.
              </Typography>
            </View>
          </View>
          <View style={styles.okWrapper}>
            <Button
              color={"green"}
              onPress={() => closePopup()}
              style={styles.buttonOK}
            >
              <Text>OK</Text>
            </Button>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              source={require('("../../../assets/images/verified.png')}
              style={styles.image}
            />
          </View>
        </SwipableBottomSheet>
      ) : null}
    </Fragment>
  );
}

/* const styles: any = StyleSheet.create<any>({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "400",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
});
 */
