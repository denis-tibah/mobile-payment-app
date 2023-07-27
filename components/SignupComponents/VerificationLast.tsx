import { FC } from "react";
import { View } from "react-native";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface IVerificationLast {
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

const VerificationLast: FC<IVerificationLast> = ({
  handleNextStep,
  handlePrevStep,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Verification last
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
      <View>
        <View style={styles.cardBody}></View>
      </View>
    </View>
  );
};

export default VerificationLast;
