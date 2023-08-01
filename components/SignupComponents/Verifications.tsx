import { FC, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../components/Button";
import Typography from "../../components/Typography";
import PhoneIcon from "../../assets/icons/Phone";
import ArrowDownIcon from "../../assets/icons/ArrowDown";
import ArrowLeft from "../../assets/icons/ArrowLeft";
import TickIcon from "../../assets/icons/TickWithoutCircle";
import { Seperator } from "../../components/Seperator/Seperator";
import { PinCodeInputBoxes } from "../FormGroup/FormGroup";
import FixedBottomAction from "../../components/FixedBottomAction";
import FormGroup from "../../components/FormGroup";
import { registrationPhonePrefix } from "../../data/options";
import { verifyPhoneNumberSchema } from "../../utils/formikSchema";
import {
  setRegistrationData,
  sendSMSVerification,
  getSumsubVerificationCode,
} from "../../redux/registration/registrationSlice";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IVerifications {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const Verifications: FC<IVerifications> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  const dispatch = useDispatch();
  const registration = useSelector((state: any) => state.registration);

  const [isUpdatePhoneNumber, setUpdatePhoneNumber] = useState<Boolean>(false);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [isDisabledOtp, setIsDisabledOtp] = useState<Boolean>(true);
  const [SMSResent, setSMSResent] = useState<Boolean>(false);
  const [errorsOtp, setErrorsOtp] = useState({});
  const [otp, setOtp] = useState<Number>();

  useEffect(() => {
    if (otp && otp.toString().length && otp.toString().length === 6) {
      setIsDisabledOtp(false);
    } else {
      setIsDisabledOtp(true);
    }
  }, [otp]);
  const handlePinCodeChange = (otpNum: Number): void => {
    setOtp(otpNum);
  };

  const handleChangePhoneNumber = (): void => {
    setUpdatePhoneNumber(!isUpdatePhoneNumber);
  };

  const { handleSubmit, handleChange, values, touched, errors, handleBlur } =
    useFormik({
      initialValues: {
        countryCode: "",
        phoneNumber: "",
      },
      validationSchema: verifyPhoneNumberSchema,
      onSubmit: ({ phoneNumber, countryCode }) => {
        setIsLoading(true);
        dispatch(
          setRegistrationData({
            phone_number: `${countryCode}${phoneNumber}`,
            identifier: `${countryCode}${phoneNumber}`,
          })
        );
        dispatch(
          sendSMSVerification({
            identifier: `${countryCode}${phoneNumber}`,
          })
        )
          .then((payload: any) => {
            if (payload) {
              setIsLoading(false);
              setSMSResent(true);
            }
          })
          .catch((error: any) => {
            setIsLoading(false);
            console.error(
              `*** resent sms verification to ${countryCode}${phoneNumber} failed: ${error} ***`
            );
          });

        setUpdatePhoneNumber(false);
      },
    });

  const handleVerifyPhoneNumber = () => {
    // dispatch action to send all the registration data
    setIsLoading(true);
    dispatch(
      getSumsubVerificationCode({
        ...registration.data,
        code: otp,
        provider: "ziyl",
        country: registration.data.country_of_birth,
      })
    )
      .unwrap()
      .then((payload: any) => {
        if (payload) {
          if (payload[0].code === 201) {
            setIsLoading(false);
            dispatch(
              setRegistrationData({
                sumsubToken: payload[0].data.token,
              })
            );
            localStorage.setItem("token_ziyl", payload[0].token_ziyl);
            handleNextStep();
            return;
          }
          setIsLoading(false);
          // if the response code is not 201 will assume there was an error submitting the application
          setErrorsOtp((prev) => ({ ...prev, message: payload[0].message }));
        }
      })
      .catch((error: any) => {
        setIsLoading(false);
        console.error(`*** send data to backend error: ***`, error);
      });
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Verify your phone number
        </Typography>
        <Typography
          fontSize={12}
          fontFamily="Nunito-Regular"
          marginTop={12}
          color={vars["medium-grey2"]}
        >
          You will recieve an sms to your mobile device. Please enter this code
          below
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}>
          <View>
            <View style={styles.pinCodeContainer}>
              <PinCodeInputBoxes
                fieldCount={6}
                onChange={handlePinCodeChange}
              />
              <Text style={styles.noCode}>
                Did not get a verification code?
              </Text>
            </View>
            <View style={styles.phoneNumberContainer}>
              <View>
                {registration?.data?.identifier ? (
                  <View style={styles.phoneNumberInnerContainer}>
                    <PhoneIcon size={14} />
                    <Text>
                      {registration?.data?.identifier
                        ? registration?.data?.identifier
                        : ""}
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={handleChangePhoneNumber}
                style={styles.phoneNumberInnerContainer}
              >
                <Text>Not your number</Text>
                <View style={{ marginTop: 4 }}>
                  <ArrowDownIcon color={vars["accent-pink"]} size={16} />
                </View>
              </TouchableOpacity>
            </View>
            {isUpdatePhoneNumber && (
              <View style={styles.alternatePhoneNumberContainer}>
                <View style={styles.phoneNumberInnerContainer}>
                  <View style={{ width: "100%" }}>
                    <FormGroup
                      validationError={
                        errors.countryCode &&
                        touched.countryCode &&
                        errors.countryCode
                      }
                    >
                      <FormGroup.SelectForArrOfObject
                        onValueChange={handleChange("countryCode")}
                        onBlur={handleBlur("countryCode")}
                        selectedValue={values?.countryCode}
                        itemStyle={{ height: Platform.OS === "ios" ? 48 : "" }}
                      >
                        {registrationPhonePrefix.map((item) => {
                          if (!item?.label && !item?.value) {
                            return (
                              <FormGroup.Option
                                key="null"
                                label="Country code"
                                value=""
                              />
                            );
                          }
                          return (
                            <FormGroup.Option
                              key={item?.value}
                              label={item?.label}
                              value={item?.value}
                            />
                          );
                        })}
                      </FormGroup.SelectForArrOfObject>
                    </FormGroup>
                    <View>
                      <FormGroup
                        validationError={
                          errors.phoneNumber &&
                          touched.phoneNumber &&
                          errors.phoneNumber
                        }
                      >
                        <FormGroup.Input
                          keyboardType="number-pad"
                          returnKeyType={"done"}
                          onChangeText={handleChange("phoneNumber")}
                          onBlur={handleBlur("phoneNumber")}
                          value={values.phoneNumber}
                          placeholder="Phone Number"
                          icon={<PhoneIcon />}
                        />
                      </FormGroup>
                    </View>
                    <View>
                      <Button
                        loading={isLoading}
                        disabled={isLoading}
                        color="light-blue"
                        onPress={handleSubmit}
                        style={{ marginLeft: 10, width: 80 }}
                      >
                        Save
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            )}
            {SMSResent ? (
              <View style={styles.smsResentContainer}>
                <View style={styles.smsResentInnerContainer}>
                  <Text
                    style={[styles.smsResentText, styles.smsResentFirstText]}
                  >
                    Updated phone number
                  </Text>
                  <Text style={styles.smsResentText}>
                    We resent the verification code to your new number
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
          <FixedBottomAction rounded>
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 20,
              }}
            >
              <Button
                color="light-pink"
                onPress={handlePrevStep}
                leftIcon={<ArrowLeft size={14} />}
              >
                Back
              </Button>
              <Button
                loading={isLoading}
                color={isDisabledOtp || isLoading ? "grey" : "light-pink"}
                onPress={handleVerifyPhoneNumber}
                leftIcon={
                  <TickIcon
                    size={14}
                    color={
                      vars[
                        isDisabledOtp || isLoading
                          ? "medium-grey2"
                          : "accent-pink"
                      ]
                    }
                  />
                }
                disabled={isDisabledOtp}
              >
                Verify your phone number
              </Button>
            </View>
          </FixedBottomAction>
        </View>
      </View>
    </View>
  );
};

export default Verifications;
