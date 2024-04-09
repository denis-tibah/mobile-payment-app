import RBSheet from "react-native-raw-bottom-sheet";
import { ScrollView, Pressable, SafeAreaView } from "react-native";

const SwipableBottomSheet = ({
  rbSheetRef,
  closeOnDragDown,
  closeOnPressMask,
  height,
  wrapperStyles,
  containerStyles,
  draggableIconStyles,
  children,
  onClose,
}: any) => {
  return (
    <RBSheet
      ref={rbSheetRef}
      closeOnDragDown={closeOnDragDown}
      closeOnPressMask={closeOnPressMask}
      height={height}
      onClose={onClose}
      dragable
      customStyles={{
        wrapper: {
          ...wrapperStyles,
        },
        container: {
          ...containerStyles,
        },
        draggableIcon: {
          ...draggableIconStyles,
        },
      }}
      customAvoidingViewProps={{
        enabled: true,
        keyboardShouldPersistTaps: "always",
        behavior: "padding",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <Pressable>{children}</Pressable>
        </ScrollView>
      </SafeAreaView>
    </RBSheet>
  );
};

export { SwipableBottomSheet };
