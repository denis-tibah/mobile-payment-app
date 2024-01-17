import { useState, FC, useCallback, useRef, Fragment } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import Spinner from "react-native-loading-spinner-overlay/lib";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import Feather from "react-native-vector-icons/Feather";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";

import { Seperator } from "../Seperator/Seperator";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import PigIcon from "../../assets/icons/Pig";
import SquareQuestionMarkIcon from "../../assets/icons/SquareQuestionMark";
import BusinessBagIcon from "../../assets/icons/BusinessBag";
import FormGroup from "../FormGroup";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Button from "../Button";
import { financialDataTabSchema } from "../../utils/formikSchema";
import { sourceOfWealth, employmentStatus } from "../../data/options";
import { useCreateTicketRequestMutation } from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import Typography from "../Typography";
import BottomSheetSwiper, {
  BottomSheetRefProps,
} from "../BottomSheetSwiper/BottomSheetSwiper";

interface IFinancialDetailsTab {
  cleanUpTabSelection: () => void;
}

const HelpTab: FC<IFinancialDetailsTab> = ({ cleanUpTabSelection }) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const refRBSheet = useRef();

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });

  /* const [
    createTicketMutation,
    {
      isLoading: isLoadingCreateTicketReq,
      isError: isErrorCreateTicketReq,
      isSuccess: isSuccessCreateTicketReq,
      error: errorCreateTicketReq,
      data: dataCreateTicketReq,
    },
  ] = useCreateTicketRequestMutation(); */

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setValues,
  } = useFormik({
    initialValues: {},
    validationSchema: financialDataTabSchema,
    onSubmit: async ({}) => {},
  });

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  return (
    <Fragment>
      <ScrollView style={{}}>
        <View style={{ backgroundColor: "#ffff" }}>
          {/* <Spinner visible={} /> */}
          <SuccessModal
            isOpen={statusMessage?.isOpen}
            title={statusMessage.header}
            text={statusMessage.body}
            isError={statusMessage.isError}
            onClose={onCloseModal}
          />
          <Pressable>
            <View style={{ paddingBottom: 12, paddingTop: 16 }}>
              <View
                style={[
                  styles.formContainer,
                  { paddingLeft: 22, paddingRight: 22 },
                ]}
              >
                <Typography fontSize={16}>
                  If you need help please visit one of our page
                </Typography>
                <View style={styles.containerButtonHelp}>
                  <View style={{ width: "50%" }}>
                    <Button
                      leftIcon={
                        <SquareQuestionMarkIcon size={16} color="blue" />
                      }
                      color="light-blue"
                    >
                      FAQ
                    </Button>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Button
                      leftIcon={
                        <Feather color="#086afb" size={18} name="life-buoy" />
                      }
                      color="light-blue"
                    >
                      Help
                    </Button>
                  </View>
                </View>
              </View>
            </View>
            <Seperator backgroundColor={vars["grey"]} width="100%" />
            <View style={{ paddingBottom: 12, paddingTop: 16 }}>
              <View
                style={[
                  styles.formContainer,
                  { paddingLeft: 22, paddingRight: 22 },
                ]}
              >
                <Typography
                  fontSize={16}
                  lineHeight={18}
                  paddingTop={10}
                  paddingBottom={8}
                >
                  If you don't find solution create a ticket to our support team
                </Typography>
                <View style={{ width: "100%", marginTop: 12 }}>
                  <Button
                    leftIcon={
                      <MaterialCommunityIcons
                        color="#E7038E"
                        size={20}
                        name="ticket-outline"
                      />
                    }
                    fontSize={18}
                    color="light-pink"
                    onPress={() => {
                      refRBSheet.current.open();
                    }}
                  >
                    Create ticket
                  </Button>
                  <View style={{ marginTop: 106, marginBottom: -16 }}>
                    <Image
                      source={require("../../assets/images/help-img.png")}
                    />
                  </View>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={600}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          container: {
            backgroundColor: vars["grey"],
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          },
          draggableIcon: {
            backgroundColor: "grey",
            width: 100,
          },
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{}}>
            <Pressable>
              <View style={{ backgroundColor: vars["grey"] }}>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
                <Typography>my text</Typography>
              </View>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </RBSheet>
    </Fragment>
  );
};

export default HelpTab;
