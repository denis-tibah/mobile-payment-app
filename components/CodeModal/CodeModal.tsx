import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import vars from "../../styles/vars";
import TransactionIcon from "../../assets/icons/Transaction";
import { Modal } from "../Modal/Modal";
import Button from "../Button";
import { PinCodeInputBoxes } from "../FormGroup/FormGroup";

type CodeModalProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  confirmButtonText?: string;
  onSubmit: (data: { code: string }) => void;
  onCancel: () => void;
  loading?: boolean;
  handleResendSMSVerificationCode?: () => void;
};

export const CodeModal = ({
  isOpen,
  title,
  subtitle,
  onSubmit,
  onCancel,
  confirmButtonText,
  loading,
  handleResendSMSVerificationCode,
}: CodeModalProps) => {
  const [code, setCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const [isTimeToCountDown, setIsTimeToCountDown] = useState<boolean>(false);
  const enableResend = timeRemaining === 0;

  const handlePinCodeChange = (value: string) => {
    setCode(value);
  };

  const _handleResendSMSVerificationCode = () => {
    setIsTimeToCountDown(true);
    if (handleResendSMSVerificationCode) {
      handleResendSMSVerificationCode();
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimeToCountDown) {
      interval = setInterval(() => {
        if (timeRemaining > 0) {
          setTimeRemaining(timeRemaining - 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
    if (enableResend) {
      setIsTimeToCountDown(false);
      setTimeRemaining(60);
    }
    return () => {
      clearInterval(interval);
    };
  }, [timeRemaining, isTimeToCountDown]);

  return (
    <Modal
      isOpen={isOpen}
      footer={
        <View style={styles.buttonContainer}>
          <Button
            style={styles.confirmButton}
            color="light-pink"
            disabled={loading}
            loading={loading}
            onPress={() => onSubmit({ code })}
            leftIcon={<TransactionIcon size={18} color="pink" />}
          >
            {confirmButtonText || "Confirm payment"}
          </Button>
          <Button color="grey" onPress={onCancel}>
            Cancel
          </Button>
        </View>
      }
      renderHeader={() => (
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      )}
    >
      <View style={styles.container}>
        <PinCodeInputBoxes fieldCount={6} onChange={handlePinCodeChange} />
        <Text style={styles.noCode}>Did not get a verification code?</Text>
        <TouchableOpacity
          onPress={_handleResendSMSVerificationCode}
          disabled={isTimeToCountDown}
        >
          {isTimeToCountDown ? (
            <Text style={styles.noCodeResend}>
              Wait for {timeRemaining}s to request again.
            </Text>
          ) : (
            <Text style={styles.noCodeResend}>Resend verification code</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    textAlign: "center",
  },
  noCode: {
    color: vars["accent-pink"],
    fontSize: 14,
    fontWeight: "400",
    marginTop: 12,
  },
  noCodeResend: {
    color: vars["accent-pink"],
    fontSize: 12,
    fontWeight: "400",
    marginTop: 12,
  },
  transactionDetails: {
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "400",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  confirmButton: {
    marginRight: 10,
  },
  headerTitleBox: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderBottomColor: "#DDDDDD",
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  headerSubtitle: {
    color: "#696F7A",
    fontSize: 14,
    fontWeight: "300",
    paddingTop: 12,
  },
});
