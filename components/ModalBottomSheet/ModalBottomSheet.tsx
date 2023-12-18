import React, { Fragment, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import BottomSheet from "../../components/BottomSheet";

export default function ModalBottomSheet({
  isOpen,
  hasNoHeaderPadding,
  children,
  contentHeight,
}: any) {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      setIsOpenModal(false);
    };
  }, []);

  useEffect(() => {
    setIsOpenModal(isOpen);
  }, [isOpen]);

  return (
    <Fragment>
      <View style={styles.container}>
        <BottomSheet
          isVisible={isOpenModal}
          onClose={() => setIsOpenModal(!isOpenModal)}
          hasNoHeaderPadding={hasNoHeaderPadding}
        >
          <View style={{ height: contentHeight }}>{children}</View>
        </BottomSheet>
      </View>
    </Fragment>
  );
}

const styles: any = StyleSheet.create<any>({
  container: {
    position: "absolute",
    top: 71,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255, 0.8)",
    height: "100%",
    width: "100%",
    zIndex: 999,
  },
});
