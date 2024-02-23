import { cloneElement, useEffect, useRef, useState } from "react";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Clipboard from "expo-clipboard";
import { Text, View, TextInput, Platform, Pressable } from "react-native";
import Checkbox from "expo-checkbox";

import {
  input,
  formGroup,
  textarea,
  pinCode,
  checkbox,
  newPinCode,
} from "./styles";
import EyeIcon from "../../assets/icons/Eye";
import EyeClosedIcon from "../../assets/icons/EyeClosed";
import vars from "../../styles/vars";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../Button";
import Typography from "../Typography";

const { Item } = Picker;
const { Item: ItemIOS } = PickerIOS;
export function FormGroup({
  children,
  extraPadding,
  noPadding,
  noMargin,
  validationError,
  removeValidation = false,
  helperText,
  row = false,
}: any) {
  return (
    <View
      style={[
        formGroup.base,
        row ? formGroup.row : null,
        noPadding ? formGroup.noPadding : null,
        noMargin ? formGroup.noMargin : null,
        extraPadding ? formGroup.extraPadding : null,
      ]}
    >
      {children}
      {!removeValidation && !!validationError && (
        <Text
          style={[
            validationError ? formGroup.validationError : formGroup.helperText,
            formGroup.infoBlock,
          ]}
        >
          {validationError || helperText}
        </Text>
      )}
    </View>
  );
}

export function Input({
  icon,
  actionText,
  actionHandler,
  error,
  style,
  iconColor,
  iconSize = 16,
  type = "text",
  keyboardType = "default",
  value,
  disabled,
  ...props
}: any) {
  return (
    <View style={[input.wrapper, style]}>
      {icon && (
        <View style={input.icon}>
          {cloneElement(icon, { color: iconColor, size: iconSize })}
        </View>
      )}
      <TextInput
        editable={!disabled}
        style={input.input}
        value={value ? value.toString() : null}
        type={type}
        keyboardType={keyboardType}
        actionText={actionText}
        actionHandler={actionHandler}
        {...props}
      />
    </View>
  );
}

export function Label({ children }: any) {
  return <Text style={input.label}>{children}</Text>;
}

export function TextArea({ wrapperHeight, ...props }: any) {
  return (
    <View style={[textarea.wrapper, { height: wrapperHeight }]}>
      <TextInput textAlign="left" style={textarea.input} {...props} multiline />
    </View>
  );
}

export function Select({
  children,
  placeholder,
  items = [],
  selectedValue,
  setSelectedValue,
  icon,
  iconColor = "medium-grey",
  iconSize = 16,
  ...props
}: any) {
  const [selectedItem, setSelectedItem] = useState(selectedValue);
  return (
    <View style={input.wrapper}>
      {icon && (
        <View style={input.icon}>
          {cloneElement(icon, { color: iconColor, size: iconSize })}
        </View>
      )}
      {items.length > 0 ? (
        <Picker
          style={input.input}
          selectedValue={selectedItem}
          onValueChange={(selected) => setSelectedItem(selected)}
          itemStyle={{ backgroundColor: "grey", color: "#808080 !important" }}
        >
          <Item label={placeholder} value="" style={{ color: "#808080" }} />
          {items.map((item: any, index: number) => (
            <Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      ) : (
        <Picker style={input.input} {...props}>
          {children}
        </Picker>
      )}
    </View>
  );
}

export function Option({ label, value, enabled, ...props }: any) {
  if (Platform.OS === "ios") return <PickerIOS.Item {...props} />;

  return <Picker.Item {...props} />;
}

export function Password({
  icon,
  iconColor = "medium-gray",
  rightIcon = false,
  ...props
}: any) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={input.wrapper}>
      {icon && (
        <View style={input.icon}>
          {cloneElement(icon, { color: iconColor, size: 16 })}
        </View>
      )}

      <TextInput
        secureTextEntry={!showPassword}
        style={input.input}
        {...props}
      />

      {rightIcon && (
        <View style={input.passIcon}>
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeIcon color="blue" size={18} />
            ) : (
              <EyeClosedIcon color="blue" size={18} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

export const PinCodeInputBoxes = ({
  fieldCount = 4,
  onChange,
  isNewPinCodeStyle = false,
  ...props
}: any) => {
  const inputs = useRef<any>([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleTextChange = (text: string, index: number) => {
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = text;
      return newCode;
    });
  };

  useEffect(() => {
    onChange(code.join(""));
  }, [code]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < fieldCount) {
      inputs.current[index].focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      if (index > 0) {
        focusInput(index - 1);
      }
    } else {
      focusInput(index + 1);
    }
  };

  return (
    <View
      style={[pinCode.wrapper, isNewPinCodeStyle && pinCode.newPinCodeWrapper]}
    >
      {[...Array(fieldCount)].map((item, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputs.current[i] = ref)}
          maxLength={1}
          style={[
            pinCode.input,
            isNewPinCodeStyle ? pinCode.newPinCodeStyle : "",
          ]}
          returnKeyType="done"
          keyboardType="numeric"
          onChangeText={(text) => handleTextChange(text, i)}
          onKeyPress={(event) => handleKeyPress(event, i)}
          {...props}
        />
      ))}
    </View>
  );
};

export const NewPinCodeInputBoxes = ({
  fieldCount = 4,
  onChange,
  isNewPinCodeStyle = false,
  ...props
}: any) => {
  const inputs = useRef<any>([]);
  const [codes, setCodes] = useState(["-", "-", "-", "-", "-", "-"]);

  const handleTextChange = (text: string, index: number) => {
    let formattedText = text ? text.replace("-", "") : "";
    setCodes((prevCode) => {
      const newCode = [...prevCode];
      if (text === "") {
        newCode[index] = "-";
      } else {
        if (formattedText.length > 1) {
          formattedText = formattedText.charAt(formattedText.length - 1);
        }
        newCode[index] = formattedText;
      }

      return newCode;
    });
  };

  useEffect(() => {
    onChange(codes.join(""));
  }, [codes]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < fieldCount) {
      inputs.current[index].focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      if (index > 0) {
        focusInput(index - 1);
      }
    } else {
      focusInput(index + 1);
    }
  };

  return (
    <View style={newPinCode.wrapper}>
      {codes.map((code, index) => {
        return (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            maxLength={2}
            style={newPinCode.input}
            returnKeyType="done"
            keyboardType="numeric"
            onChangeText={(text) => handleTextChange(text, index)}
            value={code}
            onKeyPress={(event) => handleKeyPress(event, index)}
            {...props}
          />
        );
      })}
    </View>
  );
};

export function PinCodeInputClipBoard({
  fieldCount = 4,
  onChange,
  isNewPinCodeStyle = false,
  ...props
}: any) {
  const inputs = useRef<any>([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    onChange(code.join(""));
  }, [code]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < fieldCount) {
      inputs.current[index].focus();
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ...Platform.select({
            ios: {
              paddingVertical: 18,
              width: 218,
            },
            android: {
              padding: 16,
              width: 215,
            },
          }),
          height: 50,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: "#6BA6FD",
          marginTop: 10,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <TextInput
            style={{
              ...Platform.select({
                ios: {
                  width: "100%",
                  letterSpacing: 24,
                  paddingLeft: 24,
                },
                android: {
                  width: 215,
                  letterSpacing: 22,
                },
              }),

              zIndex: 999,
            }}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
            maxLength={6}
            onChange={(event) => {
              const codeArray = event.nativeEvent.text.split("");
              setCode(codeArray);
              onChange(codeArray.join(""));
            }}
          />
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            ...Platform.select({
              ios: {
                marginLeft: 6,
                justifyContent: "space-evenly",
              },
            }),
          }}
        >
          {[...Array(fieldCount)].map((item, i) => (
            <Text
              key={i}
              style={{
                width: 18,
                ...Platform.select({
                  ios: {
                    borderWidth: 0.5,
                    height: 1,
                    top: 4,
                    marginBottom: 6,
                  },
                  android: {
                    top: -12,
                    marginLeft: 6,
                    marginRight: 6,
                    borderBottomWidth: 1,
                  },
                }),
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export function SelectForArrOfObject({
  children,
  icon,
  iconColor = "medium-grey",
  iconSize = 16,
  ...props
}: any) {
  return (
    <View style={input.wrapperSelectForObjectData}>
      {icon && Platform.OS !== "ios" && (
        <View style={input.icon}>
          {cloneElement(icon, { color: iconColor, size: iconSize })}
        </View>
      )}
      <Picker style={input.input} {...props}>
        {children}
      </Picker>
    </View>
  );
}
export function CheckboxUI({
  label,
  isTermsAndSecurity,
  labelValue,
  ...props
}: any) {
  return (
    <View style={checkbox.container}>
      <View style={checkbox.checkboxContainer}>
        <Checkbox {...props} />
        {!isTermsAndSecurity && labelValue !== "newsLetterSubscription" ? (
          <Text style={checkbox.label}>{label}</Text>
        ) : null}
        {labelValue === "newsLetterSubscription" ? (
          <Typography
            marginLeft={12}
            fontFamily="Mukta-SemiBold"
            fontSize={14}
            fontWeight={500}
          >
            Newsletter subscription
          </Typography>
        ) : null}

        {labelValue === "termsAndConditions" ? (
          <Typography
            fontFamily="Mukta-SemiBold"
            fontSize={14}
            fontWeight={500}
            marginLeft={12}
          >
            I've read and accept the{" "}
            <Typography
              fontFamily="Mukta-SemiBold"
              fontSize={14}
              fontWeight={500}
              color={vars["accent-pink"]}
            >
              Terms
            </Typography>
          </Typography>
        ) : null}
        {labelValue === "readPrivacyPolicy" ? (
          <Typography
            fontFamily="Mukta-SemiBold"
            fontSize={14}
            fontWeight={500}
            marginLeft={12}
          >
            I've read and accept the{" "}
            <Typography
              fontFamily="Mukta-SemiBold"
              fontSize={14}
              fontWeight={500}
              color={vars["accent-pink"]}
            >
              Privacy Policy
            </Typography>
          </Typography>
        ) : null}
      </View>
    </View>
  );
}
FormGroup.Input = Input;
FormGroup.Label = Label;
FormGroup.TextArea = TextArea;
FormGroup.Select = Select;
FormGroup.Option = Option;
FormGroup.Password = Password;
FormGroup.SelectForArrOfObject = SelectForArrOfObject;
FormGroup.CheckboxUI = CheckboxUI;
