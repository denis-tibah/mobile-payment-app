import { Keyboard, KeyboardAvoidingView, Text, View } from "react-native";
import Button from "../Button";
import { useEffect, useState } from "react";
import { styles } from "./styles";

export function KeyboardDismiss() {
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardOpen(false)
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <View style={{ zIndex: 100000 }}>
      {keyboardOpen && (
        <KeyboardAvoidingView behavior="padding" style={styles.component}>
          <Button color="black" onPress={Keyboard.dismiss}>
            Done
          </Button>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
