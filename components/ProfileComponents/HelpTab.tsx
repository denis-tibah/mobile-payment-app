import { useState, FC, useRef, Fragment, useEffect } from "react";
import {
  View,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import Spinner from "react-native-loading-spinner-overlay/lib";
import { SelectList } from "react-native-dropdown-select-list";

import { Seperator } from "../Seperator/Seperator";
import ArrowRightIcon from "../../assets/icons/ArrowRight";
import SquareQuestionMarkIcon from "../../assets/icons/SquareQuestionMark";
import FormGroup from "../FormGroup";
import { SuccessModal } from "../../components/SuccessModal/SuccessModal";
import Button from "../Button";
import { helpTabCreateTicketSchema } from "../../utils/formikSchema";
import { ticketType, ticketTypeTwo } from "../../data/options";
import { useCreateHelpTicketMutation } from "../../redux/profile/profileSliceV2";
import { RootState } from "../../store";
import vars from "../../styles/vars";
import { styles } from "./styles";
import Typography from "../Typography";
import WholeContainer from "../../layout/WholeContainer";
import SwipableBottomSheet from "../SwipableBottomSheet";
import { arrayChecker } from "../../utils/helpers";

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
  const userTokens = useSelector((state: RootState) => state?.auth?.data);
  const refRBSheet = useRef();

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
  const [defaultBugReport, setDefaultBugReport] = useState<{
    key: string;
    value: string;
  }>({ key: "", value: "" });
  const [selectedBugReport, setSelectedBugReport] = useState<string>("");

  const [
    createHelpTicket,
    {
      isLoading: isLoadingCreateHelpTicket,
      isError: isErrorCreateHelpTicket,
      isSuccess: isSuccessCreateHelpTicket,
      error: errorCreateHelpTicket,
      data: dataCreateHelpTicket,
    },
  ] = useCreateHelpTicketMutation();

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
        reason: type ? type.toUpperCase() : "",
        description: ticketValue,
      };
      createHelpTicket({
        bodyParams: bodyParams,
        accessToken: userTokens?.access_token,
        tokenZiyl: userTokens?.token_ziyl,
      });
    },
  });

  const onCloseModal = (): void => {
    setStatusMessage({
      header: "",
      body: "",
      isOpen: false,
      isError: false,
    });
  };

  useEffect(() => {
    if (!isLoadingCreateHelpTicket && isSuccessCreateHelpTicket) {
      if (
        dataCreateHelpTicket?.code === "200" ||
        dataCreateHelpTicket?.code === 200
      ) {
        setStatusMessage({
          header: "Success",
          body:
            dataCreateHelpTicket?.message ||
            "Message forwarded to customer service",
          isOpen: true,
          isError: false,
        });
        setFieldValue("type", "");
        setFieldValue("ticketValue", "");
        refRBSheet?.current?.close();
      }
    }
  }, [
    isLoadingCreateHelpTicket,
    isSuccessCreateHelpTicket,
    dataCreateHelpTicket,
  ]);

  useEffect(() => {
    if (
      !isLoadingCreateHelpTicket &&
      (dataCreateHelpTicket?.code === "400" ||
        dataCreateHelpTicket?.code === 400 ||
        dataCreateHelpTicket?.code === "401" ||
        dataCreateHelpTicket?.code === 401 ||
        dataCreateHelpTicket?.code === "422" ||
        dataCreateHelpTicket?.code === 422)
    ) {
      let message = "Something went wrong";
      if (dataCreateHelpTicket?.message) {
        if (arrayChecker(dataCreateHelpTicket?.message)) {
          message = dataCreateHelpTicket?.message.join(", ");
        } else {
          message = dataCreateHelpTicket?.message;
        }
        refRBSheet?.current?.close();
      }

      setStatusMessage({
        header: "Error",
        body: message || "Something went wrong",
        isOpen: true,
        isError: true,
      });
    }
  }, [
    isLoadingCreateHelpTicket,
    isSuccessCreateHelpTicket,
    dataCreateHelpTicket,
  ]);

  useEffect(() => {
    if (isOpenBottomSheet) {
      refRBSheet?.current?.open();
    } else {
      refRBSheet?.current?.close();
    }
  }, [isOpenBottomSheet]);

  useEffect(() => {
    if (passedTicketType && transactionReferenceNumber) {
      const bugReport = ticketTypeTwo.find(
        (param) => param?.value.toLowerCase() === passedTicketType.toLowerCase()
      );
      setDefaultBugReport(bugReport || { key: "", value: "" });

      setFieldValue("type", passedTicketType);
      setFieldValue(
        "ticketValue",
        transactionReferenceNumber
          ? `Transaction Reference: ${transactionReferenceNumber}`
          : ""
      );
    }
  }, [passedTicketType, transactionReferenceNumber]);

  return (
    <Fragment>
      <SuccessModal
        isOpen={statusMessage?.isOpen}
        title={statusMessage.header}
        text={statusMessage.body}
        isError={statusMessage.isError}
        onClose={onCloseModal}
      />
      <ScrollView>
        <Spinner visible={isLoadingCreateHelpTicket} />
        <View style={{ backgroundColor: "#ffff" }}>
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
                      refRBSheet?.current?.open();
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
          setFieldValue("type", "");
          setFieldValue("ticketValue", "");
          setSelectedBugReport("");
          setDefaultBugReport({ key: "", value: "" });
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
            <Typography fontSize={16} marginLeft={8} fontWeight={"600"}>
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
              <View>
                <View style={{ position: "absolute", top: 12, left: 14 }}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      size={20}
                      color="#086AFB"
                      name={"globe-europe"}
                    />
                    {!selectedBugReport ? (
                      <Typography
                        fontSize={16}
                        fontWeight={"600"}
                        fontFamily="Nunito-SemiBold"
                        marginLeft={8}
                        color={vars["medium-grey"]}
                      >
                        Bug report
                      </Typography>
                    ) : null}
                  </View>
                </View>
                <View>
                  <SelectList
                    defaultOption={defaultBugReport}
                    setSelected={(val: string) => {
                      setSelectedBugReport(val);
                    }}
                    onSelect={() => {
                      setFieldValue("type", selectedBugReport.toLowerCase());
                    }}
                    data={ticketType}
                    save="value"
                    arrowicon={<ArrowRightIcon size={16} color="blue" />}
                    search={false}
                    searchicon={
                      <FontAwesome5
                        size={20}
                        color="#086AFB"
                        name={"globe-europe"}
                      />
                    }
                    boxStyles={{
                      borderRadius: 50,
                      borderColor: vars["accent-blue"],
                    }}
                    dropdownStyles={{
                      borderColor: vars["accent-blue"],
                    }}
                    inputStyles={{ marginLeft: 20 }}
                    // remove text in placeholder
                    placeholder=" "
                  />
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
                  fontWeight={"600"}
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
