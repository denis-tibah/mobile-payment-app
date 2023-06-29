import { Text, View } from "react-native";
import { formatDateTableValue } from "../../utils/helpers";
import { styles } from "./styles";
import ArrowDown from "../../assets/icons/ArrowDown";
import CalenderEmptyIcon from "../../assets/icons/CalenderEmpty";
import Box from "../Box";
import Typography from "../Typography";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useState } from "react";

export function PayeeItem({ data }: any) {
  const [isOpen, setIsOpen] = useState(false);

  const singleTap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((event, success) => {
      if (success) {
        setIsOpen(!isOpen);
      }
    });

  return (
    <>
      <GestureDetector gesture={Gesture.Exclusive(singleTap)}>
        <View style={styles.rowFront}>
          <View style={[styles.base, isOpen && styles.isOpen]}>
            <Box width="30%">
              <Text>
            
                {data?.name?.length > 30
                  ? data?.name?.substring(0, 30) + "..."
                  : data?.name}
                
              </Text>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              width="30%"
            >
              <CalenderEmptyIcon size={14} color="blue" />
              <Typography fontSize={16} >
                {" "}
                {formatDateTableValue(
                  data?.created_at.slice(0, 10) || "29/01/2022"
                )}
              </Typography>
            </Box>
            <Box style={styles.cell}>
              {isOpen ? <ArrowDown color="blue" /> : <ArrowDown color="blue" />}
            </Box>
          </View>
        </View>
      </GestureDetector>

      {isOpen && (
        <Box>
          <Box style={styles.separator}></Box>
          <Box style={styles.rowDetail}>
            <Box style={styles.detailMobileContainer}>
              <Box style={styles.detailMobileWrapper}>
                <Box style={styles.cardDetails}>
                  <Box style={{ ...styles.detailMobile, ...styles.iban }}>
                    <Text style={styles.nameDetailMobile}>IBAN:</Text>
                    <Text style={styles.valueDetailMobile}>{data?.iban}</Text>
                  </Box>
                  <Box style={{ ...styles.detailMobile, ...styles.bic }}>
                    <Text style={styles.nameDetailMobile}>BIC:</Text>
                    <Text style={styles.valueDetailMobile}>{data?.bic}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
