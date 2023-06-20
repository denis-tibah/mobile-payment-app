import { cloneElement, useEffect, useRef, useState } from "react";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { Text, View, TextInput, Platform, Pressable } from "react-native";
import { input, formGroup, textarea, pinCode } from "./styles";
import EyeIcon from "../../assets/icons/Eye";
import EyeClosedIcon from "../../assets/icons/EyeClosed";

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
  iconColor = "medium-grey",
  iconSize = 16,
  type = "text",
  value,
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
      <TextInput style={textarea.input} multiline {...props} />
    </View>
  );
}

export function Select({ children, ...props }: any) {
  const [option, setOption] = useState();
  return (
    <View style={input.wrapper}>
      <Picker style={input.input} {...props}>
        {children}
      </Picker>
    </View>
  );
}

export function Option({ label, value, enabled, ...props }: any) {
  if (Platform.OS === "ios") return <PickerIOS.Item {...props} />;

  return <Picker.Item {...props} />;
}

export function Password({ icon, rightIcon = false, ...props }: any) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={input.wrapper}>
      {icon && (
        <View style={input.icon}>
          {cloneElement(icon, { color: "medium-grey", size: 16 })}
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
    <View style={pinCode.wrapper}>
      {[...Array(fieldCount)].map((item, i) => (
        <TextInput
          key={i}
          ref={(ref) => (inputs.current[i] = ref)}
          maxLength={1}
          style={pinCode.input}
          returnKeyType="done"
          keyboardType="numeric"
          onChangeText={(text) => handleTextChange(text, i)}
          // onSubmitEditing={() => focusInput(i + 1)}
          onKeyPress={(event) => handleKeyPress(event, i)}
          {...props}
        />
      ))}
    </View>
  );
};

FormGroup.Input = Input;
FormGroup.Label = Label;
FormGroup.TextArea = TextArea;
FormGroup.Select = Select;
FormGroup.Option = Option;
FormGroup.Password = Password;
