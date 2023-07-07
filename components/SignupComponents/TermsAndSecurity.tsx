import { FC } from "react";
import { View, Text } from "react-native";

import Typography from "../../components/Typography";
import { Seperator } from "../../components/Seperator/Seperator";
import vars from "../../styles/vars";
import { styles } from "./styles";

interface ITermsAndSecurity {
  handlePrevStep: () => void;
  handleNextStep: () => void;
}

const TermsAndSecurity: FC<ITermsAndSecurity> = ({
  handlePrevStep,
  handleNextStep,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitle}>
        <Typography fontSize={18} fontFamily="Nunito-SemiBold" fontWeight="600">
          Terms and Security
        </Typography>
      </View>
      <Seperator backgroundColor={vars["grey"]} marginBottom={24} />
    </View>
  );
};

export default TermsAndSecurity;
