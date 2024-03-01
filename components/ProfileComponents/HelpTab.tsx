import { useState, FC, useRef, Fragment, useEffect } from "react";
import { View, ScrollView, Pressable, Image, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import Spinner from "react-native-loading-spinner-overlay/lib";

import { Seperator } from "../Seperator/Seperator";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import SquareQuestionMarkIcon from "../../assets/icons/SquareQuestionMark";
import FormGroup from "../FormGroup";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Button from "../Button";
import { helpTabCreateTicketSchema } from "../../utils/formikSchema";
import { ticketType } from "../../data/options";
import { useCreateTicketFreshDeskMutation } from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import Typography from "../Typography";
import WholeContainer from "../../layout/WholeContainer";
import SwipableBottomSheet from "../SwipableBottomSheet";

interface IFinancialDetailsTab {
  isOpenBottomSheet: boolean;
  passedTicketType?: string;
  transactionReferenceNumber?: string;
  handleCloseBottomSheet: () => void;
}
const windowDimensions = Dimensions.get("window");
const screenDimensions = Dimensions.get("screen");
const HelpTab: FC<IFinancialDetailsTab> = ({
  isOpenBottomSheet,
  passedTicketType,
  transactionReferenceNumber,
  handleCloseBottomSheet,
}) => {
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profile
  )?.data;
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const refRBSheet = useRef();

  const [openListForTicketType, setOpenListForTicketType] =
    useState<boolean>(false);

  const [statusMessage, setStatusMessage] = useState<{
    header: string;
    body: string;
    isOpen: boolean;
    isError: boolean;
  }>({ header: "", body: "", isOpen: false, isError: false });
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  const [
    createTicketFreshDesk,
    {
      isLoading: isLoadingCreateTicketFreshDesk,
      isError: isErrorCreateTicketFreshDesk,
      isSuccess: isSuccessCreateTicketFreshDesk,
      error: errorCreateTicketFreshDesk,
      data: dataCreateTicketFreshDesk,
    },
  ] = useCreateTicketFreshDeskMutation();
  console.log(
    "🚀 ~ isErrorCreateTicketFreshDesk:",
    isErrorCreateTicketFreshDesk
  );
  console.log(
    "🚀 ~ isSuccessCreateTicketFreshDesk:",
    isSuccessCreateTicketFreshDesk
  );
  console.log("🚀 ~ errorCreateTicketFreshDesk:", errorCreateTicketFreshDesk);
  console.log("🚀 ~ dataCreateTicketFreshDesk:", dataCreateTicketFreshDesk);

  const {
    handleSubmit,
    handleChange,
    values,
    touched,
    errors,
    handleBlur,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      type: "",
      ticketValue: "",
    },
    validationSchema: helpTabCreateTicketSchema,
    onSubmit: async ({ type, ticketValue }) => {
      const bodyParams = {
        type: "helpdesk issue Request",
        dateSubmitted: new Date().toISOString(),
        ticketValue: [
          {
            help: {
              type,
              value: ticketValue,
            },
          },
        ],
        receive_mail: profileData?.email,
      };
      createTicketFreshDesk({
        bodyParams: bodyParams,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      });
    },
  });

  useEffect(() => {
    if (isOpenBottomSheet) {
      refRBSheet.current.open();
    } else {
      refRBSheet.current.close();
    }
  }, [isOpenBottomSheet]);

  useEffect(() => {
    if (passedTicketType && transactionReferenceNumber) {
      setFieldValue("type", passedTicketType);
      setFieldValue(
        "ticketValue",
        transactionReferenceNumber
          ? `Transaction Reference: ${transactionReferenceNumber}`
          : ""
      );
    }
  }, [passedTicketType, transactionReferenceNumber]);

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
          <Spinner visible={isLoadingCreateTicketFreshDesk} />
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
      <SwipableBottomSheet
        rbSheetRef={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        onClose={() => {
          handleCloseBottomSheet();
        }}
      wrapperStyles={{ backgroundColor: "rgba(172, 172, 172, 0.5)" }}
        containerStyles={{
          height: dimensions.window.height - 145,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 14,
          borderTopRightRadius: 14,
          elevation: 12,
          shadowColor: "#52006A",
        }}
        draggableIconStyles={{ backgroundColor: "#DDDDDD", width: 90 }}
      >
        <View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 22,
              paddingVertical: 4,
            }}
          >
            <MaterialCommunityIcons
              color="#E7038E"
              size={20}
              name="ticket-outline"
            />
            <Typography fontSize={16} marginLeft={8} fontWeight={600}>
              Create ticket
            </Typography>
          </View>
          <View>
            <Seperator
              borderColor={vars["grey"]}
              marginTop={18}
              borderWidth={0.5}
            />
          </View>
          <View
            style={[
              styles.formContainer,
              { paddingLeft: 18, paddingRight: 18, paddingVertical: 26 },
            ]}
          >
            <FormGroup
              validationError={errors.type && touched.type && errors.type}
            >
              <View style={styles.dropdownWrapper}>
                <View style={styles.dropDownIconContainerLeft}>
                  <FontAwesome5
                    size={20}
                    color="#086AFB"
                    name={"globe-europe"}
                  />
                </View>
                <View>
                  <DropDownPicker
                    schema={{ label: "label", value: "value" }}
                    onSelectItem={(value: any) => {
                      const { value: type } = value;

                      setValues({
                        ...values,
                        type: type,
                      });
                    }}
                    listMode="MODAL"
                    items={ticketType}
                    value={values?.type}
                    setOpen={setOpenListForTicketType}
                    open={openListForTicketType}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    placeholder="Bug report"
                    placeholderStyle={{
                      color: vars["medium-grey"],
                    }}
                  />
                </View>
                <View style={styles.dropDownIconContainerRight}>
                  <ArrowRightIcon size={16} color="blue" />
                </View>
              </View>
            </FormGroup>
            <Seperator
              borderColor={vars["light-grey"]}
              marginTop={16}
              marginBottom={28}
              borderWidth={0.5}
            />
            <View>
              <FormGroup
                validationError={
                  errors.ticketValue &&
                  touched.ticketValue &&
                  errors.ticketValue
                }
              >
                <FormGroup.TextArea
                  keyboardType="default"
                  returnKeyType={"done"}
                  onChangeText={handleChange("ticketValue")}
                  onBlur={handleBlur("ticketValue")}
                  value={values.ticketValue}
                  editable={values.ticketValue === "N/A" ? false : true}
                  selectTextOnFocus={
                    values.ticketValue === "N/A" ? false : true
                  }
                  placeholder="Type here your issue"
                  wrapperHeight={dimensions.window.height - 480}
                />
              </FormGroup>
            </View>
          </View>
        </View>
        <View style={styles.footerContent}>
          <View style={styles.downloadBtnMain}>
            <WholeContainer>
              <Button
                color="light-pink"
                leftIcon={
                  <MaterialCommunityIcons
                    color="#E7038E"
                    size={20}
                    name="send-outline"
                  />
                }
                onPress={handleSubmit}
              >
                <Typography
                  fontFamily="Nunito-SemiBold"
                  fontSize={16}
                  fontWeight={600}
                >
                  Send ticket
                </Typography>
              </Button>
            </WholeContainer>
          </View>
        </View>
      </SwipableBottomSheet>
    </Fragment>
  );
};

export default HelpTab;
