import { isValidElement, useState, useEffect } from "react";
import { Modal as ReactNativeModal, View } from "react-native";
import Typography from "../Typography";
import { styles } from "./styles";

// variant prop = "failed" | "success" | "info"
export function Modal({
  isOpen = false,
  variant = "",
  headerTitle,
  renderHeader,
  footer,
  body,
  children,
  animationType = "slide",
  ...props
}: any) {
  // bugfix for ios
  const [modalIntervalFinished, setModalIntervalFinished] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setModalIntervalFinished(true);
      }, 250);
    }
  }, [isOpen]);

  if (footer && !isValidElement(footer)) {
    console.error("footer component is not a valid react element");
  }

  if (body && !isValidElement(body)) {
    console.error("body component is not a valid react element");
  }

  function getHeaderTextColor() {
    if (variant === "info" || variant === "failed" || variant === "success") {
      return "white";
    }
  }

  return (
    isOpen && (
      <View style={styles.centeredView}>
        <ReactNativeModal
          animationType={animationType}
          transparent
          {...props}
          visible={modalIntervalFinished && isOpen}
        >
          <View style={styles.centeredView}>
            <View style={styles.shadowBox}>
              {headerTitle && (
                <View style={[styles.header, styles[variant]]}>
                  <Typography
                    fontFamily="Nunito-SemiBold"
                    fontSize={18}
                    color={getHeaderTextColor()}
                  >
                    {headerTitle}
                  </Typography>
                </View>
              )}
              {renderHeader && renderHeader()}
              {body && <View style={styles.body}>{body}</View>}
              {children && <View style={styles.body}>{children}</View>}
              {footer && <View style={styles.footer}>{footer}</View>}
            </View>
          </View>
        </ReactNativeModal>
      </View>
    )
  );
}
