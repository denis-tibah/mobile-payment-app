import { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./styles";
import Typography from "../Typography";
import Box from "../Box";
import { api } from "../../api";
import { getCurrency } from "../../utils/helpers";
import { getAccountDetails } from "../../redux/account/accountSlice";
import { RootState } from "../../store";

export function IncomeBox() {
  const userData = useSelector((state: RootState) => state.auth.userData);
  const infoData = useSelector((state: RootState) => state.account.details);
  const dispatch = useDispatch();

  const getUserInfo = async () => {
    if (userData) await dispatch<any>(getAccountDetails(userData.id));
  };

  useEffect(() => {
    if (!!userData?.id) {
      if (!infoData || !Object.keys(infoData)?.length) getUserInfo();
    }
  }, [userData?.id, infoData]);

  return (
    <View style={styles.incomeBox}>
      <Box style={styles.incomeBox__box}>
        <Box style={styles.incomeBox__box__item}>
          <Typography
            fontFamily="Nunito-SemiBold"
            color="accent-blue"
            style={styles.imcome__groupTypography}
          >
            Amount:
          </Typography>
          <Typography fontFamily="Mukta-Regular" fontSize={16}>
            {getCurrency(infoData?.currency)}
            {infoData?.curbal || "0.00"}
          </Typography>
        </Box>
        <Box style={styles.incomeBox__box__item}>
          <Typography
            fontFamily="Nunito-SemiBold"
            color="accent-blue"
            style={styles.imcome__groupTypography}
          >
            BIC:
          </Typography>
          <Box>
            <Typography fontFamily="Mukta-Regular" fontSize={16}>
              {infoData?.info?.bic}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box style={styles.incomeBox__box}>
        <Box style={styles.incomeBox__box__item}>
          <Typography
            fontFamily="Nunito-SemiBold"
            color="accent-blue"
            style={styles.imcome__groupTypography}
          >
            IBAN:
          </Typography>
          <Box>
            <Typography fontFamily="Mukta-Regular" fontSize={16}>
              {infoData?.info?.iban}
            </Typography>
          </Box>
        </Box>
      </Box>
    </View>
  );
}
