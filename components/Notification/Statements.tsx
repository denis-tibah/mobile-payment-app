import { useState, useEffect, useRef, FC, Fragment } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

import Typography from "../Typography";
import Button from "../Button";
import WholeContainer from "../../layout/WholeContainer";
import useGeneratePDF from "../../hooks/useGeneratePDF";
import { styles } from "./style";

interface IStatements {
  onCloseBottomSheet: () => void;
  message: string;
  dateFrom: string;
  dateTo: string;
}

const Statements: FC<IStatements> = ({
  onCloseBottomSheet,
  message,

  dateFrom,
  dateTo,
}) => {
  const { navigate }: any = useNavigation();
  const { handleSetDate, isGeneratingPDF } = useGeneratePDF();

  const auth = useSelector((state: any) => state.auth);
  const userId = auth?.userData?.id;

  return (
    <Fragment>
      <WholeContainer>
        <View style={{ paddingVertical: 32 }}>
          {/* <Typography
            fontFamily="Mukta-Regular"
            fontSize={14}
            fontWeight={"400"}
            color="#696F7A"
            marginBottom={16}
          >
            You can download your{" "}
            <Typography
              fontFamily="Mukta-Bold"
              fontSize={14}
              fontWeight={"700"}
            >
              {previousMonth} {currentYear}
            </Typography>{" "}
            statement
          </Typography> */}
          <Typography
            fontFamily="Mukta-Regular"
            fontSize={14}
            fontWeight={"400"}
            textAlign="center"
            marginBottom={16}
          >
            {message}
          </Typography>
          <Button
            color="light-blue"
            onPress={() => {
              handleSetDate({
                previousMonthFirstDay: dateFrom,
                lastDateOfPrevMonth: dateTo,
                userId,
              });
            }}
            leftIcon={<Feather color="#086AFB" size={16} name={"download"} />}
            disabled={isGeneratingPDF}
          >
            <Typography
              fontWeight="600"
              fontSize={16}
              fontFamily="Nunito-SemiBold"
            >
              {isGeneratingPDF
                ? "Downloading..."
                : "Download monthly statement"}
            </Typography>
          </Button>
        </View>
      </WholeContainer>
      <View style={styles.footerContent}>
        <View style={styles.downloadBtnMain}>
          <TouchableWithoutFeedback
            onPress={() => {
              onCloseBottomSheet();
              navigate("statements");
            }}
          >
            <View>
              <Typography
                fontFamily="Nunito-Regular"
                fontSize={14}
                fontWeight={"300"}
                color="#E7038E"
              >
                Check your statements statement
              </Typography>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Fragment>
  );
};

export default Statements;
