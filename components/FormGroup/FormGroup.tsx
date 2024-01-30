import { cloneElement, useEffect, useRef, useState } from "react";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Clipboard from "expo-clipboard";
import { Text, View, TextInput, Platform, Pressable } from "react-native";
import Checkbox from "expo-checkbox";

import { input, formGroup, textarea, pinCode, checkbox } from "./styles";
import EyeIcon from "../../assets/icons/Eye";
import EyeClosedIcon from "../../assets/icons/EyeClosed";
import vars from "../../styles/vars";
import { TouchableOpacity } from "react-native-gesture-handler";
import Button from "../Button";

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

export function TextArea({ ...props }) {
  return (
    <View style={textarea.wrapper}>
      <TextInput style={textarea.input} {...props} />
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
      <View style={
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: 215,
          height: 50,
          borderWidth: 1,
          borderRadius: 10,
          borderColor: '#6BA6FD',
          padding: 16,
          marginTop: 10,
        }
      }>
        <TextInput
          style={{
            width: 215,
            letterSpacing: 22,
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
          <View style={{display: 'flex', flexDirection: 'row'}}>
            {[...Array(fieldCount)].map((item, i) => (
            <Text 
              key={i}
              style={{
                width: 18,
                top: -12,
                marginLeft: 6,
                marginRight: 6,
                borderBottomWidth: 1,
              }}>
            </Text>
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
export function CheckboxUI({ label, ...props }: any) {
  return (
    <View style={checkbox.container}>
      <View style={checkbox.checkboxContainer}>
        <Checkbox {...props} />
        <Text style={checkbox.label}>{label}</Text>
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
