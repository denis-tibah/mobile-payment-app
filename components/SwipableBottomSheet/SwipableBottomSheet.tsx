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
}: any) => {
  return (
    <RBSheet
      ref={rbSheetRef}
      closeOnDragDown={closeOnDragDown}
      closeOnPressMask={closeOnPressMask}
      height={height}
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
