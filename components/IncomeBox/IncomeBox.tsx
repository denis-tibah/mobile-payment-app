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
import { getPendingAmount } from "../../utils/helpers";

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
            <Box style={styles.incomeBox__box__title1}>
              <Typography
                fontFamily="Nunito-SemiBold"
                color="accent-blue"
                fontSize={13}
                style={styles.imcome__groupTypography}
              >
                Current
              </Typography>
           
            </Box>
            <Box style={styles.incomeBox__box__title1}>
              <Typography
                fontFamily="Nunito-SemiBold"
                color="accent-blue"
                fontSize={13}
                style={styles.imcome__groupTypography}
              >
              </Typography>
            </Box>
            <Box style={styles.incomeBox__box__title1}>
              <Typography
                fontFamily="Nunito-SemiBold"
                color="accent-blue"
                fontSize={13}
                style={styles.imcome__groupTypography}
              >
                Available
              </Typography>
            
            </Box>
      </Box>

      <Box style={styles.incomeBox__box}>
            <Box style={styles.incomeBox__box__title2}>
              <Typography
                fontFamily="Nunito-SemiBold"
                color="accent-blue"
                fontSize={16}
                style={styles.imcome__groupTypography}
              >
                Balance:
              </Typography>
           
            </Box>
            <Box style={styles.incomeBox__box__title2}>
              <Typography
                fontFamily="Nunito-SemiBold"
                color="accent-blue"
                fontSize={16}
                style={styles.imcome__groupTypography}
              >
                Pending:
              </Typography>
            
            </Box>
            <Box style={styles.incomeBox__box__title2}>
              <Typography
                fontFamily="Nunito-SemiBold"
                color="accent-blue"
                fontSize={16}
                style={styles.imcome__groupTypography}
              >
                Balance:
              </Typography>
            
            </Box>
      </Box>

      <Box style={styles.incomeBox__box}>
            <Box style={styles.incomeBox__box__balances}>
            
              <Typography fontFamily="Mukta-Regular" fontSize={16}>
                {getCurrency(infoData?.currency)}
                {infoData?.curbal || "0.00"}
              </Typography>
            </Box>
            <Box style={styles.incomeBox__box__balances}>
          
              <Typography color="#E53CA9" fontFamily="Mukta-Regular" fontSize={16}>
                {getCurrency(infoData?.currency)}
                {getPendingAmount(infoData?.opnbal,infoData?.curbal) || "0.00"}
              
              </Typography>
            </Box>
            <Box style={styles.incomeBox__box__balances}>
          
              <Typography fontFamily="Mukta-Regular" fontSize={16}>
                {getCurrency(infoData?.currency)}
                {infoData?.avlbal || "0.00"}
              </Typography>
            </Box>
      </Box>

      <Box style={styles.incomeBox__box}>
        <Box style={styles.incomeBox__box__bic}>
            <Typography
              fontFamily="Nunito-SemiBold"
              color="accent-blue"
              style={styles.imcome__groupTypography}
            >
              BIC:
            </Typography>
            <Box>
              <Typography fontFamily="Mukta-Regular" fontSize={14}>
                {infoData?.info?.bic}
              </Typography>
            </Box>
          </Box>
        </Box>
      <Box style={styles.incomeBox__box}>
        <Box style={styles.incomeBox__box__iban}>
          <Typography
            fontFamily="Nunito-SemiBold"
            color="accent-blue"
            style={styles.imcome__groupTypography}
          >
            IBAN:
          </Typography>
          <Box>
            <Typography fontFamily="Mukta-Regular" fontSize={14}>
              {infoData?.info?.iban}
            </Typography>
          </Box>
        </Box>
      </Box>
    </View>
  );
}
